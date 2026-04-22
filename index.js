export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>卜仙堂 · 道生万象</title>
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <!-- Font Awesome 图标库 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        /* ============================================
           集中配置模块 (用户可自定义)
           ============================================ */
        :root {
            /* 色彩配置 (参考中国色 zhongguose.com) */
            --color-void: #0a0a0f;      /* 极渊黑 (混沌) */
            --color-paper: #F1F1F1;      /* 缟羽 (宣纸) */
            --color-yang: #FF461F;       /* 朱砂 (阳) */
            --color-yin: #232021;        /* 玄青 (阴) */
            --color-gold: #EACD76;       /* 金 (凝结) */
            --color-amber: #CA6924;      /* 琥珀 (点缀) */
            --color-ink: #50616D;        /* 墨色 (文字) */
            --color-cyan: #425066;       /* 黛蓝 (阴线发光) */
            --color-ivory: #EEDEB0;      /* 牙色 (纹理暖调) */

            /* 动画时长配置 */
            --dur-chaos: 0.5s;
            --dur-spiral: 5.2s;
            --dur-bang: 0.6s;
            --dur-crystallize: 2.2s;

            /* 布局偏移量 (可调) */
            --logo-top: 8vh;
            --logo-left: 5vw;
            --nav-right: 6vw;
            --nav-top: 10vh;
            --footer-bottom: 2vh;
            --footer-right: 6vw;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body, html {
            width: 100%; height: 100%;
            overflow: hidden;
            background-color: var(--color-void);
            font-family: "STKaiti", "KaiTi", "Songti SC", "Noto Serif SC", serif;
        }

        #canvas-container {
            position: relative; width: 100%; height: 100%;
        }

        canvas {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
        }

        #bg-canvas { z-index: 1; }
        #particle-canvas { z-index: 2; }
        #texture-canvas {
            z-index: 3;
            pointer-events: none;
            mix-blend-mode: multiply;
            opacity: 0.22;
        }
        #ink-overlay {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none; z-index: 4;
        }

        /* ===== 三层气脉布局 (东方章法) ===== */
        #ui-layer {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 20;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 5% 0;
            box-sizing: border-box;
        }

        /* 第一层：主峰 Logo —— 左偏上 */
        .logo-wrapper {
            position: relative;
            align-self: flex-start;
            margin-top: var(--logo-top);
            margin-left: var(--logo-left);
            pointer-events: none;
        }

        #logo-canvas {
            width: min(420px, 75vw);
            height: auto;
            aspect-ratio: 360/140;
            opacity: 0;
            transition: opacity 1.5s cubic-bezier(0.2, 0.9, 0.3, 1);
            filter: drop-shadow(8px 8px 16px rgba(0,0,0,0.08));
            pointer-events: none;
        }

        /* 第二层：案几导航 —— 右下方，与Logo形成对角 */
        .matrix-nav {
            position: relative;
            align-self: flex-end;
            margin-top: var(--nav-top);
            margin-right: var(--nav-right);
            display: flex;
            gap: 2.8rem;
            opacity: 0;
            pointer-events: none;
        }

        .nav-item {
            color: var(--color-ink);
            text-decoration: none;
            font-size: clamp(18px, 5vw, 24px);
            letter-spacing: 8px;
            padding-bottom: 12px;
            pointer-events: auto;
            opacity: 0.7;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }

        /* 界画分隔 (墨点) */
        .nav-item:not(:last-child)::after {
            content: '·';
            position: absolute;
            right: -1.8rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-amber);
            font-size: 20px;
            opacity: 0.4;
        }

        .nav-item:hover {
            color: var(--color-yang);
            opacity: 1;
            transform: translateX(4px);
        }

        /* 第三层：印章落款 —— 右下角 */
        .social-row {
            position: absolute;
            bottom: 8vh;
            right: var(--footer-right);
            display: flex;
            gap: 24px;
            opacity: 0;
            pointer-events: none;
        }

        .social-icon {
            color: var(--color-amber);
            font-size: 26px;
            pointer-events: auto;
            cursor: pointer;
            transition: all 0.3s;
            opacity: 0.6;
        }

        .social-icon:hover {
            color: var(--color-yang);
            opacity: 1;
            transform: translateY(-4px);
            filter: drop-shadow(0 0 12px var(--color-yang));
        }

        /* 页脚小字 (落款) */
        .footer {
            position: absolute;
            bottom: var(--footer-bottom);
            right: var(--footer-right);
            color: var(--color-ink);
            font-size: 11px;
            letter-spacing: 4px;
            opacity: 0;
            text-align: right;
            pointer-events: none;
            transition: opacity 1.5s;
        }

        /* 音频提示 */
        #audio-prompt {
            position: absolute;
            bottom: 20px;
            left: 24px;
            color: var(--color-amber);
            font-size: 12px;
            opacity: 0.5;
            z-index: 25;
            pointer-events: none;
            transition: opacity 0.5s;
        }
    </style>
