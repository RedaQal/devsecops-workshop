import dns from 'dns/promises';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const host = new URL(request.url).searchParams.get('host') || '127.0.0.1';

  // FIX: plus de shell (exec). On résout le nom avec l'API DNS de Node,
  // après validation stricte du format de l'hôte.
  if (!/^[a-zA-Z0-9.-]{1,253}$/.test(host)) {
    return NextResponse.json({ error: 'Hôte invalide' }, { status: 400 });
  }

  try {
    const { address, family } = await dns.lookup(host);
    return NextResponse.json({ host, address, family });
  } catch {
    return NextResponse.json({ error: 'Hôte introuvable' }, { status: 404 });
  }
}
