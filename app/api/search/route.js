import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const q = new URL(request.url).searchParams.get('q') || '';

  try {
    // FIX: requête paramétrée
    const results = getDb()
      .prepare('SELECT id, name, price FROM products WHERE name LIKE ?')
      .all(`%${q}%`);
    return NextResponse.json({ results });
  } catch (err) {
    console.error('search error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