</head>
<body>

<div id="canvas-container">
    <canvas id="bg-canvas"></canvas>
    <canvas id="particle-canvas"></canvas>
    <canvas id="texture-canvas"></canvas>
    <canvas id="ink-overlay"></canvas>
</div>

<div id="ui-layer">
    <!-- 第一层：Logo 左上方 -->
    <div class="logo-wrapper">
        <canvas id="logo-canvas" width="360" height="140"></canvas>
    </div>

    <!-- 第二层：导航右下方 -->
    <div class="matrix-nav">
        <a href="#blog" class="nav-item">博客入口</a>
        <a href="#classics" class="nav-item">经典解析</a>
        <a href="#socials" class="nav-item">社交媒体</a>
    </div>

    <!-- 第三层：社交与页脚右下角 -->
    <div class="social-row">
        <a href="#" class="social-icon" title="微信公众号"><i class="fab fa-weixin"></i></a>
        <a href="#" class="social-icon" title="Bilibili"><i class="fab fa-bilibili"></i></a>
        <a href="#" class="social-icon" title="电子邮箱"><i class="fas fa-envelope"></i></a>
    </div>
    <div class="footer">
        <span>© 卜仙堂 · 道隐无名</span>
    </div>
</div>

<div id="audio-prompt">⚲ 轻触闻道</div>

