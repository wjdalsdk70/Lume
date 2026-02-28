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

function splitMultiline(value: string): string[] {
  const lines = value.split(/\r?\n/);
  return lines.length ? lines : [''];
}

async function toDataUri(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${imageUrl}`);
  }

  const contentType = response.headers.get('content-type') || 'image/svg+xml';
  const bytes = await response.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  return `data:${contentType};base64,${base64}`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;

  const name = clampText(searchParams.get('name') || 'Minty Kim', 58);
  const role = clampText(searchParams.get('role') || 'Frontend Engineer', 72);
  const tagline = searchParams.get('tagline') || 'Designing clean UX and robust web apps.';
  const skills = clampText(searchParams.get('skills') || 'TypeScript,React,Next.js,Tailwind', 180);
  const certs = clampText(searchParams.get('certs') || '', 240);
  const theme = clampText(searchParams.get('theme') || 'ocean', 12);

  const username = clampText(searchParams.get('username') || 'mintydev', 28);
  const tier = clampText((searchParams.get('tier') || 'GOLD').toUpperCase(), 16);
  const score = clampText(searchParams.get('score') || '1580', 10);
  const rank = clampText(searchParams.get('rank') || '412', 10);
  const top = clampText(searchParams.get('top') || '12', 6);
  const diff = clampText(searchParams.get('diff') || '+42', 8);
  const externalBadgeUrl = clampText(searchParams.get('externalBadgeUrl') || '', 500);
  const baekjoonId = clampText(searchParams.get('baekjoonId') || '', 32);
  const rawProjects = searchParams.get('projects') || '';
  const projects = rawProjects
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '-', description = '-', period = '-', stack = '-'] = line.split('|').map((part) => clampText(part, 44));
      return { name, description, period, stack };
    })
    .slice(0, 4);

  const cardParams = new URLSearchParams({ name, role, tagline, skills, certs, theme });
  const cardUrl = `${origin}/api/card?${cardParams.toString()}`;

  const badgeParams = new URLSearchParams({
    username,
    tier,
    score,
    rank,
    top,
    diff,
  });
  const localBadgeUrl = `${origin}/api/badge?${badgeParams.toString()}`;
  const rankBadgeUrl = externalBadgeUrl || localBadgeUrl;
  const baekjoonUrl = baekjoonId
    ? `https://mazassumnida.wtf/api/v2/generate_badge?${new URLSearchParams({ boj: baekjoonId }).toString()}`
    : '';
  const rankBadgeProxyUrl = `${origin}/api/image-proxy?${new URLSearchParams({ src: rankBadgeUrl }).toString()}`;
  const baekjoonProxyUrl = baekjoonUrl
    ? `${origin}/api/image-proxy?${new URLSearchParams({ src: baekjoonUrl }).toString()}`
    : '';
  const cardHref = await toDataUri(cardUrl).catch(() => cardUrl);

  const hasBaekjoon = Boolean(baekjoonUrl);
  const certCount = certs
    .split(',')
    .map((cert) => cert.trim())
    .filter(Boolean).length;
  const taglineLineCount = splitMultiline(tagline).length;
  const taglineEndY = 164 + (taglineLineCount - 1) * 24;
  const skillChipY = taglineEndY + 30;
  const certChipY = skillChipY + 38;
  const contentBottomY = certCount > 0 ? certChipY + 28 : skillChipY + 30;
  const cardY = 24;
  const cardHeight = Math.max(320, contentBottomY + 26);
  const badgeY = cardY + cardHeight + 20;
  const badgeHeight = 156;
  const badgeLeftX = 24;
  const badgeGap = hasBaekjoon ? 32 : 0;
  const badgeLeftWidth = hasBaekjoon ? 560 : 1152;
  const badgeRightWidth = hasBaekjoon ? 560 : 0;
  const badgeRightX = badgeLeftX + badgeLeftWidth + badgeGap;
  const projectsY = badgeY + badgeHeight + 20;
  const projectRowHeight = 58;
  const projectTitleHeight = 34;
  const projectContentHeight = Math.max(1, projects.length) * projectRowHeight;
  const projectsHeight = projectTitleHeight + projectContentHeight + 16;
  const totalHeight = projectsY + projectsHeight + 24;
  const projectsSvg = projects.length
    ? projects
        .map((project, index) => {
          const rowY = projectsY + projectTitleHeight + 8 + index * projectRowHeight;
          return `
    <rect x="44" y="${rowY}" width="1112" height="50" rx="10" fill="rgba(2,6,23,0.45)" stroke="rgba(255,255,255,0.08)" />
    <text x="60" y="${rowY + 20}" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="14" font-weight="700">${escapeXml(project.name)}</text>
    <text x="60" y="${rowY + 39}" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="12">${escapeXml(project.description)} | ${escapeXml(project.period)} | ${escapeXml(project.stack)}</text>
  `;
        })
        .join('')
    : `
    <text x="44" y="${projectsY + 58}" fill="#94A3B8" font-family="Arial, sans-serif" font-size="14">No project rows provided.</text>
  `;

  const svg = `
  <svg width="1200" height="${totalHeight}" viewBox="0 0 1200 ${totalHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="README combined preview card">
    <rect width="1200" height="${totalHeight}" rx="24" fill="#020617" />
    <rect x="1" y="1" width="1198" height="${totalHeight - 2}" rx="23" fill="none" stroke="rgba(255,255,255,0.08)" />

    <rect x="24" y="${cardY}" width="1152" height="${cardHeight}" rx="20" fill="rgba(15,23,42,0.65)" />
    <image
      x="24"
      y="${cardY}"
      width="1152"
      height="${cardHeight}"
      href="${escapeXml(cardHref)}"
      preserveAspectRatio="xMidYMid meet"
    />

    <rect x="${badgeLeftX}" y="${badgeY}" width="${badgeLeftWidth}" height="${badgeHeight}" rx="16" fill="rgba(15,23,42,0.65)" />
    <image
      x="${badgeLeftX}"
      y="${badgeY}"
      width="${badgeLeftWidth}"
      height="${badgeHeight}"
      href="${escapeXml(rankBadgeProxyUrl)}"
      preserveAspectRatio="none"
    />

    ${
      hasBaekjoon
        ? `
    <rect x="${badgeRightX}" y="${badgeY}" width="${badgeRightWidth}" height="${badgeHeight}" rx="16" fill="#ffffff" />
    <image
      x="${badgeRightX}"
      y="${badgeY}"
      width="${badgeRightWidth}"
      height="${badgeHeight}"
      href="${escapeXml(baekjoonProxyUrl)}"
      preserveAspectRatio="xMidYMid meet"
    />`
        : ''
    }

    <rect x="24" y="${projectsY}" width="1152" height="${projectsHeight}" rx="16" fill="rgba(15,23,42,0.65)" />
    <text x="44" y="${projectsY + 22}" fill="#67E8F9" font-family="Arial, sans-serif" font-size="14" font-weight="700">PROJECTS</text>
    ${projectsSvg}
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
