import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { verifyPassword } from '../../../lib/crypto';
import { config } from '../../../lib/config';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const { username, password } = body;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  try {
    // FIX: requête paramétrée, l'entrée utilisateur n'est jamais concaténée
    const user = getDb().prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const token = crypto.randomBytes(24).toString('hex'); // FIX: CSPRNG au lieu de Math.random
    const signature = crypto.createHmac('sha256', config.sessionSecret).update(token).digest('hex');
    const res = NextResponse.json({ message: `Bienvenue ${user.username} (${user.role})` });

    // FIX: cookie HttpOnly + Secure + SameSite
    res.cookies.set('session', `${token}.${signature}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    return res;
  } catch (err) {
    // FIX: l'erreur détaillée reste dans les logs serveur, le client reçoit un message générique
    console.error('login error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
