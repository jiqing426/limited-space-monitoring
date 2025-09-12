module.exports = {
  apps: [{
    name: 'lsm',      // 应用名称
    script: 'pnpm',            // 使用 pnpm 作为启动脚本
    args: 'run start',           // 运行 pnpm run dev
    instances: 1,              // 单实例运行
    autorestart: true,         // 自动重启
    watch: true,              // 关闭文件监听
    max_memory_restart: '1G',  // 内存限制
    env: {
      NODE_ENV: 'development',
      PORT: 8084
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8084
    }
  }]
};