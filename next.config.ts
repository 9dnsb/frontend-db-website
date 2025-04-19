import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

// Update this to match your actual deployed API domain
const prodApiDomain = 'https://backend-db-website.vercel.app'

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' ${isDev ? 'http://localhost:3000' : prodApiDomain};
  frame-ancestors 'none';
`
  .replace(/\s{2,}/g, ' ')
  .trim()

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
