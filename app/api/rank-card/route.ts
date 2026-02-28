import { NextRequest, NextResponse } from 'next/server';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clampText(value: string, max = 32): string {
  return value.trim().slice(0, max);
}

const TIER_COLORS: Record<string, string> = {
  CHALLENGER: '#FB7185',
  DIAMOND: '#60A5FA',
  MASTER: '#A78BFA',
  PLATINUM: '#67E8F9',
  GOLD: '#FBBF24',
  EMERALD: '#34D399',
  SILVER: '#D1D5DB',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const username = clampText(searchParams.get('username') || 'github-user', 28);
  const tier = clampText((searchParams.get('tier') || 'GOLD').toUpperCase(), 18);
  const score = clampText(searchParams.get('score') || '1580', 10);

  const accent = TIER_COLORS[tier] || '#22D3EE';

  const svg = `
  <svg width="1024" height="146" viewBox="0 0 1024 146" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Git ranker style card">
    <defs>
      <linearGradient id="rankBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#1E293B" />
      </linearGradient>
    </defs>

    <rect width="1024" height="146" rx="20" fill="url(#rankBg)" />
    <rect x="1" y="1" width="1022" height="144" rx="19" fill="none" stroke="rgba(255,255,255,0.14)" />

    <text x="36" y="50" fill="#E2E8F0" font-family="Arial, sans-serif" font-size="18" opacity="0.9">GIT RANKER STYLE</text>
    <text x="36" y="95" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="36" font-weight="700">${escapeXml(username)}</text>

    <rect x="600" y="34" width="172" height="44" rx="22" fill="${accent}" fill-opacity="0.16" stroke="${accent}" />
    <text x="686" y="62" text-anchor="middle" fill="${accent}" font-family="Arial, sans-serif" font-size="18" font-weight="700">${escapeXml(tier)}</text>

    <rect x="794" y="34" width="194" height="78" rx="16" fill="rgba(15,23,42,0.8)" stroke="rgba(255,255,255,0.12)" />
    <text x="891" y="62" text-anchor="middle" fill="#94A3B8" font-family="Arial, sans-serif" font-size="14">RANK SCORE</text>
    <text x="891" y="93" text-anchor="middle" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(score)}</text>
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
