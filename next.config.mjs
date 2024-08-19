import process from 'node:process'
import { fileURLToPath } from 'node:url'
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
  webpack: (config, options) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        module: false,
        'stream/promises': false,
      },
    }

    config.module.rules.push({
      test: /\.+(js|jsx|mjs|ts|tsx)$/,
      use: options.defaultLoaders.babel,
      // @ts-ignore
      include: fileURLToPath(import.meta.resolve('@electric-sql/pglite')),
      type: 'javascript/auto',
    })

    config.module.rules.push({
      test: /\.sql$/,
      // This is the asset module.
      type: 'asset/source',
    })

    if (!options.isServer) {
      config.resolve.fallback = { fs: false, module: false, path: false }
    }

    return config
  },
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
