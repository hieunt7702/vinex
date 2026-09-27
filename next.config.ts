import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
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
