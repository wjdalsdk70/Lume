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
  amber: { bg: '#2A1A05', sub: '#FDE68A', accent: '#F59E0B' },
};

const LIGHT_THEME_BG: Record<
  string,
  {
    start: string;
    end: string;
    role: string;
    tagline: string;
    ringOuter: string;
    ringInner: string;
    certFill: string;
    certStroke: string;
    certText: string;
  }
> = {
  ocean: {
    start: '#E0F2FE',
    end: '#F8FAFC',
    role: '#0F766E',
    tagline: '#155E75',
    ringOuter: '#0891B2',
    ringInner: '#06B6D4',
    certFill: 'rgba(6,182,212,0.14)',
    certStroke: 'rgba(8,145,178,0.38)',
    certText: '#0E7490',
  },
  sunset: {
    start: '#FCE7F3',
    end: '#FFF1F2',
    role: '#BE185D',
    tagline: '#9F1239',
    ringOuter: '#E11D48',
    ringInner: '#FB7185',
    certFill: 'rgba(251,113,133,0.14)',
    certStroke: 'rgba(225,29,72,0.36)',
    certText: '#BE123C',
  },
  forest: {
    start: '#DCFCE7',
    end: '#F0FDF4',
    role: '#166534',
    tagline: '#14532D',
    ringOuter: '#059669',
    ringInner: '#10B981',
    certFill: 'rgba(16,185,129,0.14)',
    certStroke: 'rgba(5,150,105,0.38)',
    certText: '#047857',
  },
  amber: {
    start: '#FEF3C7',
    end: '#FFFBEB',
    role: '#B45309',
    tagline: '#92400E',
    ringOuter: '#D97706',
    ringInner: '#F59E0B',
    certFill: 'rgba(245,158,11,0.16)',
    certStroke: 'rgba(217,119,6,0.38)',
    certText: '#92400E',
  },
};

const DARK_THEME_CERT: Record<string, { fill: string; stroke: string; text: string }> = {
  ocean: { fill: 'rgba(34,211,238,0.18)', stroke: 'rgba(103,232,249,0.45)', text: '#E0F2FE' },
  sunset: { fill: 'rgba(251,113,133,0.18)', stroke: 'rgba(244,63,94,0.45)', text: '#FFE4E6' },
  forest: { fill: 'rgba(52,211,153,0.18)', stroke: 'rgba(16,185,129,0.45)', text: '#DCFCE7' },
  amber: { fill: 'rgba(245,158,11,0.2)', stroke: 'rgba(251,191,36,0.45)', text: '#FEF3C7' },
};

const ROLE_COLORS: Record<string, { dark: string; light: string }> = {
  ocean: { dark: '#BFDBFE', light: '#3B82F6' },
  sunset: { dark: '#FBCFE8', light: '#DB2777' },
  forest: { dark: '#BBF7D0', light: '#16A34A' },
  amber: { dark: '#FDE68A', light: '#D97706' },
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
  const mode = searchParams.get('mode') === 'light' ? 'light' : 'dark';

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
  const lightTone = LIGHT_THEME_BG[themeKey] || LIGHT_THEME_BG.ocean;
  const darkCertTone = DARK_THEME_CERT[themeKey] || DARK_THEME_CERT.ocean;
  const roleTone = ROLE_COLORS[themeKey] || ROLE_COLORS.ocean;
  const palette = mode === 'light'
    ? {
        bgStart: lightTone.start,
        bgEnd: lightTone.end,
        name: '#0F172A',
        role: roleTone.light,
        tagline: lightTone.tagline,
        ringOuter: lightTone.ringOuter,
        ringInner: lightTone.ringInner,
        skillFill: 'rgba(15,23,42,0.08)',
        skillStroke: 'rgba(15,23,42,0.18)',
        skillText: '#0F172A',
        certFill: lightTone.certFill,
        certStroke: lightTone.certStroke,
        certText: lightTone.certText,
      }
    : {
        bgStart: theme.bg,
        bgEnd: '#020617',
        name: '#FFFFFF',
        role: roleTone.dark,
        tagline: '#CBD5E1',
        ringOuter: theme.accent,
        ringInner: theme.accent,
        skillFill: 'rgba(255,255,255,0.12)',
        skillStroke: 'rgba(255,255,255,0.18)',
        skillText: '#F8FAFC',
        certFill: darkCertTone.fill,
        certStroke: darkCertTone.stroke,
        certText: darkCertTone.text,
      };

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
        <rect x="${x}" y="${skillChipY}" width="90" height="30" rx="15" fill="${palette.skillFill}" stroke="${palette.skillStroke}" />
        <text x="${x + 45}" y="${skillChipY + 20}" fill="${palette.skillText}" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">${escapeXml(skill)}</text>
      `;
    })
    .join('');
  const certChips = certs
    .map((cert, index) => {
      const x = 40 + index * 112;
      return `
        <rect x="${x}" y="${certChipY}" width="104" height="28" rx="14" fill="${palette.certFill}" stroke="${palette.certStroke}" />
        <text x="${x + 52}" y="${certChipY + 18}" fill="${palette.certText}" font-family="Arial, sans-serif" font-size="11" text-anchor="middle">${escapeXml(cert)}</text>
      `;
    })
    .join('');

  const svg = `
  <svg width="1024" height="${cardHeight}" viewBox="0 0 1024 ${cardHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="README profile card">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.bgStart}" />
        <stop offset="100%" stop-color="${palette.bgEnd}" />
      </linearGradient>
      <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.ringOuter}" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.8" />
      </linearGradient>
    </defs>

    <rect width="1024" height="${cardHeight}" rx="24" fill="url(#bg)" />

    <circle cx="900" cy="100" r="56" fill="none" stroke="url(#ring)" stroke-width="8" opacity="0.8" />
    <circle cx="900" cy="100" r="24" fill="${palette.ringInner}" opacity="0.9" />

    <text x="40" y="88" fill="${palette.name}" font-family="Arial, sans-serif" font-size="48" font-weight="700">${safeName}</text>
    <text x="40" y="130" fill="${palette.role}" font-family="Arial, sans-serif" font-size="28" font-weight="600">${safeRole}</text>
    <text x="40" y="164" fill="${palette.tagline}" font-family="Arial, sans-serif" font-size="20">${taglineText}</text>

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
