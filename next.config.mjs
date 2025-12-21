/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  devIndicators: {
    buildActivity: false,        // مخفی کردن آیکون build
    buildActivityPosition: "bottom-right",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
