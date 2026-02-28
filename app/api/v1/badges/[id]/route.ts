import { NextRequest, NextResponse } from 'next/server';

type TierStyle = {
  accent: string;
  glow: string;
};

const TIER_STYLES: Record<string, TierStyle> = {
  CHALLENGER: { accent: '#F43F5E', glow: '#FB7185' },
  MASTER: { accent: '#A78BFA', glow: '#C4B5FD' },
  DIAMOND: { accent: '#60A5FA', glow: '#93C5FD' },
  EMERALD: { accent: '#10B981', glow: '#34D399' },
  PLATINUM: { accent: '#22D3EE', glow: '#67E8F9' },
  GOLD: { accent: '#F59E0B', glow: '#FBBF24' },
  SILVER: { accent: '#CBD5E1', glow: '#E2E8F0' },
  BRONZE: { accent: '#D97706', glow: '#F59E0B' },
  IRON: { accent: '#94A3B8', glow: '#CBD5E1' },
};

function clampText(value: string, max = 32): string {
  return value.trim().slice(0, max);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatTop(rawTop: string): string {
  const cleaned = clampText(rawTop.replace('%', ''), 6);
  if (!cleaned) return 'TOP 45%';
  return `TOP ${cleaned}%`;
}

function getDiffColor(diff: string): string {
  const normalized = diff.trim();
  if (normalized.startsWith('+')) return '#34D399';
  if (normalized.startsWith('-')) return '#FB7185';
  return '#CBD5E1';
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);

  const username = clampText(
    searchParams.get('username') || decodeURIComponent(id || 'github-user'),
    28,
  );
  const tier = clampText((searchParams.get('tier') || 'GOLD').toUpperCase(), 16);
  const mode = searchParams.get('mode') === 'light' ? 'light' : 'dark';
  const score = clampText(searchParams.get('score') || '1580', 10);
  const rank = clampText(searchParams.get('rank') || '412', 10);
  const top = formatTop(searchParams.get('top') || '12');
  const diff = clampText(searchParams.get('diff') || '+42', 8);

  const style = TIER_STYLES[tier] || TIER_STYLES.GOLD;
  const diffColor = getDiffColor(diff);
  const palette =
    mode === 'light'
      ? {
          bgStart: '#EEF2FF',
          bgEnd: '#F8FAFC',
          frame: 'rgba(15,23,42,0.14)',
          subtitle: '#64748B',
          username: '#0F172A',
          desc: '#475569',
          statBox: 'rgba(255,255,255,0.86)',
          statStroke: 'rgba(15,23,42,0.12)',
          statLabel: '#64748B',
          statValue: '#0F172A',
        }
      : {
          bgStart: '#0F172A',
          bgEnd: '#111827',
          frame: 'rgba(255,255,255,0.14)',
          subtitle: '#94A3B8',
          username: '#FFFFFF',
          desc: '#CBD5E1',
          statBox: 'rgba(15,23,42,0.84)',
          statStroke: 'rgba(255,255,255,0.11)',
          statLabel: '#94A3B8',
          statValue: '#F8FAFC',
        };

  const svg = `
  <svg width="980" height="156" viewBox="0 0 980 156" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Git Ranker badge">
    <defs>
      <linearGradient id="badgeBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.bgStart}" />
        <stop offset="100%" stop-color="${palette.bgEnd}" />
      </linearGradient>
      <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${style.accent}" />
        <stop offset="100%" stop-color="${style.glow}" />
      </linearGradient>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>

    <rect width="980" height="156" rx="22" fill="url(#badgeBg)" />
    <rect x="1" y="1" width="978" height="154" rx="21" fill="none" stroke="${palette.frame}" />
    <rect x="18" y="18" width="944" height="4" rx="2" fill="url(#accentLine)" />

    <circle cx="916" cy="52" r="18" fill="${style.glow}" opacity="0.34" filter="url(#softGlow)" />
    <circle cx="916" cy="52" r="8" fill="${style.accent}" />

    <text x="30" y="56" fill="${palette.subtitle}" font-family="Arial, sans-serif" font-size="14" letter-spacing="0.15em">GIT RANKER</text>
    <text x="30" y="92" fill="${palette.username}" font-family="Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(
      username,
    )}</text>
    <text x="30" y="120" fill="${palette.desc}" font-family="Arial, sans-serif" font-size="15">Quality-driven contribution badge</text>

    <rect x="330" y="42" width="188" height="44" rx="22" fill="${style.accent}" fill-opacity="0.14" stroke="${style.accent}" />
    <text x="424" y="70" text-anchor="middle" fill="${style.glow}" font-family="Arial, sans-serif" font-size="18" font-weight="700">${escapeXml(
      tier,
    )}</text>

    <g transform="translate(542,34)">
      <rect x="0" y="0" width="94" height="88" rx="14" fill="${palette.statBox}" stroke="${palette.statStroke}" />
      <text x="47" y="28" text-anchor="middle" fill="${palette.statLabel}" font-family="Arial, sans-serif" font-size="12">SCORE</text>
      <text x="47" y="61" text-anchor="middle" fill="${palette.statValue}" font-family="Arial, sans-serif" font-size="26" font-weight="700">${escapeXml(
        score,
      )}</text>
    </g>

    <g transform="translate(648,34)">
      <rect x="0" y="0" width="94" height="88" rx="14" fill="${palette.statBox}" stroke="${palette.statStroke}" />
      <text x="47" y="28" text-anchor="middle" fill="${palette.statLabel}" font-family="Arial, sans-serif" font-size="12">RANK</text>
      <text x="47" y="61" text-anchor="middle" fill="${palette.statValue}" font-family="Arial, sans-serif" font-size="24" font-weight="700">#${escapeXml(
        rank,
      )}</text>
    </g>

    <g transform="translate(754,34)">
      <rect x="0" y="0" width="94" height="88" rx="14" fill="${palette.statBox}" stroke="${palette.statStroke}" />
      <text x="47" y="28" text-anchor="middle" fill="${palette.statLabel}" font-family="Arial, sans-serif" font-size="12">PERCENTILE</text>
      <text x="47" y="61" text-anchor="middle" fill="${palette.statValue}" font-family="Arial, sans-serif" font-size="15" font-weight="700">${escapeXml(
        top,
      )}</text>
    </g>

    <g transform="translate(860,34)">
      <rect x="0" y="0" width="94" height="88" rx="14" fill="${palette.statBox}" stroke="${palette.statStroke}" />
      <text x="47" y="28" text-anchor="middle" fill="${palette.statLabel}" font-family="Arial, sans-serif" font-size="12">D+1 DIFF</text>
      <text x="47" y="61" text-anchor="middle" fill="${diffColor}" font-family="Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(
        diff,
      )}</text>
    </g>
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
