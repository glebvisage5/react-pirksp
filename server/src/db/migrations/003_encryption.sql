ALTER TABLE users ADD COLUMN IF NOT EXISTS email_hash VARCHAR(64);

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
CREATE UNIQUE INDEX IF NOT EXISTS users_email_hash_key ON users (email_hash);