<script>
(function(){
    "use strict";

    /* ============================================
       集中配置模块 (用户可修改以下常量)
       ============================================ */
    const CONFIG = {
        // 粒子数量与行为
        MAX_PARTICLES: 5000,
        PARTICLE_SPEED_BASE: { yang: 18, yin: 10, gold: 6 },
        PARTICLE_DECAY: { min: 0.004, max: 0.012 },
        TEXT_SAMPLE_STEP: 2,          // 文字路径采样密度
        
        // 轨迹参数
        MAX_TRAIL_LENGTH: 55,
        LORENZ_SIGMA: 10,
        LORENZ_RHO: 28,
        LORENZ_BETA: 8/3,
        LORENZ_DT: 0.012,
        
        // 音频
        AUDIO_FREQ: 42,
        AUDIO_DURATION: 2.5,
        AUDIO_VOLUME: 0.02,
        
        // 交互
        INK_DROP_LIFE: 0.9,
        INK_DROP_RADIUS: 2,
        MOUSE_INK_PROBABILITY: 0.25,
        
        // 文字
        MAIN_TEXT: '卜仙堂',
        FONT: "bold 86px 'STKaiti', 'KaiTi', 'Noto Serif SC', serif",
        
        // 页脚文字
        FOOTER_TEXT: '© 卜仙堂 · 道隐无名',
    };

    // ---------- 画布与全局变量 ----------
    const bgCanvas = document.getElementById('bg-canvas');
    const particleCanvas = document.getElementById('particle-canvas');
    const textureCanvas = document.getElementById('texture-canvas');
    const logoCanvas = document.getElementById('logo-canvas');
    const inkCanvas = document.getElementById('ink-overlay');
    
    const bgCtx = bgCanvas.getContext('2d');
    const pCtx = particleCanvas.getContext('2d', { alpha: true });
    const texCtx = textureCanvas.getContext('2d');
    const logoCtx = logoCanvas.getContext('2d');
    const inkCtx = inkCanvas.getContext('2d');

    let w, h, cx, cy;

    // ---------- 中国色 (从CSS变量读取，也可硬编码) ----------
    const COLORS = {
        void: '#0a0a0f',
        paper: '#F1F1F1',
        yang: '#FF461F',
        yin: '#232021',
        gold: '#EACD76',
        amber: '#CA6924',
        ink: '#50616D',
        cyan: '#425066',
        ivory: '#EEDEB0'
    };

    // ---------- 物理状态 ----------
    const sim = {
        phase: 0,          // 0:混沌, 1:化生, 2:爆发, 3:凝结
        time: 0,
        orbitRadius: 0,
        coreSize: 0,
        bgColor: COLORS.void,
        lx: 0.1, ly: 0, lz: 0,
        textSolidified: false
    };

    const particles = [];
    const trails = { yang: [], yin: [] };
    let textTargetPoints = [];

    // ---------- 宣纸纹理生成 (使用噪声) ----------
    function generateTexture() {
        const tw = textureCanvas.width, th = textureCanvas.height;
        if (tw === 0 || th === 0) return;
        const imageData = texCtx.createImageData(tw, th);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % tw;
            const y = Math.floor(i / 4 / tw);
            const value = (Math.sin(x * 0.02) * Math.cos(y * 0.02) + 
                          Math.sin(x * 0.05 + 1) * Math.cos(y * 0.05) * 0.5 + 
                          Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.2) * 0.5 + 0.5;
            const v = Math.floor(value * 35);
            data[i] = data[i+1] = data[i+2] = v;
            data[i+3] = 255;
        }
        texCtx.putImageData(imageData, 0, 0);
    }

    // ---------- 计算文字路径点阵 ----------
    function computeTextPoints() {
        const offCanvas = new OffscreenCanvas(360, 140);
        const offCtx = offCanvas.getContext('2d');
        offCtx.clearRect(0, 0, 360, 140);
        offCtx.font = CONFIG.FONT;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillStyle = "#ffffff";
        offCtx.fillText(CONFIG.MAIN_TEXT, 180, 70);
        
        const imgData = offCtx.getImageData(0, 0, 360, 140);
        const data = imgData.data;
        const points = [];
        const step = CONFIG.TEXT_SAMPLE_STEP;
        for (let y = 0; y < 140; y += step) {
            for (let x = 0; x < 360; x += step) {
                const idx = (y * 360 + x) * 4;
                if (data[idx] > 128) {
                    const nx = (x / 360) * 2 - 1;
                    const ny = (y / 140) * 2 - 1;
                    const px = cx + nx * Math.min(w, h) * 0.38;
                    const py = cy + ny * Math.min(w, h) * 0.16;
                    points.push({ x: px, y: py });
                }
            }
        }
        textTargetPoints = points;
    }

    // ---------- 粒子类 ----------
    class Particle {
        constructor(x, y, type) {
            this.x = x; this.y = y;
            this.type = type; // 0:阳, 1:阴, 2:金(文字)
            const angle = Math.random() * Math.PI * 2;
            const speedCfg = CONFIG.PARTICLE_SPEED_BASE;
            const speed = type === 0 ? speedCfg.yang : (type === 1 ? speedCfg.yin : speedCfg.gold);
            this.vx = Math.cos(angle) * speed * (0.7 + Math.random()*0.6);
            this.vy = Math.sin(angle) * speed * (0.7 + Math.random()*0.6);
            this.size = type === 2 ? 1.8 : (2.2 + Math.random()*2.5);
            this.life = 1.0;
            this.decay = CONFIG.PARTICLE_DECAY.min + Math.random() * (CONFIG.PARTICLE_DECAY.max - CONFIG.PARTICLE_DECAY.min);
            if (type === 2) {
                this.target = null;
                this.settled = false;
            }
        }
        update() {
            if (this.type === 2 && !this.settled) {
                if (textTargetPoints.length && !this.target) {
                    let minDist = Infinity, nearest = null;
                    for (let p of textTargetPoints) {
                        const dx = p.x - this.x, dy = p.y - this.y;
                        const d = dx*dx + dy*dy;
                        if (d < minDist) { minDist = d; nearest = p; }
                    }
                    this.target = nearest;
                }
                if (this.target) {
                    const dx = this.target.x - this.x;
                    const dy = this.target.y - this.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 2.5) {
                        this.settled = true;
                        this.vx = this.vy = 0;
                    } else {
                        const force = 0.018;
                        this.vx += dx * force;
                        this.vy += dy * force;
                    }
                }
            }
            this.vx *= 0.955;
            this.vy *= 0.955;
            this.x += this.vx;
            this.y += this.vy;
            if (this.type !== 2 || !this.settled) {
                this.life -= this.decay;
            } else {
                this.life = 0.95;
            }
        }
        draw(ctx) {
            if (this.life <= 0.01) return;
            ctx.globalAlpha = this.life * (this.type === 1 ? 0.8 : 1.0);
            let color;
            if (this.type === 0) color = COLORS.yang;
            else if (this.type === 1) color = COLORS.cyan;  // 阴线用黛蓝提亮
            else color = COLORS.gold;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * (0.7 + 0.3*Math.sin(sim.time*4 + this.x)), 0, 2*Math.PI);
            ctx.fill();
            if (this.type === 2) {
                ctx.shadowBlur = 14;
                ctx.shadowColor = COLORS.amber;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    // ---------- 洛伦兹吸引子更新轨迹 ----------
    function updateTrails() {
        const s = CONFIG.LORENZ_SIGMA, r = CONFIG.LORENZ_RHO, b = CONFIG.LORENZ_BETA;
        const dt = CONFIG.LORENZ_DT;
        const dx = s * (sim.ly - sim.lx) * dt;
        const dy = (sim.lx * (r - sim.lz) - sim.ly) * dt;
        const dz = (sim.lx * sim.ly - b * sim.lz) * dt;
        sim.lx += dx; sim.ly += dy; sim.lz += dz;
        const scale = Math.min(w, h) * 0.016;
        const yangX = cx + sim.lx * scale;
        const yangY = cy + sim.ly * scale;
        const yinX = cx - sim.ly * scale * 0.75;
        const yinY = cy - sim.lx * scale * 0.75;
        trails.yang.push({x: yangX, y: yangY});
        trails.yin.push({x: yinX, y: yinY});
        if (trails.yang.length > CONFIG.MAX_TRAIL_LENGTH) trails.yang.shift();
        if (trails.yin.length > CONFIG.MAX_TRAIL_LENGTH) trails.yin.shift();
        sim.orbitRadius = Math.hypot(sim.lx, sim.ly) * scale;
    }

    // 绘制发光丝线
    function drawTrail(trail, baseColor, glowColor, blur) {
        if (trail.length < 2) return;
        pCtx.beginPath();
        pCtx.moveTo(trail[0].x, trail[0].y);
        for (let i=1; i<trail.length; i++) {
            const xc = (trail[i].x + trail[i-1].x)/2;
            const yc = (trail[i].y + trail[i-1].y)/2;
            pCtx.quadraticCurveTo(trail[i-1].x, trail[i-1].y, xc, yc);
        }
        pCtx.strokeStyle = baseColor;
        pCtx.lineWidth = 2.8;
        pCtx.shadowBlur = blur;
        pCtx.shadowColor = glowColor;
        pCtx.stroke();
        // 第二层描边增强可见性
        pCtx.shadowBlur = blur * 0.6;
        pCtx.lineWidth = 1.2;
        pCtx.strokeStyle = glowColor;
        pCtx.stroke();
        pCtx.shadowBlur = 0;
    }

    // 墨韵交互
    const inkDrops = [];
    function drawInkEffects() {
        inkCtx.clearRect(0, 0, w, h);
        for (let i=inkDrops.length-1; i>=0; i--) {
            const d = inkDrops[i];
            d.radius += 1.8;
            d.life -= 0.015;
            if (d.life <= 0) { inkDrops.splice(i,1); continue; }
            const gradient = inkCtx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
            gradient.addColorStop(0, 'rgba(80,97,109,'+ d.life*0.25 +')');
            gradient.addColorStop(1, 'rgba(80,97,109,0)');
            inkCtx.fillStyle = gradient;
            inkCtx.beginPath();
            inkCtx.arc(d.x, d.y, d.radius, 0, 2*Math.PI);
            inkCtx.fill();
        }
    }

    // ---------- 渲染循环 ----------
    function render() {
        bgCtx.fillStyle = sim.bgColor;
        bgCtx.fillRect(0, 0, w, h);
        
        pCtx.globalCompositeOperation = 'source-over';
        pCtx.fillStyle = sim.bgColor;
        pCtx.globalAlpha = sim.phase >= 3 ? 0.03 : 0.18;
        pCtx.fillRect(0, 0, w, h);
        pCtx.globalAlpha = 1.0;
        
        sim.time += 0.018;

        if (sim.phase === 0) {
            // 混沌期仅背景
        } else if (sim.phase === 1) {
            updateTrails();
            drawTrail(trails.yang, COLORS.yang, '#FF8A6F', 18);
            drawTrail(trails.yin, COLORS.cyan, '#6A7A8C', 14);
            // 绘制端点光球
            if (trails.yang.length) {
                const p = trails.yang[trails.yang.length-1];
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, 9, 0, 2*Math.PI);
                pCtx.fillStyle = COLORS.yang;
                pCtx.shadowBlur = 30; pCtx.shadowColor = COLORS.yang;
                pCtx.fill();
            }
            if (trails.yin.length) {
                const p = trails.yin[trails.yin.length-1];
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, 7, 0, 2*Math.PI);
                pCtx.fillStyle = COLORS.cyan;
                pCtx.shadowBlur = 25; pCtx.shadowColor = COLORS.cyan;
                pCtx.fill();
            }
            pCtx.shadowBlur = 0;
        } else if (sim.phase >= 2) {
            // 金丹
            if (sim.coreSize > 0) {
                const gradient = pCtx.createRadialGradient(cx, cy, 0, cx, cy, sim.coreSize);
                gradient.addColorStop(0, COLORS.gold);
                gradient.addColorStop(0.8, COLORS.amber);
                pCtx.fillStyle = gradient;
                pCtx.shadowBlur = 60; pCtx.shadowColor = COLORS.gold;
                pCtx.beginPath();
                pCtx.arc(cx, cy, sim.coreSize, 0, 2*Math.PI);
                pCtx.fill();
                pCtx.shadowBlur = 0;
            }
            // 粒子更新与绘制
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(pCtx);
                if (p.life <= 0.01) particles.splice(i, 1);
            }
        }

        // 若文字已固化，绘制实体书法字
        if (sim.textSolidified) {
            logoCtx.clearRect(0, 0, 360, 140);
            logoCtx.font = CONFIG.FONT;
            logoCtx.textAlign = "center";
            logoCtx.textBaseline = "middle";
            const grad = logoCtx.createLinearGradient(60, 0, 300, 140);
            grad.addColorStop(0, COLORS.gold);
            grad.addColorStop(0.6, COLORS.amber);
            logoCtx.fillStyle = grad;
            logoCtx.shadowBlur = 20;
            logoCtx.shadowColor = COLORS.amber;
            logoCtx.fillText(CONFIG.MAIN_TEXT, 180, 70);
            logoCtx.shadowBlur = 0;
        }

        drawInkEffects();
        requestAnimationFrame(render);
    }

    // ---------- GSAP 时间线 ----------
    function startAnimation() {
        const tl = gsap.timeline({ delay: 0.5 });
        
        // 混沌 -> 化生
        tl.set(sim, { phase: 1, bgColor: COLORS.void });
        tl.to(sim, { 
            orbitRadius: 0,
            duration: 5.2,
            ease: "power3.in",
            onUpdate: () => {
                if (sim.orbitRadius < 25) {
                    const s = 2.5 * (1 - sim.orbitRadius/25);
                    particleCanvas.style.transform = 'translate(' + (Math.random()*s-s/2) + 'px, ' + (Math.random()*s-s/2) + 'px)';
                } else particleCanvas.style.transform = '';
            },
            onComplete: () => particleCanvas.style.transform = ''
        });
        
        // 金丹凝结
        tl.add(() => { sim.phase = 2; trails.yang = []; trails.yin = []; sim.coreSize = 4; });
        tl.to(sim, { coreSize: 48, duration: 0.25, ease: "expo.out" });
        
        // 大爆炸粒子
        tl.add(() => {
            for (let i=0; i<1500; i++) particles.push(new Particle(cx, cy, i % 3));
            document.body.style.backgroundColor = '#FFF9F0';
            setTimeout(() => document.body.style.backgroundColor = '', 60);
        });
        tl.to(sim, { coreSize: 0, duration: 0.55, ease: "power2.in" });
        tl.to(sim, { bgColor: COLORS.paper, duration: 1.8 }, "-=0.3");
        
        // 文字凝结期
        tl.add(() => { sim.phase = 3; }, "-=0.6");
        tl.add(() => {
            for (let i=0; i<1200; i++) particles.push(new Particle(cx, cy, 2));
        }, "+=0.3");
        
        // 文字固化触发
        tl.add(() => {
            sim.textSolidified = true;
            logoCanvas.style.transition = 'filter 0.8s';
            logoCanvas.style.filter = 'drop-shadow(0 0 30px #EACD76)';
            setTimeout(() => logoCanvas.style.filter = 'drop-shadow(8px 8px 16px rgba(0,0,0,0.08))', 400);
        }, "+=2.0");
        
        // UI 显现 (对角布局动画)
        tl.to(logoCanvas, { opacity: 1, duration: 1.8 }, "-=0.5");
        tl.fromTo(".matrix-nav", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }, "-=1.2");
        tl.fromTo(".social-row", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5 }, "-=0.8");
        tl.to(".footer", { opacity: 0.7, duration: 2.0 }, "-=1.5");
    }

    // ---------- 交互事件 ----------
    function onMouseMove(e) {
        if (sim.phase < 3) return;
        const rect = particleCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const navs = document.querySelectorAll('.nav-item, .social-icon');
        let near = false;
        navs.forEach(n => {
            const b = n.getBoundingClientRect();
            if (e.clientX >= b.left-30 && e.clientX <= b.right+30 && e.clientY >= b.top-30 && e.clientY <= b.bottom+30) near = true;
        });
        if (near && Math.random() < CONFIG.MOUSE_INK_PROBABILITY) {
            inkDrops.push({ x, y, radius: CONFIG.INK_DROP_RADIUS, life: CONFIG.INK_DROP_LIFE });
        }
    }

    function onDocumentClick(e) {
        // 音效初始化
        if (!window._audioInit) {
            window._audioInit = true;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const actx = new AudioContext();
                const osc = actx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = CONFIG.AUDIO_FREQ;
                const gain = actx.createGain();
                gain.gain.value = CONFIG.AUDIO_VOLUME;
                osc.connect(gain).connect(actx.destination);
                osc.start();
                osc.stop(actx.currentTime + CONFIG.AUDIO_DURATION);
            }
            document.getElementById('audio-prompt').style.opacity = '0';
        }
        // 点击涟漪
        const rect = particleCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (let i=0; i<4; i++) {
            inkDrops.push({ x, y, radius: 4, life: 1.0 });
        }
    }

    // ---------- 初始化与自适应 ----------
    function resize() {
        w = bgCanvas.width = particleCanvas.width = textureCanvas.width = inkCanvas.width = window.innerWidth;
        h = bgCanvas.height = particleCanvas.height = textureCanvas.height = inkCanvas.height = window.innerHeight;
        cx = w / 2; cy = h / 2;
        generateTexture();
        computeTextPoints();
    }
    window.addEventListener('resize', resize);
    resize();
    
    document.fonts.ready.then(() => {
        computeTextPoints();
        startAnimation();
        render();
    });
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onDocumentClick);
    
    // 导航项点击防默认（示例）
    document.querySelectorAll('.nav-item, .social-icon').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('导航:', el.getAttribute('title') || el.innerText);
        });
    });

})();
</script>
</body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
};
