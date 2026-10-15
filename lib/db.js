import Database from 'better-sqlite3';
import os from 'os';
import path from 'path';
import { hashPassword } from './crypto';

let db;

export function getDb() {
  if (db) return db;
  db = new Database(process.env.DB_PATH || path.join(os.tmpdir(), 'workshop.db'));

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, role TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY, name TEXT, price TEXT
    );
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, body TEXT
    );
  `);

  const addUser = db.prepare('INSERT OR IGNORE INTO users (id, username, password, role) VALUES (?, ?, ?, ?)');
  addUser.run(1, 'admin', hashPassword('admin123'), 'admin');
  addUser.run(2, 'alice', hashPassword('alice2024'), 'user');
  addUser.run(3, 'bob', hashPassword('bob2024'), 'user');

  const addProduct = db.prepare('INSERT OR IGNORE INTO products (id, name, price) VALUES (?, ?, ?)');
  addProduct.run(1, 'Laptop', '999');
  addProduct.run(2, 'Keyboard', '49');
  addProduct.run(3, 'Mouse', '25');
  addProduct.run(4, 'Monitor', '199');

  return db;
}
