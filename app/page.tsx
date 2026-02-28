'use client';

import { useMemo, useState } from 'react';

type ThemeKey = 'ocean' | 'sunset' | 'forest';

const themeOptions: Array<{ key: ThemeKey; label: string }> = [
  { key: 'ocean', label: 'Ocean' },
  { key: 'sunset', label: 'Sunset' },
  { key: 'forest', label: 'Forest' },
];
const FIXED_BASE_URL = 'https://lume-self.vercel.app';

type ProjectRow = {
  name: string;
  description: string;
  period: string;
  stack: string;
};

function parseProjectRows(input: string): ProjectRow[] {
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

export default function Home() {
  const [name, setName] = useState('Minty Kim');
  const [role, setRole] = useState('Frontend Engineer');
  const [tagline, setTagline] = useState('Designing clean UX and robust web apps.');
  const [skills, setSkills] = useState('TypeScript,React,Next.js,Tailwind');
  const [theme, setTheme] = useState<ThemeKey>('ocean');

  const [githubUsername, setGithubUsername] = useState('mintydev');
  const [rankTier, setRankTier] = useState('GOLD');
  const [rankScore, setRankScore] = useState('1580');
  const [badgeRank, setBadgeRank] = useState('412');
  const [badgeTop, setBadgeTop] = useState('12');
  const [badgeDiff, setBadgeDiff] = useState('+42');
  const [externalBadgeUrl, setExternalBadgeUrl] = useState(
    'https://www.git-ranker.com/api/v1/badges/MDQ6VXNlcjQ4ODMwNTA5',
  );
  const [badgeRouteId, setBadgeRouteId] = useState('MDQ6VXNlcjQ4ODMwNTA5');
  const [baekjoonId, setBaekjoonId] = useState('wjdalsdk70');

  const [certBadgesInput, setCertBadgesInput] = useState('AWS SAA,SQLD,정보처리기사');
  const [projectRowsInput, setProjectRowsInput] = useState(
    'README Styler|GitHub README 카드 생성 서비스|2026.02 - 진행중|Next.js,TypeScript,Tailwind\nPortfolio 2.0|개인 포트폴리오 리뉴얼|2025.11 - 2026.01|React,Vite,Firebase',
  );

  const [downloadingFormat, setDownloadingFormat] = useState<'svg' | 'png' | null>(null);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  const cardPath = useMemo(() => {
    const params = new URLSearchParams({
      name,
      role,
      tagline,
      skills,
      certs: certBadgesInput,
      projects: projectRowsInput,
      theme,
    });

    return `/api/card?${params.toString()}`;
  }, [certBadgesInput, name, projectRowsInput, role, skills, tagline, theme]);

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

  const projectRows = useMemo(() => parseProjectRows(projectRowsInput), [projectRowsInput]);

  const previewPath = useMemo(() => {
    const params = new URLSearchParams({
      name,
      role,
      tagline,
      skills,
      certs: certBadgesInput,
      projects: projectRowsInput,
      theme,
      username: githubUsername,
      tier: rankTier,
      score: rankScore,
      rank: badgeRank,
      top: badgeTop,
      diff: badgeDiff,
      externalBadgeUrl: externalBadgeUrl.trim(),
      baekjoonId: baekjoonId.trim(),
    });

    return `/api/preview?${params.toString()}`;
  }, [
    baekjoonId,
    badgeDiff,
    badgeRank,
    badgeTop,
    externalBadgeUrl,
    githubUsername,
    name,
    certBadgesInput,
    projectRowsInput,
    rankScore,
    rankTier,
    role,
    skills,
    tagline,
    theme,
  ]);

  const directBadgePath = useMemo(() => {
    const params = new URLSearchParams({
      username: githubUsername,
      tier: rankTier,
      score: rankScore,
      rank: badgeRank,
      top: badgeTop,
      diff: badgeDiff,
    });
    return `/api/v1/badges/${encodeURIComponent(badgeRouteId.trim() || githubUsername)}?${params.toString()}`;
  }, [badgeDiff, badgeRank, badgeRouteId, badgeTop, githubUsername, rankScore, rankTier]);

  const githubReadmeSnippet = useMemo(() => {
    const previewImageUrl = `${FIXED_BASE_URL}${previewPath}`;

    return [
      '<p align="center">',
      `  <img src="${previewImageUrl}" alt="${name} README Preview Card" />`,
      '</p>',
    ].join('\n');
  }, [name, previewPath]);

  async function downloadPreviewImage(format: 'svg' | 'png') {
    setDownloadingFormat(format);
    try {
      const response = await fetch(previewPath, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to download preview image');
      }

      if (format === 'svg') {
        const svgBlob = await response.blob();
        const blobUrl = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${githubUsername || 'readme'}-preview.svg`;
        link.click();
        URL.revokeObjectURL(blobUrl);
        return;
      }

      const svgText = await response.text();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to render SVG as image'));
        img.src = svgUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || 1200;
      canvas.height = image.naturalHeight || 800;
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Canvas context unavailable');
      }
      context.drawImage(image, 0, 0);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create PNG blob'));
            return;
          }
          resolve(blob);
        }, 'image/png');
      });

      URL.revokeObjectURL(svgUrl);

      const pngUrl = URL.createObjectURL(pngBlob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${githubUsername || 'readme'}-preview.png`;
      link.click();
      URL.revokeObjectURL(pngUrl);
    } finally {
      setDownloadingFormat(null);
    }
  }

  function openBadgeRoute() {
    window.open(`${FIXED_BASE_URL}${directBadgePath}`, '_blank', 'noopener,noreferrer');
  }

  async function copyGithubReadmeSnippet() {
    await navigator.clipboard.writeText(githubReadmeSnippet);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 1200);
  }

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_15%,#164e63_0%,#020617_45%,#020617_100%)] px-4 py-4 text-slate-100 md:px-6 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1500px] gap-4 md:min-h-[calc(100vh-3rem)] md:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="min-w-0 h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg md:p-7">
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs tracking-[0.18em] text-cyan-200 uppercase">
            README STYLER
          </p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">GitHub README 카드 빌더</h1>
          <p className="mb-6 text-slate-300">프로필 카드 + 배지 + 프로젝트 표를 한 번에 생성합니다.</p>

          <div className="grid gap-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />
            <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring" />

            <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeKey)} className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring">
              {themeOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>

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
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={badgeRouteId}
                onChange={(e) => setBadgeRouteId(e.target.value)}
                placeholder="Badge Route ID (for /api/v1/badges/{id})"
                className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring"
              />
              <button
                type="button"
                onClick={openBadgeRoute}
                className="rounded-xl border border-cyan-200/50 bg-transparent px-4 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-200/10"
              >
                Open Badge Route
              </button>
            </div>
            <input
              value={baekjoonId}
              onChange={(e) => setBaekjoonId(e.target.value)}
              placeholder="Baekjoon ID (optional)"
              className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 outline-none ring-cyan-300/50 transition focus:ring"
            />

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

        <section className="min-w-0 h-full rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg md:p-6 lg:flex lg:flex-col">
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-cyan-200/80">Live Preview</p>
          <div className="space-y-3 overflow-auto rounded-2xl border border-white/10 bg-slate-950/40 p-3 lg:min-h-0 lg:flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cardPath} alt="README Card Preview" className="block h-auto w-full rounded-xl" onLoad={() => setPreviewFailed(false)} onError={() => setPreviewFailed(true)} />
            <div className="grid gap-3 md:grid-cols-2">
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
            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.14em] text-cyan-200/80">Projects</p>
              <div className="space-y-2">
                {projectRows.map((project, index) => (
                  <div key={`${project.name}-${index}`} className="rounded-lg border border-white/10 bg-slate-950/45 px-3 py-2">
                    <p className="text-sm font-semibold text-slate-100">{project.name}</p>
                    <p className="text-xs text-slate-300">{project.description}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {project.period} | {project.stack}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {previewFailed ? <p className="mt-2 text-xs text-rose-300">프리뷰 로드 실패: 입력값을 확인해 주세요.</p> : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => downloadPreviewImage('svg')}
              className="w-full rounded-xl border border-cyan-200/50 bg-transparent px-4 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-200/10"
            >
              {downloadingFormat === 'svg' ? 'Downloading SVG...' : 'Download SVG'}
            </button>
            <button
              onClick={() => downloadPreviewImage('png')}
              className="w-full rounded-xl border border-cyan-200/50 bg-transparent px-4 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-200/10"
            >
              {downloadingFormat === 'png' ? 'Downloading PNG...' : 'Download PNG'}
            </button>
          </div>
          <button
            onClick={copyGithubReadmeSnippet}
            className="mt-3 w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            {copiedReadme ? 'README Copied' : 'Copy GitHub README Snippet'}
          </button>
        </section>
      </div>
    </main>
  );
}
