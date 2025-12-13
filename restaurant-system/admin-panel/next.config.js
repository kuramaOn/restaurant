/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin',
  assetPrefix: '/admin',
  images: {
    domains: ['images.unsplash.com'],
  },
  // Allow rewrites for multi-zone
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },
}

module.exports = nextConfig
