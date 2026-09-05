import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: 'Scorpio',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0812',
    theme_color: '#0b0812',
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
