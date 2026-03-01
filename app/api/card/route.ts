import { NextRequest, NextResponse } from 'next/server';
import {
  siApollographql,
  siAuth0,
  siBootstrap,
  siCloudflare,
  siCss,
  siCypress,
  siDjango,
  siDocker,
  siElectron,
  siExpress,
  siFastapi,
  siFigma,
  siFirebase,
  siFlask,
  siGo,
  siGraphql,
  siGithubactions,
  siHtml5,
  siJavascript,
  siJest,
  siKotlin,
  siKubernetes,
  siLinux,
  siMongodb,
  siMysql,
  siNetlify,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siNginx,
  siOpenjdk,
  siPostman,
  siPostgresql,
  siPrisma,
  siPytorch,
  siPython,
  siReact,
  siRedis,
  siRedux,
  siRust,
  siSass,
  siSpringboot,
  siSqlite,
  siSupabase,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
  type SimpleIcon,
} from 'simple-icons';

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

const SKILL_ICON_MAP: Array<{ aliases: string[]; icon: SimpleIcon }> = [
  { aliases: ['nextjs', 'next.js', 'next'], icon: siNextdotjs },
  { aliases: ['react', 'reactjs'], icon: siReact },
  { aliases: ['typescript', 'ts'], icon: siTypescript },
  { aliases: ['javascript', 'js'], icon: siJavascript },
  { aliases: ['vite'], icon: siVite },
  { aliases: ['tailwind', 'tailwindcss', 'tailwind css'], icon: siTailwindcss },
  { aliases: ['html5', 'html'], icon: siHtml5 },
  { aliases: ['css3', 'css'], icon: siCss },
  { aliases: ['sass', 'scss'], icon: siSass },
  { aliases: ['bootstrap'], icon: siBootstrap },
  { aliases: ['prisma'], icon: siPrisma },
  { aliases: ['nextauth', 'authjs', 'auth.js'], icon: siAuth0 },
  { aliases: ['node', 'nodejs'], icon: siNodedotjs },
  { aliases: ['express', 'expressjs'], icon: siExpress },
  { aliases: ['nestjs', 'nest.js', 'nest'], icon: siNestjs },
  { aliases: ['graphql', 'graph ql'], icon: siGraphql },
  { aliases: ['apollo', 'apollo graphql', 'apollo-graphql'], icon: siApollographql },
  { aliases: ['redux'], icon: siRedux },
  { aliases: ['postgresql', 'postgres', 'psql'], icon: siPostgresql },
  { aliases: ['mysql'], icon: siMysql },
  { aliases: ['sqlite'], icon: siSqlite },
  { aliases: ['mongodb', 'mongo'], icon: siMongodb },
  { aliases: ['redis'], icon: siRedis },
  { aliases: ['firebase'], icon: siFirebase },
  { aliases: ['supabase'], icon: siSupabase },
  { aliases: ['docker'], icon: siDocker },
  { aliases: ['kubernetes', 'k8s'], icon: siKubernetes },
  { aliases: ['linux'], icon: siLinux },
  { aliases: ['nginx'], icon: siNginx },
  { aliases: ['vercel'], icon: siVercel },
  { aliases: ['netlify'], icon: siNetlify },
  { aliases: ['cloudflare'], icon: siCloudflare },
  { aliases: ['github actions', 'githubactions', 'gha'], icon: siGithubactions },
  { aliases: ['jest'], icon: siJest },
  { aliases: ['vitest'], icon: siVitest },
  { aliases: ['cypress'], icon: siCypress },
  { aliases: ['python'], icon: siPython },
  { aliases: ['django'], icon: siDjango },
  { aliases: ['fastapi', 'fast api'], icon: siFastapi },
  { aliases: ['flask'], icon: siFlask },
  { aliases: ['go', 'golang'], icon: siGo },
  { aliases: ['rust'], icon: siRust },
  { aliases: ['java', 'openjdk'], icon: siOpenjdk },
  { aliases: ['kotlin'], icon: siKotlin },
  { aliases: ['spring boot', 'springboot'], icon: siSpringboot },
  { aliases: ['tensorflow'], icon: siTensorflow },
  { aliases: ['pytorch', 'py torch'], icon: siPytorch },
  { aliases: ['figma'], icon: siFigma },
  { aliases: ['postman'], icon: siPostman },
  { aliases: ['electron'], icon: siElectron },
];

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

function normalizeSkill(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9.]/g, '');
}

function getSkillIcon(skill: string): SimpleIcon | null {
  const normalized = normalizeSkill(skill);
  const match = SKILL_ICON_MAP.find((entry) => entry.aliases.some((alias) => normalizeSkill(alias) === normalized));
  return match?.icon || null;
}

function contrastText(hex: string): string {
  const clean = hex.replace('#', '');
  const color = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? '#0F172A' : '#F8FAFC';
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
    .filter(Boolean);
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
  const hasSkills = skills.length > 0;
  const skillColumns = 10;
  const skillChipSize = 42;
  const skillChipGap = 12;
  const skillLabelY = taglineEndY + 34;
  const skillGridY = skillLabelY + 16;
  const skillRows = hasSkills ? Math.ceil(skills.length / skillColumns) : 0;
  const skillsBlockHeight = hasSkills
    ? skillRows * skillChipSize + (skillRows - 1) * skillChipGap
    : 0;
  const certChipY = hasSkills ? skillGridY + skillsBlockHeight + 20 : skillLabelY + 22;
  const hasCerts = certs.length > 0;
  const contentBottomY = hasCerts ? certChipY + 28 : hasSkills ? skillGridY + skillsBlockHeight : skillLabelY;
  const cardHeight = Math.max(320, contentBottomY + 26);
  const taglineText = taglineLines
    .map((line, index) => `<tspan x="40" dy="${index === 0 ? 0 : 24}">${escapeXml(line)}</tspan>`)
    .join('');
  const skillChips = skills
    .map((skill, index) => {
      const col = index % skillColumns;
      const row = Math.floor(index / skillColumns);
      const x = 40 + col * (skillChipSize + skillChipGap);
      const y = skillGridY + row * (skillChipSize + skillChipGap);
      const icon = getSkillIcon(skill);
      const fallbackGlyph = (skill.trim().slice(0, 2) || '?').toUpperCase();
      const iconBg = icon ? `#${icon.hex}` : '#334155';
      const iconFg = icon ? contrastText(iconBg) : '#F8FAFC';
      return `
        <rect x="${x}" y="${y}" width="${skillChipSize}" height="${skillChipSize}" rx="12" fill="${palette.skillFill}" stroke="${palette.skillStroke}" />
        <rect x="${x + 6}" y="${y + 6}" width="30" height="30" rx="15" fill="${iconBg}" />
        ${
          icon
            ? `<g transform="translate(${x + 9} ${y + 9}) scale(1.16)">
        <path d="${icon.path}" fill="${iconFg}" />
      </g>`
            : `<text x="${x + 21}" y="${y + 26}" fill="${iconFg}" font-family="Arial, sans-serif" font-size="10" font-weight="700" text-anchor="middle">${escapeXml(fallbackGlyph)}</text>`
        }
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

    ${
      hasSkills
        ? `<text x="40" y="${skillLabelY}" fill="${palette.skillText}" fill-opacity="0.9" font-family="Arial, sans-serif" font-size="13" letter-spacing="1.6">TECH STACK</text>`
        : ''
    }
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
