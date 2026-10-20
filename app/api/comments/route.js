import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = getDb().prepare('SELECT * FROM comments ORDER BY id DESC').all();
    return NextResponse.json(rows);
  } catch (err) {
    console.error('comments error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(request) {
  const { author, body } = await request.json();
  if (typeof author !== 'string' || typeof body !== 'string') {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  getDb().prepare('INSERT INTO comments (author, body) VALUES (?, ?)').run(author, body);
  return NextResponse.json({ ok: true });
}
