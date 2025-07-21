import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',  // 使用独立输出模式
  webpack: (config) => {
    config.externals = [...(config.externals || []), '@clickhouse/client'];
    return config;
  }
};

export default nextConfig;
