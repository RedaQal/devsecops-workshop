import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const name = new URL(request.url).searchParams.get('name') || 'welcome.txt';

  // VULN: path traversal, essayer: ../../package.json
  const filePath = path.join(process.cwd(), 'public', 'files', name);

  try {
    return new NextResponse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}
