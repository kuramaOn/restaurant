/** @type {import('next').NextConfig} */
const nextConfig = {
  // Multi-zone routing configuration
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin',
      },
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
      {
        source: '/menu',
        destination: '/menu',
      },
      {
        source: '/menu/:path*',
        destination: '/menu/:path*',
      },
      {
        source: '/cashier',
        destination: '/cashier',
      },
      {
        source: '/cashier/:path*',
        destination: '/cashier/:path*',
      },
      {
        source: '/kitchen',
        destination: '/kitchen',
      },
      {
        source: '/kitchen/:path*',
        destination: '/kitchen/:path*',
      },
    ]
  },
}

module.exports = nextConfig
