'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

type ThemeKey = 'ocean' | 'sunset' | 'forest' | 'amber';
type CardMode = 'dark' | 'light';
type UiMode = 'dark' | 'light';

const themeOptions: Array<{ key: ThemeKey; label: string }> = [
  { key: 'ocean', label: 'Ocean' },
  { key: 'sunset', label: 'Sunset' },
  { key: 'forest', label: 'Forest' },
  { key: 'amber', label: 'Amber' },
];
const PROJECT_THEME_TONE: Record<
  ThemeKey,
  {
    darkTitle: string;
    lightTitle: string;
    darkPanel: string;
    lightPanel: string;
    darkRow: string;
    lightRow: string;
    darkRowBorder: string;
    lightRowBorder: string;
  }
> = {
  ocean: {
    darkTitle: 'text-cyan-200/80',
    lightTitle: 'text-cyan-700',
    darkPanel: 'bg-slate-900/65',
    lightPanel: 'bg-slate-200',
    darkRow: 'bg-cyan-900/45',
    lightRow: 'bg-cyan-50',
    darkRowBorder: 'border-cyan-400/30',
    lightRowBorder: 'border-cyan-200',
  },
  sunset: {
    darkTitle: 'text-rose-300/80',
    lightTitle: 'text-rose-700',
    darkPanel: 'bg-rose-950/45',
    lightPanel: 'bg-rose-100',
    darkRow: 'bg-rose-900/45',
    lightRow: 'bg-rose-50',
    darkRowBorder: 'border-rose-400/30',
    lightRowBorder: 'border-rose-200',
  },
  forest: {
    darkTitle: 'text-emerald-300/80',
    lightTitle: 'text-emerald-700',
    darkPanel: 'bg-emerald-950/45',
    lightPanel: 'bg-emerald-100',
    darkRow: 'bg-emerald-900/45',
    lightRow: 'bg-emerald-50',
    darkRowBorder: 'border-emerald-400/30',
    lightRowBorder: 'border-emerald-200',
  },
  amber: {
    darkTitle: 'text-amber-300/80',
    lightTitle: 'text-amber-700',
    darkPanel: 'bg-amber-950/35',
    lightPanel: 'bg-amber-100',
    darkRow: 'bg-amber-900/40',
    lightRow: 'bg-amber-50',
    darkRowBorder: 'border-amber-400/30',
    lightRowBorder: 'border-amber-200',
  },
};
const FIXED_BASE_URL = 'https://lume-self.vercel.app';

type ProjectRow = {
  name: string;
  description: string;
  period: string;
  stack: string;
};

