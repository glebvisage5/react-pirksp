import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw || raw.length < 32)
    throw new Error("ENCRYPTION_KEY must be at least 32 characters");
  return crypto.createHash("sha256").update(raw).digest();
}

export function encrypt(text: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(encoded: string): string {
  const key = getKey();
  const buf = Buffer.from(encoded, "base64");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const data = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(data) + decipher.final("utf8");
}

export function hmacHash(value: string): string {
  const key = getKey();
  return crypto.createHmac("sha256", key).update(value.toLowerCase().trim()).digest("hex");
}

export function decryptFields<T>(
  obj: T,
  fields: string[]
): T {
  const copy = { ...obj } as Record<string, unknown>;
  for (const f of fields) {
    const val = copy[f];
    if (typeof val === "string" && val.length > 0) {
      try {
        copy[f] = decrypt(val);
      } catch {
        // legacy unencrypted data — leave as-is
      }
    }
  }
  return copy as T;
}
