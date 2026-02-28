'use client';

import { useMemo, useState } from 'react';

type ThemeKey = 'ocean' | 'sunset' | 'forest';

const themeOptions: Array<{ key: ThemeKey; label: string }> = [
  { key: 'ocean', label: 'Ocean' },
  { key: 'sunset', label: 'Sunset' },
  { key: 'forest', label: 'Forest' },
];

const techLogoMap: Record<string, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  react: 'react',
  'next.js': 'nextdotjs',
  nextjs: 'nextdotjs',
  tailwind: 'tailwindcss',
  node: 'nodedotjs',
  docker: 'docker',
  aws: 'amazonaws',
};

type ProjectItem = {
  name: string;
  description: string;
  period: string;
  stack: string;
};

function parseCsv(input: string): string[] {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function makeBadge(label: string, color: string, logo?: string): string {
  const encodedLabel = encodeURIComponent(label.replace(/-/g, '--').replace(/_/g, '__'));
  const logoPart = logo ? `&logo=${encodeURIComponent(logo)}` : '';
  return `https://img.shields.io/badge/${encodedLabel}-${color}?style=for-the-badge${logoPart}`;
}

function parseProjects(input: string): ProjectItem[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '-', description = '-', period = '-', stack = '-'] = line.split('|').map((part) => part.trim());
      return { name, description, period, stack };
    })
    .slice(0, 8);
}

function escapeMd(value: string): string {
  return value.replace(/\|/g, '\\|');
}

