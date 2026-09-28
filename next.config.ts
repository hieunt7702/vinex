import type { NextConfig } from "next";

const CORS_HEADERS_WITH_ORIGIN = [
  { key: "Access-Control-Allow-Credentials", value: "true" },
  { key: "Access-Control-Allow-Origin", value: ":origin" },
  { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD" },
  { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id, x-user-username, x-user-fullname, x-user-role, X-User-Id, X-User-Username, X-User-Fullname, X-User-Role, Cache-Control, Pragma" },
  { key: "Access-Control-Expose-Headers", value: "Content-Length, Content-Range, x-user-id, x-user-role, Authorization" },
  { key: "Access-Control-Max-Age", value: "86400" },
];

const CORS_HEADERS_WILDCARD = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD" },
  { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id, x-user-username, x-user-fullname, x-user-role, X-User-Id, X-User-Username, X-User-Fullname, X-User-Role, Cache-Control, Pragma" },
  { key: "Access-Control-Expose-Headers", value: "Content-Length, Content-Range, x-user-id, x-user-role, Authorization" },
  { key: "Access-Control-Max-Age", value: "86400" },
];

const nextConfig: NextConfig = {
  images: {
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
  },

  async headers() {
    return [
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
      {
        source: '/api/:path*',
        headers: CORS_HEADERS_WILDCARD,
      },
      {
        source: '/v1/:path*',
        headers: CORS_HEADERS_WILDCARD,
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
