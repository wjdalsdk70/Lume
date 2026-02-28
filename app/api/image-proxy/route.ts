import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set([
  'www.git-ranker.com',
  'git-ranker.com',
  'mazassumnida.wtf',
  'lume-self.vercel.app',
  'localhost:3000',
]);

function isAllowedUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    return ALLOWED_HOSTS.has(parsed.host);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get('src') || '';

  if (!src || !isAllowedUrl(src)) {
    return new NextResponse('Invalid src', { status: 400 });
  }

  const upstream = await fetch(src, { cache: 'no-store' });
  if (!upstream.ok) {
    return new NextResponse('Upstream fetch failed', { status: 502 });
  }

  const contentType = upstream.headers.get('content-type') || 'image/svg+xml';
  const bytes = await upstream.arrayBuffer();

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    },
  });
}