type SavedBuilderState = {
  uiMode: UiMode;
  name: string;
  role: string;
  tagline: string;
  skills: string;
  theme: ThemeKey;
  githubUsername: string;
  externalBadgeUrl: string;
  baekjoonId: string;
  certBadgesInput: string;
  projectRowsInput: string;
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

function normalizeBaekjoonId(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  let candidate = trimmed;
  try {
    const decoded = decodeURIComponent(trimmed);
    const url = new URL(decoded);
    const boj = url.searchParams.get('boj');
    if (boj) candidate = boj;
    else {
      const parts = url.pathname.split('/').filter(Boolean);
      candidate = parts[parts.length - 1] || '';
    }
  } catch {
    const match = trimmed.match(/[?&]boj=([^&]+)/);
    if (match?.[1]) {
      candidate = decodeURIComponent(match[1]);
    }
  }

  return candidate.replace(/[^a-zA-Z0-9_]/g, '');
}

export default function Home() {
  const { data: session, status } = useSession();
  const [uiMode, setUiMode] = useState<UiMode>('light');
  const cardMode: CardMode = uiMode;
  const [name, setName] = useState('Minty Kim');
  const [role, setRole] = useState('Frontend Engineer');
  const [tagline, setTagline] = useState('Designing clean UX and robust web apps.');
  const [skills, setSkills] = useState('TypeScript,React,Next.js,Tailwind');
  const [theme, setTheme] = useState<ThemeKey>('ocean');

  const [githubUsername, setGithubUsername] = useState('mintydev');
  const [rankTier] = useState('GOLD');
  const [rankScore] = useState('1580');
  const [badgeRank] = useState('412');
  const [badgeTop] = useState('12');
  const [badgeDiff] = useState('+42');
  const [externalBadgeUrl, setExternalBadgeUrl] = useState(
    'https://www.git-ranker.com/api/v1/badges/MDQ6VXNlcjQ4ODMwNTA5',
  );
  const [baekjoonId, setBaekjoonId] = useState('wjdalsdk70');

  const [certBadgesInput, setCertBadgesInput] = useState('AWS SAA,SQLD,정보처리기사');
  const [projectRowsInput, setProjectRowsInput] = useState(
    'README Styler|GitHub README 카드 생성 서비스|2026.02 - 진행중|Next.js,TypeScript,Tailwind\nPortfolio 2.0|개인 포트폴리오 리뉴얼|2025.11 - 2026.01|React,Vite,Firebase',
  );

  const [copiedReadme, setCopiedReadme] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [hasLoadedProfileState, setHasLoadedProfileState] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  useEffect(() => {
    if (!session?.user?.username) return;
    if (!githubUsername.trim() || githubUsername === 'mintydev') {
      setGithubUsername(session.user.username);
    }
  }, [githubUsername, session?.user?.username]);

  useEffect(() => {
    if (!session?.user?.nodeId) {
      setHasLoadedProfileState(true);
      return;
    }

    let isMounted = true;

    async function loadSettings() {
      try {
        const response = await fetch('/api/user-settings', { cache: 'no-store' });
        if (!response.ok) {
          setHasLoadedProfileState(true);
          return;
        }

        const data = (await response.json()) as { settings?: Partial<SavedBuilderState> };
        const saved = data.settings;
        if (!saved || !isMounted) {
          setHasLoadedProfileState(true);
          return;
        }

        if (saved.uiMode === 'light' || saved.uiMode === 'dark') setUiMode(saved.uiMode);
        if (typeof saved.name === 'string') setName(saved.name);
        if (typeof saved.role === 'string') setRole(saved.role);
        if (typeof saved.tagline === 'string') setTagline(saved.tagline);
        if (typeof saved.skills === 'string') setSkills(saved.skills);
        if (saved.theme && themeOptions.some((option) => option.key === saved.theme)) setTheme(saved.theme);
        if (typeof saved.githubUsername === 'string') setGithubUsername(saved.githubUsername);
        if (typeof saved.externalBadgeUrl === 'string') setExternalBadgeUrl(saved.externalBadgeUrl);
        if (typeof saved.baekjoonId === 'string') setBaekjoonId(normalizeBaekjoonId(saved.baekjoonId));
        if (typeof saved.certBadgesInput === 'string') setCertBadgesInput(saved.certBadgesInput);
        if (typeof saved.projectRowsInput === 'string') setProjectRowsInput(saved.projectRowsInput);
      } finally {
        if (isMounted) setHasLoadedProfileState(true);
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.nodeId]);

  const cardPath = useMemo(() => {
    const params = new URLSearchParams({
      name,
      role,
      tagline,
      skills,
      certs: certBadgesInput,
      projects: projectRowsInput,
      mode: cardMode,
      theme,
    });

    return `/api/card?${params.toString()}`;
  }, [cardMode, certBadgesInput, name, projectRowsInput, role, skills, tagline, theme]);

  const badgePath = useMemo(() => {
    const params = new URLSearchParams({
      username: githubUsername,
      tier: rankTier,
      mode: cardMode,
      score: rankScore,
      rank: badgeRank,
      top: badgeTop,
      diff: badgeDiff,
    });

    return `/api/badge?${params.toString()}`;
  }, [badgeDiff, badgeRank, badgeTop, cardMode, githubUsername, rankScore, rankTier]);

  const baekjoonCardUrl = useMemo(() => {
    const trimmed = normalizeBaekjoonId(baekjoonId);
    if (!trimmed) return '';
    const params = new URLSearchParams({ boj: trimmed });
    return `https://mazassumnida.wtf/api/v2/generate_badge?${params.toString()}`;
  }, [baekjoonId]);

  const projectRows = useMemo(() => parseProjectRows(projectRowsInput), [projectRowsInput]);

  const githubReadmeSnippet = useMemo(() => {
    const resolvedBadgeRouteId = session?.user?.nodeId || 'MDQ6VXNlcjQ4ODMwNTA5';
    const profileCardUrl = `${FIXED_BASE_URL}${cardPath}`;
    const rankBadgeUrl = externalBadgeUrl.trim() || `https://www.git-ranker.com/api/v1/badges/${encodeURIComponent(resolvedBadgeRouteId)}`;
    const projectsCardUrl = `${FIXED_BASE_URL}/api/projects-card?${new URLSearchParams({ projects: projectRowsInput, mode: cardMode, theme }).toString()}`;

    return [
      '<p align="center">',
      `  <img src="${profileCardUrl}" alt="${name} README Card" />`,
      '</p>',
      '',
      '<p align="center">',
      `  <a href="https://www.git-ranker.com"><img src="${rankBadgeUrl}" alt="Git Rank Badge" /></a>`,
      ...(baekjoonCardUrl ? [`  <img src="${baekjoonCardUrl}" alt="${baekjoonId} solved.ac profile" />`] : []),
      '</p>',
      '',
      '<p align="center">',
      `  <img src="${projectsCardUrl}" alt="${name} Projects Card" />`,
      '</p>',
    ].join('\n');
  }, [baekjoonCardUrl, baekjoonId, cardMode, cardPath, externalBadgeUrl, name, projectRowsInput, session?.user?.nodeId, theme]);

  async function copyGithubReadmeSnippet() {
    await navigator.clipboard.writeText(githubReadmeSnippet);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 1200);
  }

  async function saveUserSettings() {
    if (!session?.user?.nodeId) {
      setSaveNotice('로그인 후 저장할 수 있습니다.');
      return;
    }
    if (!hasLoadedProfileState) {
      setSaveNotice('설정 로딩 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setIsSavingSettings(true);
    setSaveNotice('');
    const payload: SavedBuilderState = {
      uiMode,
      name,
      role,
      tagline,
      skills,
      theme,
      githubUsername,
      externalBadgeUrl,
      baekjoonId: normalizeBaekjoonId(baekjoonId),
      certBadgesInput,
      projectRowsInput,
    };

    try {
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('save failed');
      }
      setSaveNotice('저장되었습니다.');
    } catch {
      setSaveNotice('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSavingSettings(false);
    }
  }

  const isCardLight = cardMode === 'light';
  const isUiLight = uiMode === 'light';
  const projectTone = PROJECT_THEME_TONE[theme];
  const isAuthenticated = status === 'authenticated';
  const displayName = session?.user?.name || session?.user?.username || 'GitHub User';
  const avatarUrl = session?.user?.image || '';
  const avatarInitial = (displayName || 'U').trim().charAt(0).toUpperCase();
  const isUiLightCardDark = isUiLight && !isCardLight;

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileMenuOpen(false);
    }
  }, [isAuthenticated]);

  const inputClass = isUiLight
    ? 'rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-cyan-500/40 transition focus:ring'
    : 'rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none ring-cyan-300/50 transition focus:ring';
  const shellClass = isUiLight
    ? 'min-h-screen w-full bg-[radial-gradient(circle_at_20%_15%,#bae6fd_0%,#e2e8f0_48%,#f8fafc_100%)] px-4 py-4 text-slate-900 md:px-6 md:py-6'
    : 'min-h-screen w-full bg-[radial-gradient(circle_at_20%_15%,#164e63_0%,#020617_45%,#020617_100%)] px-4 py-4 text-slate-100 md:px-6 md:py-6';
  const headerClass = isUiLight
    ? 'relative z-50 mx-auto mb-4 flex w-full max-w-[1500px] items-center justify-between rounded-2xl border border-slate-300 bg-white/85 px-4 py-3 backdrop-blur-lg md:mb-6 md:px-5'
    : 'relative z-50 mx-auto mb-4 flex w-full max-w-[1500px] items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-lg md:mb-6 md:px-5';
  const panelClass = isUiLight
    ? 'min-w-0 h-full rounded-3xl border border-slate-300 bg-white/90 p-6 backdrop-blur-lg md:p-7'
    : 'min-w-0 h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg md:p-7';
  const previewPanelClass = isUiLight
    ? 'min-w-0 h-full rounded-3xl border border-slate-300 bg-white/90 p-5 backdrop-blur-lg md:p-6 lg:flex lg:flex-col'
    : 'min-w-0 h-full rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg md:p-6 lg:flex lg:flex-col';
  const previewBoxClass = isUiLight
    ? 'space-y-3 overflow-auto rounded-2xl border border-slate-300 bg-white p-3 lg:min-h-0 lg:flex-1'
    : 'space-y-3 overflow-auto rounded-2xl border border-white/10 bg-slate-950/40 p-3 lg:min-h-0 lg:flex-1';
  const mutedTextClass = isUiLight ? 'text-slate-600' : 'text-slate-300';
  const primaryActionBtnClass = isUiLight
    ? 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100'
    : 'w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200';
  const githubButtonClass = 'inline-flex w-full items-center justify-center rounded-xl border border-[#30363d] bg-[#24292f] px-4 py-3 font-semibold text-white transition hover:bg-[#32383f]';
  const githubProfileUrl = `https://github.com/${encodeURIComponent(githubUsername.trim())}`;
  const projectPanelClass = isCardLight
    ? projectTone.lightPanel
    : isUiLightCardDark
      ? 'bg-slate-900'
      : projectTone.darkPanel;
  const projectTitleClass = isCardLight
    ? projectTone.lightTitle
    : isUiLightCardDark
      ? 'text-slate-200'
      : projectTone.darkTitle;
  const projectRowClass = isCardLight
    ? `border ${projectTone.lightRowBorder} ${projectTone.lightRow}`
    : isUiLightCardDark
      ? 'border border-slate-700 bg-slate-950'
      : `border ${projectTone.darkRowBorder} ${projectTone.darkRow}`;
  const projectNameClass = isCardLight ? 'text-slate-900' : 'text-slate-100';
  const projectDescClass = isCardLight ? 'text-slate-700' : 'text-slate-300';
  const projectMetaClass = isCardLight ? 'text-slate-600' : 'text-slate-400';
  const previewImageClass = 'block h-auto w-full rounded-xl';

  return (
    <main className={shellClass}>
      <header className={headerClass}>
        <div className="flex items-center gap-3">
          <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" aria-label="RuMe logo">
            <defs>
              <linearGradient id="rumeLogoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="55%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <radialGradient id="rumeGlow" cx="50%" cy="20%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="1" y="1" width="36" height="36" rx="12" fill="url(#rumeLogoGrad)" />
            <rect x="1" y="1" width="36" height="36" rx="12" fill="url(#rumeGlow)" />
            <path d="M10 27V11h5.7c3.6 0 5.6 1.8 5.6 4.8 0 2-1 3.4-2.8 4.2l3.4 7h-3.8l-2.9-6.1H13V27h-3Zm3-8.8h2.3c1.8 0 2.8-.8 2.8-2.2 0-1.5-1-2.3-2.8-2.3H13v4.5Z" fill="#F8FAFC" />
            <circle cx="28.5" cy="9.5" r="2.2" fill="#E0F2FE" opacity="0.95" />
          </svg>
          <p className={`text-xl font-semibold tracking-[0.02em] md:text-2xl ${isUiLight ? 'text-slate-900' : 'text-slate-100'}`}>RuMe</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUiMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
              isUiLight
                ? 'text-slate-900 hover:text-slate-700'
                : 'text-slate-100 hover:text-white'
            }`}
            aria-label={isUiLight ? 'Current mode: light. Click to switch to dark mode' : 'Current mode: dark. Click to switch to light mode'}
            title={isUiLight ? 'Light mode (click to switch)' : 'Dark mode (click to switch)'}
          >
            {isUiLight ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="4.6" fill="currentColor" />
                <path
                  d="M12 1.8v2.9M12 19.3v2.9M22.2 12h-2.9M4.7 12H1.8M19.2 4.8l-2.1 2.1M7 17l-2.2 2.2M19.2 19.2 17 17M7 7 4.8 4.8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M20.2 14.6A8.8 8.8 0 1 1 9.4 3.8a7.3 7.3 0 1 0 10.8 10.8Z"
                  fill="currentColor"
                  className="drop-shadow-[0_0_2px_rgba(15,23,42,0.35)]"
                />
              </svg>
            )}
          </button>
          <div className="relative">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className={`h-11 w-11 overflow-hidden rounded-full shadow-lg ${isUiLight ? 'border border-slate-300 bg-white' : 'border border-white/30 bg-slate-900/70'}`}
                aria-label="Open profile menu"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={`${displayName} avatar`} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-bold text-cyan-100">{avatarInitial}</span>
                )}
              </button>
              {profileMenuOpen ? (
                <div className={`fixed right-4 top-16 z-[9999] w-52 rounded-xl p-2 shadow-xl backdrop-blur-md md:right-6 md:top-20 ${
                  isUiLight ? 'border border-slate-300 bg-white/95' : 'border border-white/20 bg-slate-950/90'
                }`}>
                  <p className={`px-2 py-1 text-xs ${isUiLight ? 'text-slate-600' : 'text-slate-300'}`}>{displayName}</p>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className={`mt-1 w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      isUiLight ? 'text-rose-600 hover:bg-rose-100' : 'text-rose-200 hover:bg-rose-400/10'
                    }`}
                  >
                    로그아웃
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn('github')}
              className="inline-flex items-center gap-2 rounded-md border border-[#30363d] bg-[#24292f] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#32383f] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0969da] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.6.1-.6.1-.6 1.1.1 1.8 1.2 1.8 1.2 1 .1 2.6 1 3.3.7.1-.7.4-1.1.7-1.3-2.7-.3-5.6-1.3-5.6-6A4.6 4.6 0 0 1 6.1 8c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1a4.6 4.6 0 0 1 1.2 3.2c0 4.7-2.9 5.6-5.7 5.9.4.4.8 1.1.8 2.3v3.3c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z" />
              </svg>
              로그인
            </button>
          )}
        </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1500px] gap-4 md:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className={panelClass}>
          <h1 className={`mb-2 text-3xl font-bold tracking-tight md:text-4xl ${isUiLight ? 'text-slate-900' : 'text-slate-100'}`}>GitHub README 카드 빌더</h1>
          <p className={`mb-6 ${mutedTextClass}`}>프로필 카드 + 배지 + 프로젝트 표를 한 번에 생성합니다.</p>

          <div className="grid gap-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={inputClass} />
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className={inputClass} />
            <textarea
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Tagline (줄바꿈 가능)"
              rows={3}
              className={inputClass}
            />
            <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" className={inputClass} />

            <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeKey)} className={inputClass}>
              {themeOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="mt-2 h-px bg-white/10" />

            <input
              value={externalBadgeUrl}
              onChange={(e) => setExternalBadgeUrl(e.target.value)}
              placeholder="Git Ranker Badge URL (optional)"
              className={inputClass}
            />
            <input
              value={baekjoonId}
              onChange={(e) => setBaekjoonId(normalizeBaekjoonId(e.target.value))}
              placeholder="Baekjoon ID"
              className={inputClass}
            />

            <textarea value={certBadgesInput} onChange={(e) => setCertBadgesInput(e.target.value)} placeholder="자격증 배지 (comma separated)" rows={2} className={inputClass} />
            <textarea
              value={projectRowsInput}
              onChange={(e) => setProjectRowsInput(e.target.value)}
              placeholder="프로젝트명|소개|기간|스택 (한 줄에 하나)"
              rows={4}
              className={`${inputClass} font-mono text-sm`}
            />
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <p className={`text-xs ${isUiLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {saveNotice || (session?.user?.nodeId ? '입력값을 수정한 뒤 저장 버튼을 눌러 반영하세요.' : '로그인 후 사용자별 설정 저장이 가능합니다.')}
              </p>
              <button
                type="button"
                onClick={saveUserSettings}
                disabled={!session?.user?.nodeId || isSavingSettings || !hasLoadedProfileState}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isUiLight
                    ? 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50'
                    : 'border border-white/25 bg-slate-900/45 text-slate-100 hover:bg-slate-800/70 disabled:opacity-50'
                }`}
              >
                {isSavingSettings ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </section>

        <section className={previewPanelClass}>
          <div className={previewBoxClass}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cardPath} alt="README Card Preview" className={previewImageClass} onLoad={() => setPreviewFailed(false)} onError={() => setPreviewFailed(true)} />
            <div className="grid gap-3 md:grid-cols-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={externalBadgeUrl.trim() || badgePath}
                alt="Rank Badge Preview"
                className={previewImageClass}
                onError={() => setPreviewFailed(true)}
              />
              {baekjoonCardUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={baekjoonCardUrl} alt="Baekjoon Card Preview" className="block h-auto w-full rounded-xl" onError={() => setPreviewFailed(true)} />
              ) : null}
            </div>
            <div
              className={`rounded-xl p-4 ${projectPanelClass}`}
              style={isUiLightCardDark ? { backgroundColor: '#0f172a' } : undefined}
            >
              <p className={`mb-3 text-xs uppercase tracking-[0.14em] ${projectTitleClass}`}>Projects</p>
              <div className="space-y-2">
                {projectRows.map((project, index) => (
                  <div
                    key={`${project.name}-${index}`}
                    className={`rounded-lg px-3 py-2 ${projectRowClass}`}
                    style={isUiLightCardDark ? { backgroundColor: '#020617', borderColor: '#334155' } : undefined}
                  >
                    <p className={`text-sm font-semibold ${projectNameClass}`}>{project.name}</p>
                    <p className={`text-xs ${projectDescClass}`}>{project.description}</p>
                    <p className={`mt-1 text-[11px] ${projectMetaClass}`}>
                      {project.period} | {project.stack}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {previewFailed ? <p className="mt-2 text-xs text-rose-300">프리뷰 로드 실패: 입력값을 확인해 주세요.</p> : null}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              onClick={copyGithubReadmeSnippet}
              className={`inline-flex items-center justify-center gap-2 ${primaryActionBtnClass}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M8 8.5V6.75A2.75 2.75 0 0 1 10.75 4h6.5A2.75 2.75 0 0 1 20 6.75v6.5A2.75 2.75 0 0 1 17.25 16H15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="4" y="8" width="12" height="12" rx="2.75" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {copiedReadme ? '복사됨' : '프로필 복사'}
            </button>
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noreferrer"
              className={`${githubButtonClass} gap-2`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.6.1-.6.1-.6 1.1.1 1.8 1.2 1.8 1.2 1 .1 2.6 1 3.3.7.1-.7.4-1.1.7-1.3-2.7-.3-5.6-1.3-5.6-6A4.6 4.6 0 0 1 6.1 8c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1a4.6 4.6 0 0 1 1.2 3.2c0 4.7-2.9 5.6-5.7 5.9.4.4.8 1.1.8 2.3v3.3c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z" />
              </svg>
              GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
