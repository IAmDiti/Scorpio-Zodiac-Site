import Link from 'next/link'

export function AuthTabs({ active, next }) {
  const q = next ? `?next=${encodeURIComponent(next)}` : ''
  const tab = (href, label, isActive) => (
    <Link
      href={href + q}
      className={`flex-1 rounded-lg py-2.5 text-center font-ui text-[13px] transition-colors ${
        isActive ? 'bg-lilac font-bold text-void' : 'text-ink-3 hover:text-ink'
      }`}
    >
      {label}
    </Link>
  )
  return (
    <div className="mb-5 flex gap-1.5 rounded-xl border border-line bg-void/60 p-1.5">
      {tab('/signup', 'Create account', active === 'signup')}
      {tab('/login', 'Log in', active === 'login')}
    </div>
  )
}
