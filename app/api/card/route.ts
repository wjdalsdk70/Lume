import { NextRequest, NextResponse } from 'next/server';

type Theme = {
  bg: string;
  sub: string;
  accent: string;
};

const THEMES: Record<string, Theme> = {
  ocean: { bg: '#0B1026', sub: '#95A8FF', accent: '#22D3EE' },
  sunset: { bg: '#2D132C', sub: '#F9A8D4', accent: '#FB7185' },
  forest: { bg: '#052E2B', sub: '#86EFAC', accent: '#34D399' },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clampText(value: string, max = 80): string {
  return value.trim().slice(0, max);
}

function splitMultiline(value: string): string[] {
  const lines = value.split(/\r?\n/);
  return lines.length ? lines : [''];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const name = clampText(searchParams.get('name') || 'Your Name', 58);
  const role = clampText(searchParams.get('role') || 'Frontend Developer', 72);
  const tagline = searchParams.get('tagline') || 'Building delightful products with code.';
  const themeKey = searchParams.get('theme') || 'ocean';

  const rawSkills = searchParams.get('skills') || '';
  const skills = rawSkills
    .split(',')
    .map((skill) => clampText(skill, 22))
    .filter(Boolean)
    .slice(0, 5);
  const rawCerts = searchParams.get('certs') || '';
  const certs = rawCerts
    .split(',')
    .map((cert) => clampText(cert, 18))
    .filter(Boolean)
    .slice(0, 4);
  const theme = THEMES[themeKey] || THEMES.ocean;

  const safeName = escapeXml(name);
  const safeRole = escapeXml(role);
  const taglineLines = splitMultiline(tagline);
  const taglineBaseY = 164;
  const taglineLineHeight = 24;
  const taglineEndY = taglineBaseY + (taglineLines.length - 1) * taglineLineHeight;
  const skillChipY = taglineEndY + 30;
  const certChipY = skillChipY + 38;
  const hasCerts = certs.length > 0;
  const contentBottomY = hasCerts ? certChipY + 28 : skillChipY + 30;
  const cardHeight = Math.max(320, contentBottomY + 26);
  const taglineText = taglineLines
    .map((line, index) => `<tspan x="40" dy="${index === 0 ? 0 : 24}">${escapeXml(line)}</tspan>`)
    .join('');
  const skillChips = skills
    .map((skill, index) => {
      const x = 40 + index * 98;
      return `
        <rect x="${x}" y="${skillChipY}" width="90" height="30" rx="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" />
        <text x="${x + 45}" y="${skillChipY + 20}" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">${escapeXml(skill)}</text>
      `;
    })
    .join('');
  const certChips = certs
    .map((cert, index) => {
      const x = 40 + index * 112;
      return `
        <rect x="${x}" y="${certChipY}" width="104" height="28" rx="14" fill="rgba(14,165,233,0.18)" stroke="rgba(125,211,252,0.45)" />
        <text x="${x + 52}" y="${certChipY + 18}" fill="#E0F2FE" font-family="Arial, sans-serif" font-size="11" text-anchor="middle">${escapeXml(cert)}</text>
      `;
    })
    .join('');

  const svg = `
  <svg width="1024" height="${cardHeight}" viewBox="0 0 1024 ${cardHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="README profile card">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${theme.bg}" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${theme.accent}" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.8" />
      </linearGradient>
    </defs>

    <rect width="1024" height="${cardHeight}" rx="24" fill="url(#bg)" />
    <rect x="16" y="16" width="992" height="${cardHeight - 32}" rx="18" fill="none" stroke="rgba(255,255,255,0.08)" />

    <circle cx="900" cy="100" r="56" fill="none" stroke="url(#ring)" stroke-width="8" opacity="0.8" />
    <circle cx="900" cy="100" r="24" fill="${theme.accent}" opacity="0.9" />

    <text x="40" y="88" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="48" font-weight="700">${safeName}</text>
    <text x="40" y="130" fill="${theme.sub}" font-family="Arial, sans-serif" font-size="28" font-weight="600">${safeRole}</text>
    <text x="40" y="164" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="20">${taglineText}</text>

    ${skillChips}
    ${certChips}
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
