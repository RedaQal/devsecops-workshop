import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { hashPassword } from '../../../lib/crypto';
import { config } from '../../../lib/config';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { username, password } = await request.json();
  const db = getDb();

  // VULN: injection SQL par concaténation (essayer: admin' --)
  const query =
    "SELECT * FROM users WHERE username = '" + username +
    "' AND password = '" + hashPassword(password) + "'";

  try {
    const user = db.prepare(query).get();
    if (!user) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const signature = crypto.createHmac('sha256', config.sessionSecret).update(user.username).digest('hex');
    const res = NextResponse.json({ message: `Bienvenue ${user.username} (${user.role})` });

    // VULN: cookie de session sans HttpOnly ni Secure + valeur prévisible (Math.random)
    res.cookies.set('session', `${Math.random().toString(36).slice(2)}.${signature}`, {
      httpOnly: false,
      secure: false,
    });
    return res;
  } catch (err) {
    // VULN: fuite d'information, l'erreur SQL brute est renvoyée au client
    return NextResponse.json({ error: err.message, query }, { status: 500 });
  }
}
