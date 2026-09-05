// Shared cosmic-noir card for generated Open Graph images (next/og).

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'
export const OG_ALT = 'Scorpio Daily'

export function OgCard({ eyebrow, title, subtitle }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '90px',
        background:
          'radial-gradient(900px 520px at 20% -5%, #2a1740, #0b0812 60%), radial-gradient(760px 520px at 100% 105%, #3a1020, #0b0812 58%)',
        color: '#f4eef7',
        fontFamily: 'serif',
      }}
    >
      {eyebrow ? (
        <div
          style={{ fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', color: '#cbb2ea' }}
        >
          {eyebrow}
        </div>
      ) : null}
      <div
        style={{ fontSize: 86, fontWeight: 700, lineHeight: 1.05, marginTop: 22, maxWidth: 980 }}
      >
        {title}
      </div>
      {subtitle ? (
        <div style={{ fontSize: 30, color: '#a99fb8', marginTop: 22, maxWidth: 900 }}>
          {subtitle}
        </div>
      ) : null}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 26,
          color: '#a99fb8',
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 999, background: '#c02a4a' }} />
        SCORPIO DAILY
      </div>
    </div>
  )
}
