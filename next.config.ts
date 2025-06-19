import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // 中文页面重写规则
      {
        source: '/zh',
        destination: '/?lang=zh',
      },
      {
        source: '/zh/:path*',
        destination: '/:path*?lang=zh',
      },
    ];
  },
};

export default nextConfig;
