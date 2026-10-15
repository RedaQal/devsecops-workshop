import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = getDb().prepare('SELECT * FROM comments ORDER BY id DESC').all();
  return NextResponse.json(rows);
}

export async function POST(request) {
  const { author, body } = await request.json();
  // Ici la requête est paramétrée (sûre), la faille XSS est au rendu côté page
  getDb().prepare('INSERT INTO comments (author, body) VALUES (?, ?)').run(author, body);
  return NextResponse.json({ ok: true });
}
