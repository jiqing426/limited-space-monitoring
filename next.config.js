/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',  // 使用独立输出模式
  webpack: (config) => {
    config.externals = [...(config.externals || []), '@clickhouse/client'];
    return config;
  },
  // 确保 Next.js 使用正确的应用目录
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig; 