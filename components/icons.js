// Stroke-based inline icons on a 24px grid, one consistent style.
// Pass className / props through to the <svg>.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconArrowRight(props) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconChevronLeft(props) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

export function IconChevronRight(props) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function IconMoon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

export function IconHeart(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function IconShare(props) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  )
}

export function IconLock(props) {
  return (
    <svg {...base} strokeWidth={1.7} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function IconSparkle(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    </svg>
  )
}

export function IconQuiz(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3 2.5c-.9.4-1.5 1.2-1.5 2.2M11 17h.01" />
    </svg>
  )
}

export function IconScorpio(props) {
  return (
    <svg
      viewBox="0 0 28 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 8 A3 3 0 0 1 8 8 V17" />
      <path d="M8 8 A3 3 0 0 1 14 8 V17" />
      <path d="M14 8 A3 3 0 0 1 20 8 V19 L25 14.5" />
      <path d="M25 20 L25 14.5 L19.5 14.5" />
    </svg>
  )
}

export function IconGoogle(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M22 12c0-.8-.1-1.5-.2-2.2H12v4.3h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.8z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-1 6.6-2.5l-3.3-2.6c-.9.6-2 1-3.3 1-2.6 0-4.7-1.7-5.5-4.1H3.1v2.6C4.8 19.8 8.1 22 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.5 13.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.6H3.1C2.4 9 2 10.5 2 12s.4 3 1.1 4.4l3.4-2.6z"
      />
      <path
        fill="#EA4335"
        d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 2.9 14.7 2 12 2 8.1 2 4.8 4.2 3.1 7.6l3.4 2.6c.8-2.4 2.9-4.1 5.5-4.1z"
      />
    </svg>
  )
}
