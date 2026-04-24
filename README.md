# 卜仙堂 · Spatiotemporal Resonance System (Resonance Plus)

> **"道法自然，气象共鸣"**

A high-fidelity, interdisciplinary web experience that fuses traditional Chinese phenology (72 Pentads) with global real-time weather and geo-spatial data. Built on Cloudflare Workers for edge-speed delivery and "Computational Aesthetic" rendering.

## 🌌 Core Features

### 1. Global Weather & Geo-Fencing
- **Dual-Track API Logic:**
  - **China (CN):** QWeather (和风天气) v7 integration for city-level precision via ISP-optimized IP databases.
  - **Global:** OpenWeatherMap One Call API for sunrise/sunset, UV, and atmospheric conditions.
- **Dojo Proximity:** Calculates the Haversine distance from the user's location to the **Dojo Coord** (30.24, 120.15) with real-time UI blurring based on spatial resonance.

### 2. Phenological Theme Engine
- **72 Pentads (物候):** Dynamic mapping of traditional micro-seasons to "Zhongguose" (Chinese colors).
- **Temporal Opacity:** Automatic night-mode transition triggered by actual solar sunset/sunrise data rather than static clocks.
- **Ink Breathing:** GSAP-driven synchronized transitions for theme colors, ink contrast, and background vignettes.

### 3. Computational Aesthetics (Atmosphere Layer)
- **SVG Turbulence:** Dynamic `feTurbulence` and `feDisplacementMap` filters simulating "Xuan Paper" grain and atmospheric mist.
- **Weather-Driven Filters:**
  - **Clear:** Tyndall beam effects via mask-imaging.
  - **Rain/Snow:** Increased turbulence frequency and displacement scale.
  - **Storm:** GSAP-driven visual opacity flashes (Lightning pulses).
- **Performance Safeguard:** Real-time FPS monitoring. Automatically degrades filter complexity (reduction to 1 octave) if frame rate drops below 40fps.

## 🛠 Technical Architecture

- **Runtime:** Cloudflare Workers (Edge Computing).
- **Security:** Strict hex-encoding (`\x5B`, `\x5D`, `\x22`) for all client-side injected JS to prevent build-time parsing conflicts.
- **Animation:** GSAP (GreenSock Animation Platform) for smooth, high-precision visual state management.
- **Typography:** LXGW WenKai (霞鹜文楷) for body text and Source Han Serif (思源宋体) for high-contrast titles.

## 🚀 Deployment

1. **Environment Variables:**
   - `QWEATHER_KEY`: Your QWeather API Key.
   - `OPENWEATHER_KEY`: Your OpenWeatherMap API Key.
2. **Wrangler Configuration:**
   - Run `wrangler deploy` to push to the edge.

## 📜 Philosophy

This project transcends mere data visualization. It aims to create an **Environment-Aware Interface (EAI)** where the digital boundary dissolves into the physical world's phenology. Each visit is unique, shaped by the local wind, the current pentad, and the user's distance from the origin.

---
*© 卜仙堂 · 道隐无名*
