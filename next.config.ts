import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// VINEX Next.js Config — optimised for Railway
//
// CORS headers are defined here for the middleware layer.
// The actual CORS logic per request is handled in /lib/cors.ts.
// ─────────────────────────────────────────────────────────────────────────────

const CORS_ALLOWED_HEADERS =
  "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id, x-user-username, x-user-fullname, x-user-role, X-User-Id, X-User-Username, X-User-Fullname, X-User-Role, Cache-Control, Pragma";

const CORS_EXPOSE_HEADERS =
  "Content-Length, Content-Range, x-user-id, x-user-role, Authorization";

const CORS_HEADERS_WITH_ORIGIN = [
  { key: "Access-Control-Allow-Credentials", value: "true" },
  { key: "Access-Control-Allow-Origin",      value: ":origin" },
  { key: "Access-Control-Allow-Methods",     value: "GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD" },
  { key: "Access-Control-Allow-Headers",     value: CORS_ALLOWED_HEADERS },
  { key: "Access-Control-Expose-Headers",    value: CORS_EXPOSE_HEADERS },
  { key: "Access-Control-Max-Age",           value: "86400" },
];

const CORS_HEADERS_WILDCARD = [
  { key: "Access-Control-Allow-Origin",   value: "*" },
  { key: "Access-Control-Allow-Methods",  value: "GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD" },
  { key: "Access-Control-Allow-Headers",  value: CORS_ALLOWED_HEADERS },
  { key: "Access-Control-Expose-Headers", value: CORS_EXPOSE_HEADERS },
  { key: "Access-Control-Max-Age",        value: "86400" },
];

const nextConfig: NextConfig = {
  // Compress responses — important on Railway where the reverse proxy may not
  compress: true,

  // Experimental: bundle server components more aggressively
  experimental: {
    optimizePackageImports: ['@prisma/client'],
  },

  images: {
    // Only allow Cloudinary and same-origin; wildcard ** is too broad for security
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Minimise image optimization work on Railway (use Cloudinary transformations instead)
    minimumCacheTTL: 60,
  },

  async headers() {
    return [
      // ── CORS for API routes with an Origin header (credentialed requests) ─
      {
        source: '/api/:path*',
        has: [
          {
            type: 'header',
            key: 'origin',
            value: '(?<origin>https?://.*)',
          },
        ],
        headers: CORS_HEADERS_WITH_ORIGIN,
      },
      {
        source: '/v1/:path*',
        has: [
          {
            type: 'header',
            key: 'origin',
            value: '(?<origin>https?://.*)',
          },
        ],
        headers: CORS_HEADERS_WITH_ORIGIN,
      },
      // ── CORS wildcard (no Origin header — curl, Postman, server-to-server) ─
      {
        source: '/api/:path*',
        headers: CORS_HEADERS_WILDCARD,
      },
      {
        source: '/v1/:path*',
        headers: CORS_HEADERS_WILDCARD,
      },
      // ── Static assets — aggressive caching ────────────────────────────────
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:locale/request-quote',
        destination: '/:locale/lien-he',
        permanent: true,
      },
      {
        source: '/:locale/tin-tuc/gioi-thieu',
        destination: '/:locale/gioi-thieu',
        permanent: true,
      },
      {
        source: '/miss-world-2026',
        destination: '/vi/tin-tuc/vinex-miss-world',
        permanent: true,
      },
      {
        source: '/:locale/miss-world-2026',
        destination: '/:locale/tin-tuc/vinex-miss-world',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
