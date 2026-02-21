import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
