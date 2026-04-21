# 卜仙堂 (BuXianTang) - 品牌门户：鸿蒙开辟篇 (V1.0)

> 这是一个基于 Cloudflare Workers 部署的品牌导航单页，通过 3D 粒子引擎与 WebGL 动画，演绎从混沌开辟到金丹化境的东方哲学视觉。

## 🪐 视觉哲学 (Visionary Narrative)

本项目通过四阶段动效，演示“道”的动态演化：

### 阶段一：鸿蒙混沌 (Chaos)
- **视觉:** 屏幕全黑，低频 Perlin Noise 模拟暗流涌动的空间感。
- **技术:** 使用 ShaderMaterial 渲染背景纹理，叠加动态噪点（uOpacity: 0.1）。

### 阶段二：阴阳化生 (Duality)
- **视觉:** 朱砂（天）与玄青（地）丝线交错。丝线具备流体质感。
- **技术:** 基于 `CatmullRomCurve3` 的 3D 轨迹，实时正弦波调制实现波动感。支持鼠标引力排斥（Mouse Influence）。

### 阶段三：金丹碰撞 (The Big Bang)
- **视觉:** 丝线收缩融合为金丹，高频振动后触发全屏翻转。
- **技术:** 背景 Shader 实现从 Dark (#161823) 到 Light (#F1F1F1) 的过渡，模拟“滴墨入水”的扩散效果。

### 阶段四：真名显现 (Manifestation)
- **视觉:** 黄金流光凝结为品牌标识，导航矩阵以 Stagger 方式淡入。
- **技术:** Logo 具备边缘流光动画，导航项支持悬停交互与点击涟漪。

## 🎨 动效审查标准 (Eastern Philosophical UI Standard)

1. **流动性 (Fluidity):** 线条必须具备有机波动，严禁机械直线。
2. **调和性 (Balance):** 阴阳交互需具备视觉张力。
3. **韵律感 (Rhythm):** 节奏符合“疾徐结合”的物理逻辑。
4. **意向性 (Symbolism):** 转场需符合东方意境（如墨染、破晓）。

## 🛠️ 开发与测试
- 开发: `npm run dev`
- 测试: `npm test`
- 部署: 自动化 CI/CD 推送至 CF Workers 与 GitHub Pages。

---
© 2026 卜仙堂 - 易理、技术与美学的融合。
