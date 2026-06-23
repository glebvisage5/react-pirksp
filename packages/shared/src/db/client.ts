import { Pool, PoolConfig } from "pg";

export function createPool(config: PoolConfig & { searchPath?: string }): Pool {
  const { searchPath, ...poolConfig } = config;
  const pool = new Pool({
    ...poolConfig,
    ...(searchPath ? { options: `-c search_path=${searchPath}` } : {}),
  });
  pool.on("error", (err) => {
    console.error("Unexpected DB pool error:", err);
  });
  return pool;
}

export function createDbClient(pool: Pool) {
  async function query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[]
  ): Promise<T[]> {
    const result = await pool.query(text, params);
    return result.rows as T[];
  }

  async function queryOne<T = Record<string, unknown>>(
    text: string,
    params?: unknown[]
  ): Promise<T | null> {
    const rows = await query<T>(text, params);
    return rows[0] ?? null;
  }

  return { query, queryOne, pool };
}
