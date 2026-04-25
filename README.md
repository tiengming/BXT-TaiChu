# 卜仙堂 · Spatiotemporal Resonance System (Resonance Plus)

> **"道法自然，气象共鸣"**

A high-fidelity, interdisciplinary web experience that fuses traditional Chinese phenology (72 Pentads) with global real-time weather and geo-spatial data. Built on Cloudflare Workers for edge-speed delivery and "Computational Aesthetic" rendering.

## 🌌 Core Features

### 1. Global Weather & Spatiotemporal Synchronization
- **Dual-Track API Logic:**
  - **China (CN):** QWeather (和风天气) v7 integration for city-level precision.
  - **Global:** OpenWeatherMap One Call API for comprehensive coverage.
- **True Solar Sync:** Day/night transitions and behavior advice are driven by target location sunrise/sunset timestamps and timezone offsets, resolving timezone perception gaps for proxy/travel users.

### 2. Phenological Intelligence
- **72 Pentads (物候):** Dynamic mapping of traditional micro-seasons to "Zhongguose" (Chinese colors) via `tyme4ts`.
- **Philosophical Activity Matrix:** Generates behavioral advice based on the cross-section of solar time and real-time weather (e.g., "宜观星" for clear nights, "宜品茗" during rainy afternoons).

### 3. Computational Aesthetics (Atmosphere Layer)
- **SVG Turbulence:** Dynamic `feTurbulence` and `feDisplacementMap` filters simulating "Xuan Paper" grain and atmospheric mist.
- **Visual Effects:**
  - **Clear:** Tyndall beam effects via mask-imaging.
  - **Storm:** GSAP-driven lightning pulse animations.
- **Two-Tier Performance Safeguard:**
  - **< 40fps:** Simplifies SVG filter complexity.
  - **< 20fps:** Completely removes atmosphere layers to prioritize basic readability.

## 🛠 Technical Architecture

- **Runtime:** Cloudflare Workers (Edge Computing).
- **Module System:** Client-side logic refactored to **ES Modules** for scope safety and reliable dependency loading.
- **Security:** Strict build-time stability using hex-encoding for sensitive characters and `textContent` for dynamic UI strings.
- **Animation:** GSAP (GreenSock Animation Platform) for synchronized visual state management.

## 🚀 Deployment

1. **Environment Variables:**
   - `QWEATHER_KEY`: Your QWeather API Key.
   - `OPENWEATHER_KEY`: Your OpenWeatherMap API Key.
2. **Wrangler Configuration:**
   - Ensure `compatibility_date` is correctly set.
   - Run `wrangler deploy` to push to the edge.

---
*© 卜仙堂 · 道隐无名*
