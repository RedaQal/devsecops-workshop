import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_DIR = path.join(process.cwd(), 'public', 'files');

export async function GET(request) {
  const name = new URL(request.url).searchParams.get('name') || 'welcome.txt';

  try {
    // FIX: liste blanche. On ne lit que un fichier existant dans le dossier autorisé,
    // et le chemin est construit à partir du nom trouvé, jamais de l'entrée brute.
    const match = fs.readdirSync(BASE_DIR).find((f) => f === name);
    if (!match) {
      return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });
    }
    return new NextResponse(fs.readFileSync(path.join(BASE_DIR, match), 'utf8'));
  } catch (err) {
    console.error('file error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
