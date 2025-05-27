# 有限空间空气质量监测大屏

这是一个基于 Next.js 和 React 的有限空间空气质量监测大屏应用，集成了 Three.js 3D 模型展示和 ECharts 数据可视化。

## 功能特性

- **实时监测数据展示**：显示温度、湿度、氧气浓度、二氧化碳、甲烷、硫化氢等关键指标
- **空气质量指标排行**：横向条形图展示各项指标的排名
- **3D 模型展示**：使用 Three.js 展示 MX1 3D 模型，支持旋转、缩放、平移操作
- **趋势分析图表**：显示空气质量随时间变化的趋势
- **等级分布饼图**：展示不同空气质量等级的分布情况
- **响应式设计**：适配不同屏幕尺寸

## 技术栈

- **前端框架**：Next.js 15.3.2 + React 19
- **3D 渲染**：Three.js + @react-three/fiber + @react-three/drei
- **数据可视化**：ECharts
- **样式**：Tailwind CSS + 自定义 CSS
- **开发语言**：TypeScript

## 项目结构

```
├── app/
│   ├── components/
│   │   ├── ThreeJSViewer.tsx    # Three.js 3D 模型组件
│   │   ├── DataDisplay.tsx      # 实时数据显示组件
│   │   └── Charts.tsx           # ECharts 图表组件
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 布局组件
│   └── page.tsx                 # 主页面
├── public/
│   ├── img/                     # 图片资源
│   └── mx1.glb                  # 3D 模型文件
└── demo/                        # 原始 HTML 大屏模板
```

## 安装和运行

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发服务器：
```bash
pnpm dev
```

3. 打开浏览器访问：http://localhost:3000

## 主要组件说明

### ThreeJSViewer
- 替代原始地图模块的 3D 模型展示组件
- 支持鼠标交互（旋转、缩放、平移）
- 使用透明背景与大屏风格保持一致

### DataDisplay
- 实时显示 6 项空气质量指标
- 数据每 3 秒自动更新（模拟实时数据）
- 使用原始大屏的图标和样式

### Charts
- **RankChart**：空气质量指标排行榜
- **TrendChart**：24小时趋势分析图
- **LevelChart**：空气质量等级分布饼图

## 数据源

目前使用模拟数据，可以根据实际需求连接真实的传感器数据源或 API。

## 浏览器兼容性

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 开发说明

项目将原始 HTML 大屏模板转换为现代化的 React 应用，保持了原有的视觉设计和布局，同时用 Three.js 3D 模型替代了地图模块，提供了更好的交互体验和代码可维护性。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
