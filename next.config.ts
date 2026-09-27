import type { NextConfig } from "next";

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
