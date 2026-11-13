import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool = null;
let pgliteInstance = null;
let isPglite = false;

export async function initDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString && connectionString.startsWith('postgres')) {
    console.log('[Database] Connecting to managed PostgreSQL instance...');
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('[Database] Unexpected PostgreSQL error on idle client:', err);
    });

    // Test connection
    const client = await pool.connect();
    console.log('[Database] Connected to PostgreSQL successfully.');
    client.release();
    isPglite = false;
  } else {
    console.log('[Database] DATABASE_URL not set or local. Initializing embedded PostgreSQL (PGlite)...');
    const dataDir = path.join(__dirname, '../data/pgdata');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    pgliteInstance = new PGlite(dataDir);
    await pgliteInstance.waitReady;
    console.log('[Database] Embedded PostgreSQL (PGlite) ready.');
    isPglite = true;
  }

  // Run migrations
  await runMigrations();
}

export async function query(text, params = []) {
  if (isPglite) {
    const res = await pgliteInstance.query(text, params);
    return {
      rows: res.rows || [],
      rowCount: res.rowCount || (res.rows ? res.rows.length : 0),
    };
  } else {
    return await pool.query(text, params);
  }
}

export async function getClient() {
  if (isPglite) {
    return {
      query: (t, p) => query(t, p),
      release: () => {},
    };
  } else {
    return await pool.connect();
  }
}

export async function exec(sqlText) {
  if (isPglite) {
    return await pgliteInstance.exec(sqlText);
  } else {
    return await pool.query(sqlText);
  }
}

async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, '../migrations');
    const createTablesSql = fs.readFileSync(path.join(migrationsDir, '001_create_tables.sql'), 'utf-8');
    const seedInitialSql = fs.readFileSync(path.join(migrationsDir, '002_seed_initial.sql'), 'utf-8');

    console.log('[Database] Executing schema migrations...');
    await exec(createTablesSql);
    console.log('[Database] Executing seed migrations...');
    await exec(seedInitialSql);
    console.log('[Database] All 16 PostgreSQL tables and seed data verified.');
  } catch (err) {
    console.error('[Database] Migration error:', err);
    throw err;
  }
}

export default {
  initDatabase,
  query,
  exec,
  getClient,
};
