import process from 'node:process'
Object.assign(process.env, { NEXT_TELEMETRY_DISABLED: '1' })

// /**
//  * @typedef {import('next').NextConfig} NextConfig
//  * @typedef {Array<((config: NextConfig) => NextConfig)>} NextConfigPlugins
//  */
// import nextMDX from '@next/mdx'
// import rehypePrettyCode from 'rehype-pretty-code'

/** @type {NextConfigPlugins} */
const plugins = []

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['next-mdx-remote'],
  headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

const securityHeaders = [
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
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
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

export default nextConfig
