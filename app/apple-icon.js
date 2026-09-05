import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(120px 120px at 40% 30%, #2a1740, #0b0812 70%)',
      }}
    >
      <svg
        width="112"
        height="100"
        viewBox="0 0 28 24"
        fill="none"
        stroke="#d9b46a"
        strokeWidth="2.4"
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
