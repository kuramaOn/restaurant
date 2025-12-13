/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/kitchen',
  assetPrefix: '/kitchen',
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
