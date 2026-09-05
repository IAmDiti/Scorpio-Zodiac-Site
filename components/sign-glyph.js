// Stroke-drawn astrological glyphs for all 12 signs. One consistent style,
// 24px grid. Approximate but distinct and recolourable.

const PATHS = {
  aries: 'M4 14C4 7 8 5 12 10C16 5 20 7 20 14',
  taurus: 'M12 21a6 6 0 1 0 0-12a6 6 0 0 0 0 12M6 9A6 6 0 0 1 18 9',
  gemini: 'M6 4h12M6 20h12M9 4v16M15 4v16',
  cancer:
    'M3 10a2.6 2.6 0 1 0 2.6 2.6M21 14a2.6 2.6 0 1 0-2.6-2.6M5 8c4-3 10-3 14 0M19 16c-4 3-10 3-14 0',
  leo: 'M6 16a3.5 3.5 0 1 1 4.6-2.7c1.6-3.6 7.4-2.8 7.4 1.7c0 3.6-3.6 4.6-5.6 2.8',
  virgo: 'M4 6v11M4 8a2 2 0 0 1 4 0v9M8 8a2 2 0 0 1 4 0v9c0 3 4 3 4-.5c0-3-3-3-4-1',
  libra: 'M4 19h16M4 13h4.2a4 4 0 1 1 7.6 0H20',
  scorpio:
    'M2 7a3 3 0 0 1 5.6 0V16M7.6 7a3 3 0 0 1 5.6 0V16M13.2 7a3 3 0 0 1 5.6 0V18l3.2-3M22 20l-3.2-2 -1 3.6',
  sagittarius: 'M5 19L18 6M12 6h6v6M8 11l5 5',
  capricorn: 'M4 6c1 6 4 8 5 4c1-4 4-4 4 2c0 4 4 4 4 1a2.2 2.2 0 1 0-1-2',
  aquarius: 'M4 9l3-2l3 2l3-2l3 2l3-2M4 15l3-2l3 2l3-2l3 2l3-2',
  pisces: 'M6 5C2 9 2 15 6 19M18 5c4 4 4 10 0 14M4 12h16',
}

export function SignGlyph({ sign, className = '', title }) {
  const d = PATHS[sign]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  )
}