export default function Home() {
  const [name, setName] = useState('Minty Kim');
  const [role, setRole] = useState('Frontend Engineer');
  const [tagline, setTagline] = useState('Designing clean UX and robust web apps.');
  const [skills, setSkills] = useState('TypeScript,React,Next.js,Tailwind');
  const [techSpec, setTechSpec] = useState('Next.js 16, React 19, TypeScript, Tailwind CSS');
  const [projects, setProjects] = useState('README Styler, Design System Kit, SaaS Dashboard');
  const [theme, setTheme] = useState<ThemeKey>('ocean');
  const [baseUrl, setBaseUrl] = useState('https://your-domain.com');

  const [githubUsername, setGithubUsername] = useState('mintydev');
  const [rankTier, setRankTier] = useState('GOLD');
  const [rankScore, setRankScore] = useState('1580');
  const [badgeRank, setBadgeRank] = useState('412');
  const [badgeTop, setBadgeTop] = useState('12');
  const [badgeDiff, setBadgeDiff] = useState('+42');
  const [externalBadgeUrl, setExternalBadgeUrl] = useState(
    'https://www.git-ranker.com/api/v1/badges/MDQ6VXNlcjQ4ODMwNTA5',
  );
  const [baekjoonId, setBaekjoonId] = useState('');

  const [techBadgesInput, setTechBadgesInput] = useState('TypeScript,React,Next.js,Tailwind CSS,Node.js');
  const [certBadgesInput, setCertBadgesInput] = useState('AWS SAA,SQLD,정보처리기사');
  const [projectRowsInput, setProjectRowsInput] = useState(
    'README Styler|GitHub README 카드 생성 서비스|2026.02 - 진행중|Next.js,TypeScript,Tailwind\nPortfolio 2.0|개인 포트폴리오 리뉴얼|2025.11 - 2026.01|React,Vite,Firebase',
  );

  const [copied, setCopied] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  const cardPath = useMemo(() => {
    const params = new URLSearchParams({
      name,
      role,
      tagline,
      skills,
      techSpec,
      projects,
      theme,
    });

    return `/api/card?${params.toString()}`;
  }, [name, role, tagline, skills, techSpec, projects, theme]);

  const badgePath = useMemo(() => {
    const params = new URLSearchParams({
      username: githubUsername,
      tier: rankTier,
      score: rankScore,
      rank: badgeRank,
      top: badgeTop,
      diff: badgeDiff,
    });

    return `/api/badge?${params.toString()}`;
  }, [badgeDiff, badgeRank, badgeTop, githubUsername, rankScore, rankTier]);

  const baekjoonCardUrl = useMemo(() => {
    const trimmed = baekjoonId.trim();
    if (!trimmed) return '';
    const params = new URLSearchParams({ boj: trimmed });
    return `https://mazassumnida.wtf/api/v2/generate_badge?${params.toString()}`;
  }, [baekjoonId]);

  const markdownCode = useMemo(() => {
    const safeBase = (baseUrl.trim() || 'https://your-domain.com').replace(/\/$/, '');

    const profileCard = `${safeBase}${cardPath}`;
    const customBadge = externalBadgeUrl.trim();
    const rankBadge = customBadge || `${safeBase}${badgePath}`;

    const techBadges = parseCsv(techBadgesInput).map((tech) => {
      const logo = techLogoMap[tech.toLowerCase()];
      return `![${tech}](${makeBadge(tech, '0ea5e9', logo)})`;
    });

    const certBadges = parseCsv(certBadgesInput).map((cert) => {
      return `![${cert}](${makeBadge(cert, 'f59e0b')})`;
    });

    const projectRows = parseProjects(projectRowsInput).map((item) => {
      return `| ${escapeMd(item.name)} | ${escapeMd(item.description)} | ${escapeMd(item.period)} | ${escapeMd(item.stack)} |`;
    });

    return [
      `[![Git Ranker Badge](${rankBadge})](https://www.git-ranker.com)`,
      '',
      `<p align=\"center\">`,
      `  <img src=\"${profileCard}\" alt=\"${name} README Card\" />`,
      `</p>`,
      ...(baekjoonCardUrl
        ? ['', `<p align="center">`, `  <img src="${baekjoonCardUrl}" alt="${baekjoonId} solved.ac profile" />`, `</p>`]
        : []),
      '',
      '## 기술 스택',
      techBadges.join(' '),
      '',
      '## 자격증',
      certBadges.join(' '),
      '',
      '## 프로젝트 리스트',
      '| 프로젝트 이름 | 소개 | 기간 | 스택 |',
      '| --- | --- | --- | --- |',
      ...projectRows,
    ].join('\n');
  }, [
    baseUrl,
    badgePath,
    baekjoonCardUrl,
    baekjoonId,
    cardPath,
    certBadgesInput,
    externalBadgeUrl,
    name,
    projectRowsInput,
    techBadgesInput,
  ]);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdownCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,#164e63_0%,#020617_45%,#020617_100%)] px-6 py-10 text-slate-100 md:px-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs tracking-[0.18em] text-cyan-200 uppercase">
            README STYLER
          </p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">GitHub README 카드 빌더</h1>
          <p className="mb-8 text-slate-300">프로필 카드 + 배지 + 프로젝트 표를 한 번에 생성합니다.</p>

          <div className="grid gap-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <input value={techSpec} onChange={(e) => setTechSpec(e.target.value)} placeholder="Tech Spec (comma separated)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <input value={projects} onChange={(e) => setProjects(e.target.value)} placeholder="Projects (comma separated)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />

            <div className="grid gap-3 sm:grid-cols-2">
              <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeKey)} className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring">
                {themeOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://your-domain.com" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            </div>

            <div className="mt-2 h-px bg-white/10" />

            <div className="grid gap-3 sm:grid-cols-3">
              <input value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="GitHub Username" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
              <input value={rankTier} onChange={(e) => setRankTier(e.target.value.toUpperCase())} placeholder="Rank Tier (GOLD)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
              <input value={rankScore} onChange={(e) => setRankScore(e.target.value)} placeholder="Rank Score (1580)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input value={badgeRank} onChange={(e) => setBadgeRank(e.target.value)} placeholder="Rank (#412)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
              <input value={badgeTop} onChange={(e) => setBadgeTop(e.target.value)} placeholder="Top Percentile (12)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
              <input value={badgeDiff} onChange={(e) => setBadgeDiff(e.target.value)} placeholder="Diff (+42)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            </div>
            <input
              value={externalBadgeUrl}
              onChange={(e) => setExternalBadgeUrl(e.target.value)}
              placeholder="Git Ranker Badge URL (optional)"
              className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring"
            />
            <input
              value={baekjoonId}
              onChange={(e) => setBaekjoonId(e.target.value)}
              placeholder="Baekjoon ID (optional)"
              className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring"
            />

            <textarea value={techBadgesInput} onChange={(e) => setTechBadgesInput(e.target.value)} placeholder="기술 스택 배지 (comma separated)" rows={2} className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <textarea value={certBadgesInput} onChange={(e) => setCertBadgesInput(e.target.value)} placeholder="자격증 배지 (comma separated)" rows={2} className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <textarea
              value={projectRowsInput}
              onChange={(e) => setProjectRowsInput(e.target.value)}
              placeholder="프로젝트명|소개|기간|스택 (한 줄에 하나)"
              rows={4}
              className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 font-mono text-sm outline-none ring-cyan-300/50 transition focus:ring"
            />
          </div>
        </section>

        <section className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-cyan-200/80">Live Preview</p>
          <div className="space-y-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cardPath} alt="README Card Preview" className="block h-auto w-full rounded-xl" onLoad={() => setPreviewFailed(false)} onError={() => setPreviewFailed(true)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={externalBadgeUrl.trim() || badgePath}
              alt="Rank Badge Preview"
              className="block h-auto w-full rounded-xl"
              onError={() => setPreviewFailed(true)}
            />
            {baekjoonCardUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={baekjoonCardUrl} alt="Baekjoon Card Preview" className="block h-auto w-full rounded-xl bg-white" onError={() => setPreviewFailed(true)} />
            ) : null}
          </div>
          {previewFailed ? <p className="mt-2 text-xs text-rose-300">프리뷰 로드 실패: 입력값을 확인해 주세요.</p> : null}

          <p className="mt-6 mb-2 text-xs uppercase tracking-[0.15em] text-cyan-200/80">Markdown</p>
          <pre className="max-h-80 w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm text-emerald-300">
            <code>{markdownCode}</code>
          </pre>

          <button onClick={copyMarkdown} className="mt-4 w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200">
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
          <p className="mt-3 text-xs text-slate-400">배포 후 base URL을 실제 도메인으로 바꾸면 GitHub에서 바로 렌더링됩니다.</p>
        </section>
      </div>
    </main>
  );
}
