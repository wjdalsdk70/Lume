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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const name = clampText(searchParams.get('name') || 'Your Name', 58);
  const role = clampText(searchParams.get('role') || 'Frontend Developer', 72);
  const tagline = clampText(
    searchParams.get('tagline') || 'Building delightful products with code.',
    130,
  );
  const themeKey = searchParams.get('theme') || 'ocean';

  const rawSkills = searchParams.get('skills') || '';
  const skills = rawSkills
    .split(',')
    .map((skill) => clampText(skill, 22))
    .filter(Boolean)
    .slice(0, 7);
  const techSpec = clampText(searchParams.get('techSpec') || 'Next.js 16, React 19, TypeScript', 180);
  const projects = clampText(searchParams.get('projects') || 'README Styler, Dashboard UI', 180);

  const theme = THEMES[themeKey] || THEMES.ocean;

  const safeName = escapeXml(name);
  const safeRole = escapeXml(role);
  const safeTagline = escapeXml(tagline);
  const safeTechSpec = escapeXml(techSpec);
  const safeProjects = escapeXml(projects);

  const skillChips = skills
    .map((skill, index) => {
      const x = 40 + index * 98;
      return `
        <rect x="${x}" y="246" width="90" height="30" rx="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" />
        <text x="${x + 45}" y="266" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">${escapeXml(skill)}</text>
      `;
    })
    .join('');

  const svg = `
  <svg width="1024" height="440" viewBox="0 0 1024 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="README profile card">
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

    <rect width="1024" height="440" rx="24" fill="url(#bg)" />
    <rect x="16" y="16" width="992" height="408" rx="18" fill="none" stroke="rgba(255,255,255,0.08)" />

    <circle cx="900" cy="100" r="56" fill="none" stroke="url(#ring)" stroke-width="8" opacity="0.8" />
    <circle cx="900" cy="100" r="24" fill="${theme.accent}" opacity="0.9" />

    <text x="40" y="92" fill="#E2E8F0" font-family="Arial, sans-serif" font-size="22" opacity="0.88">README STYLER</text>
    <text x="40" y="150" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="48" font-weight="700">${safeName}</text>
    <text x="40" y="192" fill="${theme.sub}" font-family="Arial, sans-serif" font-size="28" font-weight="600">${safeRole}</text>
    <text x="40" y="228" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="20">${safeTagline}</text>

    ${skillChips}

    <rect x="40" y="302" width="944" height="52" rx="14" fill="rgba(15,23,42,0.45)" stroke="rgba(255,255,255,0.1)" />
    <text x="56" y="334" fill="${theme.sub}" font-family="Arial, sans-serif" font-size="16" font-weight="700">TECH SPEC</text>
    <text x="190" y="334" fill="#E2E8F0" font-family="Arial, sans-serif" font-size="15">${safeTechSpec}</text>

    <rect x="40" y="366" width="944" height="52" rx="14" fill="rgba(15,23,42,0.45)" stroke="rgba(255,255,255,0.1)" />
    <text x="56" y="398" fill="${theme.sub}" font-family="Arial, sans-serif" font-size="16" font-weight="700">PROJECTS</text>
    <text x="176" y="398" fill="#E2E8F0" font-family="Arial, sans-serif" font-size="15">${safeProjects}</text>
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
