/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.gitpod.io/",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return []
  },
}

module.exports = nextConfig
