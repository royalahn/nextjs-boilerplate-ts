# Next.js Boilerplate

Production-ready Next.js boilerplate for self-hosted VPS deployment.

## Stack

| 항목 | 내용 |
|------|------|
| Framework | Next.js 16 + App Router |
| Styling | TailwindCSS v4 + shadcn/ui |
| Auth | Auth.js v5 · Google OAuth · PrismaAdapter |
| DB | PostgreSQL 16 + Prisma v7 |
| Deploy | Docker Compose (dev: DB만, prod: 앱+DB) |
| 페이지 | 로그인, 대시보드 (사이드바 + 헤더 + 스탯 카드) |

## 시작 방법

### 1. 클론 및 환경 설정

```bash
git clone https://github.com/royalahn/nextjs-boilerplate-ts.git
cd nextjs-boilerplate-ts
cp .env.example .env
```

`.env` 파일에서 다음 값을 채웁니다:

```env
AUTH_SECRET=""        # openssl rand -base64 32
AUTH_GOOGLE_ID=""     # Google Cloud Console에서 발급
AUTH_GOOGLE_SECRET="" # Google Cloud Console에서 발급
AUTH_URL="http://localhost:3000"
```

> Google OAuth 설정 시 승인된 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`

### 2. DB 시작 및 스키마 적용

```bash
docker compose up -d
npx prisma db push
```

### 3. 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속 → `/login`으로 자동 리디렉트

---

## 프로덕션 배포 (VPS)

```bash
cp .env.example .env
# .env 값 설정 (AUTH_URL은 실제 도메인으로 변경)

docker compose -f docker-compose.prod.yml up -d
```

앱 시작 시 `prisma migrate deploy`가 자동으로 실행됩니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/login/          # 로그인 페이지
│   ├── (dashboard)/           # 인증 필요 영역
│   │   ├── layout.tsx         # 사이드바 레이아웃
│   │   └── dashboard/         # 대시보드 홈
│   └── api/auth/[...nextauth] # Auth.js 핸들러
├── components/
│   ├── ui/                    # shadcn 컴포넌트
│   └── layout/                # Sidebar, Header
└── lib/
    ├── auth.ts                # Auth.js 설정
    ├── db.ts                  # Prisma 싱글턴
    └── utils.ts               # cn() 유틸
prisma/schema.prisma           # DB 스키마
Dockerfile                     # 멀티스테이지 빌드
docker-compose.yml             # 개발 (DB만)
docker-compose.prod.yml        # 프로덕션 (앱 + DB)
```
