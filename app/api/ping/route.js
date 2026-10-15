import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const host = new URL(request.url).searchParams.get('host') || '127.0.0.1';

  // VULN: injection de commande, essayer: 127.0.0.1; id
  return new Promise((resolve) => {
    exec('ping -c 1 ' + host, (err, stdout, stderr) => {
      resolve(NextResponse.json({ output: stdout || stderr }));
    });
  });
}
