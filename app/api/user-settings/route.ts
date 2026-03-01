import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const FALLBACK = {
  uiMode: 'light',
  name: 'Minty Kim',
  role: 'Frontend Engineer',
  tagline: 'Designing clean UX and robust web apps.',
  skills: 'TypeScript,React,Next.js,Tailwind',
  theme: 'ocean',
  externalBadgeUrl: 'https://www.git-ranker.com/api/v1/badges/MDQ6VXNlcjQ4ODMwNTA5',
  baekjoonId: 'wjdalsdk70',
  certBadgesInput: 'AWS SAA,SQLD,정보처리기사',
  projectRowsInput:
    'README Styler|GitHub README 카드 생성 서비스|2026.02 - 진행중|Next.js,TypeScript,Tailwind|github.com/mintydev/readme-styler|readme-styler.vercel.app\\nPortfolio 2.0|개인 포트폴리오 리뉴얼|2025.11 - 2026.01|React,Vite,Firebase|github.com/mintydev/portfolio-2|minty.dev',
};

function pickString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const nodeId = session?.user?.nodeId;

  if (!nodeId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const saved = await prisma.userSettings.findUnique({ where: { nodeId } });

  if (!saved) {
    return NextResponse.json({ settings: FALLBACK });
  }

  return NextResponse.json({
    settings: {
      uiMode: saved.uiMode,
      name: saved.name,
      role: saved.role,
      tagline: saved.tagline,
      skills: saved.skills,
      theme: saved.theme,
      externalBadgeUrl: saved.externalBadgeUrl ?? FALLBACK.externalBadgeUrl,
      baekjoonId: saved.baekjoonId ?? FALLBACK.baekjoonId,
      certBadgesInput: saved.certBadgesInput ?? FALLBACK.certBadgesInput,
      projectRowsInput: saved.projectRowsInput ?? FALLBACK.projectRowsInput,
    },
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const nodeId = session?.user?.nodeId;

  if (!nodeId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;

  const payload = {
    username: session?.user?.username ?? null,
    uiMode: pickString(body.uiMode, FALLBACK.uiMode),
    name: pickString(body.name, FALLBACK.name),
    role: pickString(body.role, FALLBACK.role),
    tagline: pickString(body.tagline, FALLBACK.tagline),
    skills: pickString(body.skills, FALLBACK.skills),
    theme: pickString(body.theme, FALLBACK.theme),
    externalBadgeUrl: pickString(body.externalBadgeUrl, FALLBACK.externalBadgeUrl),
    baekjoonId: pickString(body.baekjoonId, FALLBACK.baekjoonId),
    certBadgesInput: pickString(body.certBadgesInput, FALLBACK.certBadgesInput),
    projectRowsInput: pickString(body.projectRowsInput, FALLBACK.projectRowsInput),
  };

  await prisma.userSettings.upsert({
    where: { nodeId },
    create: {
      nodeId,
      ...payload,
    },
    update: payload,
  });

  return NextResponse.json({ ok: true });
}
