import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0812',
        borderRadius: 12,
      }}
    >
      <svg
        width="42"
        height="38"
        viewBox="0 0 28 24"
        fill="none"
        stroke="#c02a4a"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 8 A3 3 0 0 1 8 8 V17" />
        <path d="M8 8 A3 3 0 0 1 14 8 V17" />
        <path d="M14 8 A3 3 0 0 1 20 8 V19 L25 14.5" />
        <path d="M25 20 L25 14.5 L19.5 14.5" />
      </svg>
    </div>,
    { ...size }
  )
}
