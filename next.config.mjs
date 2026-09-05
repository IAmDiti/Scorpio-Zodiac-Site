/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Turbopack doesn't walk up to the home directory
  // (a stray lockfile lives in C:\Users\Diti).
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
  devIndicators: false,
}

export default nextConfig
