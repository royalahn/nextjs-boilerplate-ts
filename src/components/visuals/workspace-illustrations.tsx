import type { ReactNode } from "react"

type IllustrationVariant = "hero" | "empty" | "comment" | "draft"

interface WorkspaceIllustrationProps {
  variant: IllustrationVariant
  className?: string
}

function Frame({
  children,
  className,
  label,
}: {
  children: ReactNode
  className?: string
  label: string
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_12px_32px_-4px_rgba(5,0,56,0.08)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        viewBox="0 0 720 420"
        role="img"
        aria-label={label}
        className="h-full w-full"
      >
        {children}
      </svg>
    </div>
  )
}

function BoardBackdrop({
  variant,
}: {
  variant: IllustrationVariant
}) {
  return (
    <>
      <defs>
        <linearGradient id={`board-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <linearGradient id={`blob-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7d842" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ff9f6e" stopOpacity="0.86" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="720" height="420" fill={`url(#board-${variant})`} />
      <circle
        cx="620"
        cy="92"
        r="54"
        fill={`url(#blob-${variant})`}
        opacity="0.22"
      />
      <circle
        cx="110"
        cy="320"
        r="72"
        fill="#5dd8c7"
        opacity="0.14"
      />
    </>
  )
}

function HeroScene({ className }: { className?: string }) {
  return (
    <Frame label="workspace board preview" className={className}>
      <BoardBackdrop variant="hero" />
      <rect x="72" y="60" width="576" height="300" rx="28" fill="#ffffff" stroke="#0000001a" />
      <rect x="92" y="84" width="536" height="28" rx="14" fill="#fafafa" />
      <rect x="108" y="91" width="86" height="14" rx="7" fill="#111111" opacity="0.78" />
      <rect x="520" y="91" width="82" height="14" rx="7" fill="#111111" opacity="0.08" />
      <rect x="108" y="138" width="148" height="150" rx="20" fill="#fff6c7" />
      <rect x="272" y="138" width="148" height="150" rx="20" fill="#dff6f1" />
      <rect x="436" y="138" width="148" height="150" rx="20" fill="#ffe5de" />
      <text x="130" y="171" fill="#111111" fontSize="15" fontWeight="600">
        Sticky notes
      </text>
      <text x="294" y="171" fill="#111111" fontSize="15" fontWeight="600">
        Threads
      </text>
      <text x="458" y="171" fill="#111111" fontSize="15" fontWeight="600">
        Tasks
      </text>
      <rect x="132" y="196" width="48" height="48" rx="10" fill="#ffffff" />
      <rect x="192" y="196" width="48" height="48" rx="10" fill="#ffffff" />
      <rect x="132" y="256" width="48" height="48" rx="10" fill="#ffffff" />
      <rect x="292" y="196" width="48" height="48" rx="10" fill="#ffffff" />
      <rect x="352" y="196" width="48" height="48" rx="10" fill="#ffffff" />
      <rect x="292" y="256" width="48" height="48" rx="10" fill="#ffffff" />
      <rect x="456" y="196" width="48" height="48" rx="10" fill="#ffffff" />
      <rect x="516" y="196" width="48" height="48" rx="10" fill="#ffffff" />
      <rect x="456" y="256" width="48" height="48" rx="10" fill="#ffffff" />
      <path
        d="M240 320C300 300 340 300 404 320C456 336 516 338 564 318"
        fill="none"
        stroke="#111111"
        strokeOpacity="0.14"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="224" cy="320" r="10" fill="#111111" opacity="0.8" />
      <circle cx="404" cy="320" r="10" fill="#111111" opacity="0.8" />
      <circle cx="564" cy="318" r="10" fill="#111111" opacity="0.8" />
      <rect x="92" y="358" width="536" height="14" rx="7" fill="#111111" opacity="0.05" />
    </Frame>
  )
}

function EmptyScene({ className }: { className?: string }) {
  return (
    <Frame label="empty board state" className={className}>
      <BoardBackdrop variant="empty" />
      <rect x="72" y="60" width="576" height="300" rx="28" fill="#ffffff" stroke="#0000001a" strokeDasharray="10 10" />
      <rect x="92" y="84" width="536" height="28" rx="14" fill="#fafafa" />
      <text x="112" y="103" fill="#111111" fontSize="13" fontWeight="600">
        Nothing here yet
      </text>
      <rect x="128" y="156" width="464" height="132" rx="24" fill="#fff6c7" />
      <circle cx="200" cy="222" r="42" fill="#ffffff" opacity="0.9" />
      <path
        d="M194 222h12m-6-6v12"
        stroke="#111111"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text x="264" y="214" fill="#111111" fontSize="18" fontWeight="600">
        Start with a board, then add a category and post.
      </text>
      <text x="264" y="242" fill="#111111" opacity="0.7" fontSize="14">
        The workspace stays calm until you begin writing.
      </text>
      <rect x="128" y="312" width="112" height="10" rx="5" fill="#111111" opacity="0.08" />
      <rect x="252" y="312" width="176" height="10" rx="5" fill="#111111" opacity="0.06" />
      <rect x="440" y="312" width="120" height="10" rx="5" fill="#111111" opacity="0.06" />
    </Frame>
  )
}

function DraftScene({ className }: { className?: string }) {
  return (
    <Frame label="post draft workspace" className={className}>
      <BoardBackdrop variant="draft" />
      <rect x="72" y="60" width="576" height="300" rx="28" fill="#ffffff" stroke="#0000001a" />
      <rect x="92" y="84" width="536" height="28" rx="14" fill="#fafafa" />
      <rect x="108" y="91" width="96" height="14" rx="7" fill="#111111" opacity="0.76" />
      <rect x="108" y="138" width="232" height="176" rx="24" fill="#fff6c7" />
      <rect x="368" y="138" width="220" height="52" rx="18" fill="#dff6f1" />
      <rect x="368" y="206" width="220" height="52" rx="18" fill="#ffe5de" />
      <rect x="368" y="274" width="142" height="40" rx="14" fill="#f4ecff" />
      <path d="M132 170h180" stroke="#111111" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
      <path d="M132 206h132" stroke="#111111" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
      <path d="M132 242h160" stroke="#111111" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
      <path d="M132 278h112" stroke="#111111" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
      <circle cx="482" cy="164" r="10" fill="#111111" opacity="0.18" />
      <circle cx="482" cy="232" r="10" fill="#111111" opacity="0.18" />
      <circle cx="482" cy="294" r="10" fill="#111111" opacity="0.18" />
      <text x="392" y="169" fill="#111111" fontSize="14" fontWeight="600">
        Draft title
      </text>
      <text x="392" y="237" fill="#111111" fontSize="14" fontWeight="600">
        Supporting notes
      </text>
      <text x="392" y="299" fill="#111111" fontSize="14" fontWeight="600">
        Publish ready
      </text>
      <rect x="92" y="332" width="536" height="10" rx="5" fill="#111111" opacity="0.05" />
    </Frame>
  )
}

function CommentScene({ className }: { className?: string }) {
  return (
    <Frame label="comment thread workspace" className={className}>
      <BoardBackdrop variant="comment" />
      <rect x="72" y="60" width="576" height="300" rx="28" fill="#ffffff" stroke="#0000001a" />
      <rect x="92" y="84" width="536" height="28" rx="14" fill="#fafafa" />
      <rect x="108" y="91" width="104" height="14" rx="7" fill="#111111" opacity="0.76" />
      <rect x="112" y="146" width="250" height="52" rx="18" fill="#dff6f1" />
      <rect x="358" y="206" width="230" height="52" rx="18" fill="#fff6c7" />
      <rect x="138" y="266" width="268" height="52" rx="18" fill="#ffe5de" />
      <path d="M144 172h186" stroke="#111111" strokeOpacity="0.14" strokeWidth="8" strokeLinecap="round" />
      <path d="M390 232h162" stroke="#111111" strokeOpacity="0.14" strokeWidth="8" strokeLinecap="round" />
      <path d="M170 292h154" stroke="#111111" strokeOpacity="0.14" strokeWidth="8" strokeLinecap="round" />
      <circle cx="130" cy="172" r="14" fill="#111111" opacity="0.12" />
      <circle cx="370" cy="232" r="14" fill="#111111" opacity="0.12" />
      <circle cx="158" cy="292" r="14" fill="#111111" opacity="0.12" />
      <path d="M532 146l16-12m-16 12l4 20" stroke="#111111" strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" />
      <text x="124" y="177" fill="#111111" fontSize="14" fontWeight="600">
        Reply thread
      </text>
      <text x="370" y="237" fill="#111111" fontSize="14" fontWeight="600">
        Like + reply
      </text>
      <text x="168" y="297" fill="#111111" fontSize="14" fontWeight="600">
        Keep the discussion nested
      </text>
      <rect x="92" y="332" width="536" height="10" rx="5" fill="#111111" opacity="0.05" />
    </Frame>
  )
}

export function WorkspaceIllustration({
  variant,
  className,
}: WorkspaceIllustrationProps) {
  const Scene =
    variant === "hero"
      ? HeroScene
      : variant === "empty"
        ? EmptyScene
        : variant === "comment"
          ? CommentScene
          : DraftScene

  return <Scene className={className} />
}

export function EmptyBoardIllustration() {
  return (
    <WorkspaceIllustration
      variant="empty"
      className="mx-auto max-w-2xl border-black/10 bg-white/95"
    />
  )
}

export function DraftIllustration() {
  return (
    <WorkspaceIllustration
      variant="draft"
      className="mx-auto max-w-2xl border-black/10 bg-white/95"
    />
  )
}

export function CommentIllustration() {
  return (
    <WorkspaceIllustration
      variant="comment"
      className="mx-auto max-w-2xl border-black/10 bg-white/95"
    />
  )
}
