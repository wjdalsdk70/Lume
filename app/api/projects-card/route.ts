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
  const projects = parseProjects(rawProjects);

  const rowHeight = 68;
  const headerHeight = 52;
  const contentHeight = Math.max(1, projects.length) * rowHeight;
  const totalHeight = headerHeight + contentHeight + 28;

  const projectRowsSvg = projects.length
    ? projects
        .map((project, index) => {
          const y = 56 + index * rowHeight;
          return `
    <rect x="20" y="${y}" width="984" height="58" rx="10" fill="rgba(2,6,23,0.46)" stroke="rgba(255,255,255,0.10)" />
    <text x="36" y="${y + 22}" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="16" font-weight="700">${escapeXml(project.name)}</text>
    <text x="36" y="${y + 42}" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="13">${escapeXml(project.description)} | ${escapeXml(project.period)} | ${escapeXml(project.stack)}</text>
  `;
        })
        .join('')
    : `<text x="20" y="92" fill="#94A3B8" font-family="Arial, sans-serif" font-size="14">No project rows provided.</text>`;

  const svg = `
  <svg width="1024" height="${totalHeight}" viewBox="0 0 1024 ${totalHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Projects card">
    <defs>
      <linearGradient id="projectsBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0B1026" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
    </defs>

    <rect width="1024" height="${totalHeight}" rx="18" fill="url(#projectsBg)" />
    <rect x="1" y="1" width="1022" height="${totalHeight - 2}" rx="17" fill="none" stroke="rgba(255,255,255,0.12)" />
    <text x="20" y="34" fill="#67E8F9" font-family="Arial, sans-serif" font-size="16" font-weight="700">PROJECTS</text>
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
