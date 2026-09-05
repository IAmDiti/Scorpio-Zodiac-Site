/**
 * Stylised Scorpius constellation. Antares is the garnet star.
 * Decorative — hidden from assistive tech.
 */
export function Constellation({ className = '' }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 120"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M10 34 L42 28 L62 44 L92 56 L128 64 L160 70 L192 74 L222 68 L246 54 L266 60 L280 82 L266 100 L244 106"
        fill="none"
        stroke="rgba(201,162,255,0.4)"
        strokeWidth="1.4"
      />
      <g fill="#f4eef7">
        <circle cx="10" cy="34" r="1.7" />
        <circle cx="42" cy="28" r="2" />
        <circle cx="62" cy="44" r="1.5" />
        <circle cx="92" cy="56" r="1.6" />
        <circle cx="160" cy="70" r="1.8" />
        <circle cx="192" cy="74" r="1.5" />
        <circle cx="222" cy="68" r="1.6" />
        <circle cx="266" cy="60" r="1.5" />
        <circle cx="280" cy="82" r="1.7" />
        <circle cx="244" cy="106" r="1.6" />
      </g>
      <g fill="#d9b46a">
        <circle cx="246" cy="54" r="1.8" />
        <circle cx="266" cy="100" r="1.6" />
      </g>
      <circle cx="128" cy="64" r="4.4" fill="#c02a4a" />
      <circle cx="128" cy="64" r="8" fill="none" stroke="rgba(192,42,74,0.35)" strokeWidth="1.5" />
    </svg>
  )
}
