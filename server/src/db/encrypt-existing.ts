import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config({ path: "../../.env" });

import { Pool } from "pg";
import { encrypt, hmacHash } from "../utils/crypto";
import { ENCRYPTED_FIELDS } from "../utils/encrypted-fields";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "educrm",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "secret",
});

function looksEncrypted(val: string): boolean {
  if (val.length < 28) return false;
  try {
    const buf = Buffer.from(val, "base64");
    return buf.length >= 28 && val === buf.toString("base64");
  } catch {
    return false;
  }
}

async function encryptTable(client: import("pg").PoolClient, table: string, fields: string[]) {
  const { rows } = await client.query(`SELECT id, ${fields.join(", ")} FROM ${table}`);
  if (rows.length === 0) {
    console.log(`  ${table}: 0 rows — skip`);
    return;
  }

  let updated = 0;
  for (const row of rows) {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;

    for (const f of fields) {
      const val = row[f];
      if (typeof val === "string" && val.length > 0 && !looksEncrypted(val)) {
        sets.push(`${f} = $${idx++}`);
        vals.push(encrypt(val));
      }
    }

    // users.email_hash
    if (table === "users" && row.email && !looksEncrypted(row.email)) {
      sets.push(`email_hash = $${idx++}`);
      vals.push(hmacHash(row.email));
    }

    if (sets.length > 0) {
      vals.push(row.id);
      await client.query(
        `UPDATE ${table} SET ${sets.join(", ")} WHERE id = $${idx}`,
        vals
      );
      updated++;
    }
  }

  console.log(`  ${table}: ${updated}/${rows.length} rows encrypted`);
}

async function main() {
  const client = await pool.connect();
  try {
    console.log("Encrypting all tables...\n");

    for (const [table, fields] of Object.entries(ENCRYPTED_FIELDS)) {
      await encryptTable(client, table, fields);
    }

    console.log("\nDone. All data encrypted.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Encryption failed:", err);
  process.exit(1);
});
