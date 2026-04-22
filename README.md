
# 卜仙堂 (BuXianTang) - 鸿蒙开辟篇

> 基于 Cloudflare Workers 部署的品牌导航单页。通过 Canvas 2D 粒子引擎与 GSAP 时间轴，演绎从混沌开辟到金丹化字的东方哲学视觉。

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tiengming/BXT-TaiChu)

## 🪐 视觉叙事

本项目不仅是一个导航页，更是一场关于“道”的动态演示：

- **混沌期**：背景为 **极渊黑** `#0a0a0f`，画面极静，如宇宙原点。
- **化生期**：天降红丝（**朱砂** `#FF461F`），地升黑丝（**玄青** `#344352`），双股能量如烟雾盘旋靠近。
- **开辟期**：两股能量在中心碰撞，生成逆时针漩涡，最终凝结为 **金丹**。金丹爆发，粒子四散，背景瞬间切换为暖白宣纸色 `#F3F0E6`。
- **呈现期**：爆炸中的 **黄金** `#EACD76` 粒子沿书法路径汇聚，凝结为“卜仙堂”三字，导航矩阵与社交入口如印章落款般渐显。

### 叙事阶段详表

| 阶段 | 时间 | 视觉重点 |
|------|------|----------|
| 混沌 | 0s – 1s | 纯黑背景，微弱星云呼吸感。 |
| 化生 | 1s – 5.5s | 红丝自顶落下，黑丝自底升起，尾部呈烟雾状，接近时逆时针漩涡生成。 |
| 爆发 | 5.5s – 7s | 金丹生长、爆炸，喷射红/黑/金粒子，背景转为宣纸色。 |
| 真名 | 7s – 9s | 金色粒子吸附成字，文字本体以水墨晕染效果浮现，导航 UI 淡入。 |

---

## 🛠️ 技术架构

- **部署环境**：Cloudflare Workers（单文件架构，无需构建）
- **渲染引擎**：原生 Canvas 2D API（多层画布：背景、纹理、粒子、墨韵）
- **动画驱动**：GSAP 3 时间轴，精确控制阶段流转与缓动
- **物理模拟**：自研粒子系统（含洛伦兹吸引子轨迹、烟雾扩散、漩涡场）
- **UI 层**：响应式 CSS Flexbox，图标使用 Font Awesome
- **色彩体系**：参考[中国色](https://zhongguose.com/)（极渊黑、朱砂、玄青、黄金、鸦青等）

---

## 📁 项目结构

```
Worker Script (index.js)
├── HTML 模板字符串
│   ├── <style> (CSS 变量、响应式布局)
│   ├── <canvas> 分层 (bg, texture, particle, ink)
│   ├── <div id="ui-layer"> (导航、社交、页脚)
│   └── <script> (内嵌核心逻辑)
│       ├── CONFIG 集中配置 (色彩、动画参数、外部链接)
│       ├── 粒子类 (Particle / SmokeParticle)
│       ├── 漩涡场与烟雾生成
│       ├── GSAP 时间线编排
│       └── 交互事件 (墨韵、音频、导航)
```

---

## ⚙️ 自定义配置

所有可调整项集中在代码开头的 `CONFIG` 对象与 CSS `:root` 中。

### 1. 修改导航链接

```javascript
LINKS: {
    blog: 'https://your-blog.com',          // 博客入口
    classics: 'https://classics.com',       // 经典解析
    about: 'https://about.me',              // 关于我
    wechat: 'https://mp.weixin.qq.com/...', // 微信公众号
    bilibili: 'https://space.bilibili.com/...',
    email: 'mailto:your@email.com'
}
```

### 2. 调整视觉色彩

在 `:root` 中修改 CSS 变量：

```css
--color-void: #0a0a0f;   /* 混沌背景 */
--color-paper: #F3F0E6;  /* 宣纸底色 */
--color-yang: #FF461F;   /* 朱砂阳线 */
--color-yin: #344352;    /* 玄青阴线 */
--color-gold: #EACD76;   /* 金丹与文字金色 */
--color-ink: #4A5B6E;    /* 最终文字色（鸦青） */
```

### 3. 调整动画节奏

```javascript
// 在 CONFIG 中修改
PARTICLE_SPEED: { yang: 18, yin: 10, gold: 8 },
SMOKE_PER_FRAME: 8,       // 烟雾浓度
// 在 GSAP 时间线中修改各阶段 duration
```

### 4. 修改 Logo 文字

```javascript
MAIN_TEXT: '卜仙堂',
FONT_SIZE: 72,
```

---

## 🚀 部署指南

### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 创建 Worker 项目

```bash
wrangler init buxiantang
cd buxiantang
```

### 4. 替换 `index.js` 内容

将本项目的完整 Worker 代码粘贴至 `index.js`。

### 5. 部署

```bash
wrangler deploy
```

部署完成后，访问 `https://your-worker-name.your-subdomain.workers.dev` 即可。

> **提示**：由于所有资源均已内联或使用 CDN，Worker 脚本体积约 45KB，无需绑定 KV 或 R2。

---

## 📱 响应式与兼容性

- 完美适配移动端、平板及桌面设备。
- 画布分辨率动态适配 `devicePixelRatio`，确保高清屏文字清晰。
- 导航与图标尺寸使用 `clamp()` 实现流体响应。
- 支持触摸事件，点击音效自动播放（需用户手势初始化）。

---

## 📜 许可与致谢

本项目视觉设计灵感源自中国传统色彩体系及道家宇宙观。  
代码实现为原创，可自由用于个人品牌展示与二次开发。

---

© 2026 卜仙堂 - 易理、技术与美学的融合。


