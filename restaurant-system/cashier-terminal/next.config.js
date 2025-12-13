/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/cashier',
  assetPrefix: '/cashier',
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
