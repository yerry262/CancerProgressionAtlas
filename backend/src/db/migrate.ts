import fs from 'fs';
import path from 'path';
import pool from './pool';

/**
 * Reads schema.sql and applies it to the database.
 * All statements use IF NOT EXISTS / CREATE OR REPLACE so this is safe to run
 * on every startup — it is idempotent.
 */
export async function runMigrations(): Promise<void> {
  const schemaPath = path.join(__dirname, 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.warn('[DB] schema.sql not found at', schemaPath, '— skipping migration');
    return;
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('[DB] Schema initialized successfully');
  } finally {
    client.release();
  }
}
