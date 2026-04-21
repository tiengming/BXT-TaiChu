# 卜仙堂 (BuXianTang) - 品牌门户：鸿蒙开辟篇

> 这是一个基于 Cloudflare Workers 部署的品牌导航单页，通过 3D 粒子引擎与 WebGL 动画，演绎从混沌开辟到金丹化境的东方哲学视觉。

## 🪐 视觉哲学 (Visionary Narrative)

本项目通过四阶段动效，演示“道”的动态演化：
1. **混沌期 (Chaos):** 暗色调 `#161823` 代表未知的宇宙原点。微弱呼吸感的粒子流动。
2. **化生期 (Duality):** `朱砂 #FF461F` (阳) 与 `玄青 #232021` (阴) 丝线以**流体动力学**轨迹交融。
3. **开辟期 (The Big Bang):** 金丹碰撞引发全屏反转，视觉色彩从暗转明，背景切换至具有宣纸质感的 `缟羽 #F1F1F1`。
4. **呈现期 (Manifestation):** `黄金 #EACD76` 流光凝结为品牌标识，导航矩阵伴随墨韵浮现。

## 🎨 动效细节规范与审查标准

### 1. 流动性规范 (Fluidity Spec)
- **实现原理:** 丝线采用 `CatmullRomCurve3` 生成，并通过正弦波函数实时调制顶点坐标：`p.x += sin(time + progress) * amplitude`。
- **视觉目标:** 消除机械感，模拟丝绸在风中或流体中滑动的有机质感。

### 2. 审查标准 (Review Standard)
本项目遵循 **《东方哲学视觉动效审查标准》**：
- **流动性与有机感:** 路径需具备自然波动。
- **阴阳平衡:** 对立元素交互需具备张力。
- **韵律感:** 节奏遵循“疾徐结合”的物理逻辑。

## 🛠️ 开发与测试

### 环境要求
- Node.js 20+

### 快速开始
- 安装: `npm install`
- 开发: `npm run dev`
- 测试: `npm test`

## 🚀 部署

### Cloudflare Workers & GitHub Pages
- 构建: `npm run build`
- 部署: 通过 GitHub Actions 自动化推送到 CF Worker 和 GitHub Pages。

---
© 2026 卜仙堂 - 易理、技术与美学的融合。
