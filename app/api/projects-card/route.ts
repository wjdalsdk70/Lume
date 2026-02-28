import { NextRequest, NextResponse } from 'next/server';

function clampText(value: string, max = 80): string {
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

type ProjectRow = {
  name: string;
  description: string;
  period: string;
  stack: string;
};

const THEMES: Record<string, { darkStart: string; darkEnd: string; accent: string; lightStart: string; lightEnd: string }> = {
  ocean: { darkStart: '#0B1026', darkEnd: '#020617', accent: '#67E8F9', lightStart: '#E0F2FE', lightEnd: '#F8FAFC' },
  sunset: { darkStart: '#2D132C', darkEnd: '#120E1A', accent: '#FB7185', lightStart: '#FCE7F3', lightEnd: '#FFF1F2' },
  forest: { darkStart: '#052E2B', darkEnd: '#021A18', accent: '#34D399', lightStart: '#DCFCE7', lightEnd: '#F0FDF4' },
  amber: { darkStart: '#2A1A05', darkEnd: '#1A1205', accent: '#FBBF24', lightStart: '#FEF3C7', lightEnd: '#FFFBEB' },
};

function parseProjects(input: string): ProjectRow[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '-', description = '-', period = '-', stack = '-'] = line.split('|').map((part) => clampText(part, 64));
      return { name, description, period, stack };
    })
    .slice(0, 6);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawProjects = searchParams.get('projects') || '';
  const mode = searchParams.get('mode') === 'light' ? 'light' : 'dark';
  const themeKey = searchParams.get('theme') || 'ocean';
  const tone = THEMES[themeKey] || THEMES.ocean;
  const projects = parseProjects(rawProjects);
  const palette =
    mode === 'light'
      ? {
          bgStart: tone.lightStart,
          bgEnd: tone.lightEnd,
          frameStroke: 'rgba(15,23,42,0.14)',
          title: tone.accent,
          rowFill: 'rgba(255,255,255,0.88)',
          rowStroke: 'rgba(15,23,42,0.12)',
          name: '#0F172A',
          detail: '#334155',
        }
      : {
          bgStart: tone.darkStart,
          bgEnd: tone.darkEnd,
          frameStroke: 'rgba(255,255,255,0.12)',
          title: tone.accent,
          rowFill: 'rgba(2,6,23,0.46)',
          rowStroke: 'rgba(255,255,255,0.10)',
          name: '#F8FAFC',
          detail: '#CBD5E1',
        };

  const rowHeight = 68;
  const headerHeight = 52;
  const contentHeight = Math.max(1, projects.length) * rowHeight;
  const totalHeight = headerHeight + contentHeight + 28;

  const projectRowsSvg = projects.length
    ? projects
        .map((project, index) => {
          const y = 56 + index * rowHeight;
          return `
    <rect x="20" y="${y}" width="984" height="58" rx="10" fill="${palette.rowFill}" stroke="${palette.rowStroke}" />
    <text x="36" y="${y + 22}" fill="${palette.name}" font-family="Arial, sans-serif" font-size="16" font-weight="700">${escapeXml(project.name)}</text>
    <text x="36" y="${y + 42}" fill="${palette.detail}" font-family="Arial, sans-serif" font-size="13">${escapeXml(project.description)} | ${escapeXml(project.period)} | ${escapeXml(project.stack)}</text>
  `;
        })
        .join('')
    : `<text x="20" y="92" fill="#94A3B8" font-family="Arial, sans-serif" font-size="14">No project rows provided.</text>`;

  const svg = `
  <svg width="1024" height="${totalHeight}" viewBox="0 0 1024 ${totalHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Projects card">
    <defs>
      <linearGradient id="projectsBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.bgStart}" />
        <stop offset="100%" stop-color="${palette.bgEnd}" />
      </linearGradient>
    </defs>

    <rect width="1024" height="${totalHeight}" rx="18" fill="url(#projectsBg)" />
    <rect x="1" y="1" width="1022" height="${totalHeight - 2}" rx="17" fill="none" stroke="${palette.frameStroke}" />
    <text x="20" y="34" fill="${palette.title}" font-family="Arial, sans-serif" font-size="16" font-weight="700">PROJECTS</text>
    ${projectRowsSvg}
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
