import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // ✅ Generate a random nonce (Base64-encoded UUID)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // ✅ Content Security Policy using the nonce
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  // ✅ Add nonce to request headers (for Server Components to read)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  // ✅ Build response and attach CSP + propagated request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set('Content-Security-Policy', csp)

  return response
}

// ✅ Match all app routes except static/image/api/prefetch requests
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
