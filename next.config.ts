import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'development.truckmitr.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'devtruckmitr.in',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://devtruckmitr.in/api/:path*",
      },
    ];
  },
};

export default nextConfig;
