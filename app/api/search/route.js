import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const q = new URL(request.url).searchParams.get('q') || '';
  const db = getDb();

  // VULN: injection SQL (UNION), essayer: ' UNION SELECT id, username, password FROM users --
  const query = `SELECT id, name, price FROM products WHERE name LIKE '%${q}%'`;

  try {
    const results = db.prepare(query).all();
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
