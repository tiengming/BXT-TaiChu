# 卜仙堂 (BuXianTang) - 品牌门户：鸿蒙开辟篇

> 这是一个基于 Cloudflare Workers 部署的品牌导航单页，通过 3D 粒子引擎与 WebGL 动画，演绎从混沌开辟到金丹化境的东方哲学视觉。

## 🪐 视觉哲学 (Visionary Narrative)

本项目不仅是一个导航页，更是一场关于“道”的动态演示：
- **混沌期:** 暗色调 #161823 代表未知的宇宙原点。
- **化生期:** #FF461F (阳/天) 与 #232021 (阴/地) 丝线交融。
- **开辟期:** 金丹碰撞引发“宇宙大爆炸”，视觉色彩从暗转明，背景切换至 #F1F1F1。
- **呈现期:** #EACD76 丝线最终凝结为“卜仙堂”字样。

## 🛠️ 开发与测试规范

### 环境要求
- Node.js 20+
- npm 或 yarn

### 开发与测试
- 安装: npm install
- 开发: npm run dev
- 测试: npm test

### 代码规范
- WebGL: 场景逻辑封装在 src/cosmogony.js，使用 ES6 Class 管理。
- 动画: 核心时间轴由 GSAP 驱动，确保转场平滑。
- 样式: 遵循传统中国色定义，使用 CSS 变量管理颜色主题。

## 🚀 部署方案

### Cloudflare Workers
项目配置了 wrangler.toml，支持一键部署到 Cloudflare。
- 构建: npm run build
- 发布: wrangler publish

### GitHub Pages
项目支持通过 GitHub Actions 自动部署到 GitHub Pages。

### CI/CD 流程
1. Lint & Test: 验证代码质量。
2. Build: 生成生产环境资源。
3. Deploy: 分别推送到 Cloudflare 与 GitHub Pages。

---
© 2026 卜仙堂 - 易理、技术与美学的融合。
