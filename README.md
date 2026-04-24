# 卜仙堂 (BuXianTang) · 时空共鸣系统

> 基于 Cloudflare Workers 的全时空感应数字道场。融合中国传统物候（72物候）与全球实时气象，构建一个“道法自然”的动态环境感知界面。

## 🌟 核心特性

- **全球气象分流引擎**：
  - **中国大陆**：集成和风天气 (QWeather) v7，通过城市级 IP 定位纠偏，解决定位偏差。
  - **全球地区**：接入 OpenWeatherMap One Call API，覆盖全球气象数据。
- **视觉美学共鸣**：
  - **地色层**：联动 72 物候配色方案，随节气流转自动切换主题色。
  - **气色层**：基于 SVG `feTurbulence` 滤镜的实时大气层，动态关联风速、雨量与天气类型。
  - **墨色层**：智能感知背景亮度，自动切换 UI 文本对比度（#FFFFFF / #1E2732）。
- **动态交互体验**：
  - **物候状态栏**：根据节气、时间、天气生成富有哲学韵味的处世建议（如：此间 [谷雨] · 晨光 · 宜晨省）。
  - **地理位置共鸣**：实时计算用户与道场（Dojo）的时空距离，动态调整界面模糊度与阴影强度。
- **性能保障**：
  - 内置 FPS 监测器，当帧率低于 40fps 时自动降级 SVG 滤镜复杂度，确保移动端流畅度。

## 🛠️ 技术架构

- **Runtime**: Cloudflare Workers
- **Animation**: GSAP 3 (GreenSock Animation Platform)
- **Logic**: 模块化解耦设计 (WeatherEngine, ThemeEngine, PresenceEngine, Interaction)
- **Data Source**: QWeather v7, OpenWeatherMap API, Tyme4ts (物候计算)

## 📁 部署说明

### 1. 环境变量配置
在 Cloudflare Worker 控制台中添加以下密钥：
- `QWEATHER_KEY`: 和风天气 API Key (v7)
- `OPENWEATHER_KEY`: OpenWeatherMap API Key

### 2. 部署代码
```bash
wrangler deploy
```

## 📜 视觉规范

- **转义安全**：所有动态注入字符串均遵循 `\x5B` ( [ ), `\x5D` ( ] ) 等转义规范，规避构建工具解析冲突。
- **字体方案**：标题使用思源宋体 (Source Han Serif)，正文使用霞鹜文楷 (LXGW WenKai)，追求隐士美学质感。

---

© 2026 卜仙堂 · 易理、技术与美学的融合。
