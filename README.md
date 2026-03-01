<p align="center">
  <img src="./public/rume-log.png" alt="RuMe Logo" width="160" />
</p>

<h1 align="center">RuMe - README Card Builder</h1>

<p align="center">
  GitHub 프로필용 카드, 배지, 프로젝트 섹션을 빠르게 만들고 복사할 수 있는 빌더입니다.
</p>

<p align="center">
  <a href="https://lume-self.vercel.app/"><strong>Service 바로가기</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/NextAuth-111827?style=flat&logo=auth0&logoColor=white" alt="NextAuth" />
</p>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#key-features">Key Features</a>
</p>

---

<a id="introduction"></a>
## Introduction

RuMe는 다음 흐름을 한 화면에서 처리합니다.

- 프로필 카드 생성 (`/api/card`)
- 프로젝트 카드 생성 (`/api/projects-card`)
- 배지 프리뷰 및 외부 배지 연결
- 최종 README Markdown 스니펫 복사

GitHub 로그인(NextAuth)을 통해 사용자별 입력값을 DB에 저장해 재사용할 수 있습니다.

---

<a id="key-features"></a>
## Key Features

<p align="center">
  <img src="./public/readme-preview.png" alt="RuMe Preview" width="960" />
</p>

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>⚡ 실시간 카드 프리뷰</h3>
      <p>이름, 역할, 소개, 테마를 입력하면 SVG 카드가 즉시 갱신됩니다.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🎯 아이콘 기반 기술 스택</h3>
      <p>체크박스로 선택한 스택을 아이콘으로 렌더링합니다. (<code>simple-icons</code>)</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🧩 프로젝트 카드 자동 생성</h3>
      <p><code>프로젝트명|설명|기간|스택|repo|site</code> 형식 입력으로 프로젝트 카드를 생성합니다.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🔗 외부 배지 통합</h3>
      <p>Git Ranker 배지 URL과 solved.ac(백준 ID)를 함께 붙여 통합 프리뷰할 수 있습니다.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💾 사용자 설정 저장</h3>
      <p>로그인 사용자 기준으로 빌더 입력값을 저장하고 다음 방문 시 복원합니다.</p>
    </td>
    <td width="50%" valign="top">
      <h3>📋 README 스니펫 복사</h3>
      <p>생성된 카드/배지 조합을 Markdown 스니펫으로 즉시 복사해 프로필에 적용할 수 있습니다.</p>
    </td>
  </tr>
</table>
