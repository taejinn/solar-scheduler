import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'solar-scheduler.db');

export function getDb() {
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);

  // Initialize tables if they don't exist
  db.pragma('journal_mode = WAL');

  db.prepare(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      dueTime TEXT NOT NULL,
      category TEXT NOT NULL,
      warning TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      fileName TEXT,
      createdAt TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      sleepStart TEXT NOT NULL,
      sleepEnd TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      apiKey TEXT NOT NULL,
      setupComplete INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  return db;
}

export function getApiKey(): string | null {
  try {
    const db = getDb();
    const row = db.prepare('SELECT apiKey FROM settings WHERE id = 1').get() as any;
    db.close();
    return row?.apiKey || null;
  } catch {
    return null;
  }
}
