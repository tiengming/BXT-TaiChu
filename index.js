export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
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
            --color-void: #0a0a0f;
            --color-paper: #EEDEB0;      /* 牙色 */
            --color-yang: #FF461F;       /* 朱砂 */
            --color-yin: #232021;        /* 玄青 */
            --color-gold: #EACD76;       /* 金 */
            --color-amber: #CA6924;      /* 琥珀 */
            --color-ink: #232021;        /* 文字主色 */
            --color-cyan: #425066;       /* 黛蓝 */

            /* 间距变量 (移动端友好) */
            --content-gap: clamp(20px, 5vw, 40px);
            --nav-gap: clamp(20px, 6vw, 48px);
            --social-gap: clamp(18px, 5vw, 32px);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body, html {
            width: 100%; height: 100%;
            overflow: hidden;
            background-color: var(--color-void);
            font-family: "STKaiti", "KaiTi", "Songti SC", "Noto Serif SC", serif;
            -webkit-font-smoothing: antialiased;
        }

        /* 画布容器 */
        #canvas-container {
            position: relative; width: 100%; height: 100%;
        }

        canvas {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
        }

        #bg-canvas { z-index: 1; }                /* 背景层 */
        #particle-canvas { z-index: 2; }           /* 粒子动画层 */
        #texture-canvas {                         /* 宣纸纹理层 */
            z-index: 3;
            pointer-events: none;
            mix-blend-mode: multiply;
            opacity: 0.22;
        }
        #ink-overlay {                            /* 交互墨韵层 */
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none; z-index: 4;
        }

        /* ===== UI 层（最高层级）===== */
        #ui-layer {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 100;                         /* 确保在所有canvas上方 */
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .logo-wrapper {
            pointer-events: none;
            margin-bottom: var(--content-gap);
            width: 100%;
            display: flex;
            justify-content: center;
        }

        #logo-canvas {
            width: min(400px, 80vw);
            height: auto;
            aspect-ratio: 360 / 140;
            opacity: 0;
            transition: opacity 1.2s ease;
            filter: drop-shadow(4px 4px 12px rgba(0,0,0,0.1));
            pointer-events: none;
            display: block;
        }

        /* 导航矩阵 */
        .matrix-nav {
            display: flex;
            flex-wrap: wrap;
            gap: var(--nav-gap);
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            margin-bottom: var(--content-gap);
        }

        .nav-item {
            color: var(--color-ink);
            text-decoration: none;
            font-size: clamp(18px, 5vw, 26px);
            letter-spacing: clamp(4px, 2vw, 8px);
            padding: 8px 0;
            pointer-events: auto;
            opacity: 0.85;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            text-shadow: 1px 1px 3px rgba(255,255,240,0.8);
            white-space: nowrap;
        }

        /* 界画分隔 */
        .nav-item:not(:last-child)::after {
            content: '·';
            position: absolute;
            right: calc(-1 * var(--nav-gap) / 2);
            top: 50%;
            transform: translate(50%, -50%);
            color: var(--color-amber);
            font-size: 20px;
            opacity: 0.5;
        }

        .nav-item:hover {
            color: var(--color-yang);
            opacity: 1;
            transform: translateY(-3px);
            text-shadow: 0 2px 8px rgba(255,70,31,0.2);
        }

        /* 社交媒体图标行 */
        .social-row {
            display: flex;
            gap: var(--social-gap);
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            margin-bottom: calc(var(--content-gap) * 0.8);
        }

        .social-icon {
            color: var(--color-amber);
            font-size: clamp(24px, 7vw, 32px);
            pointer-events: auto;
            cursor: pointer;
            transition: all 0.3s;
            opacity: 0.75;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            text-decoration: none;
        }

        .social-icon:hover {
            color: var(--color-yang);
            opacity: 1;
            transform: scale(1.1) translateY(-3px);
            filter: drop-shadow(0 0 12px var(--color-yang));
        }

        /* 页脚 */
        .footer {
            color: var(--color-ink);
            font-size: clamp(10px, 3vw, 13px);
            letter-spacing: 4px;
            opacity: 0;
            text-align: center;
            pointer-events: none;
            transition: opacity 1.5s;
            text-shadow: 1px 1px 3px rgba(255,255,240,0.6);
        }

        /* 音频提示 */
        #audio-prompt {
            position: absolute;
            bottom: 20px;
            left: 20px;
            color: var(--color-amber);
            font-size: 12px;
            opacity: 0.5;
            z-index: 101;
            pointer-events: none;
            transition: opacity 0.5s;
        }

        /* 移动端微调 */
        @media (max-width: 600px) {
            .nav-item { white-space: nowrap; }
            .nav-item:not(:last-child)::after { font-size: 16px; }
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
    <div class="logo-wrapper">
        <canvas id="logo-canvas" width="360" height="140"></canvas>
    </div>

    <div class="matrix-nav">
        <a href="#blog" class="nav-item" id="nav-blog">博客入口</a>
        <a href="#classics" class="nav-item" id="nav-classics">经典解析</a>
        <a href="#socials" class="nav-item" id="nav-socials">社交媒体</a>
    </div>

    <div class="social-row">
        <a href="#" class="social-icon" id="social-wechat" title="微信公众号" target="_blank"><i class="fab fa-weixin"></i></a>
        <a href="#" class="social-icon" id="social-bilibili" title="Bilibili" target="_blank"><i class="fab fa-bilibili"></i></a>
        <a href="#" class="social-icon" id="social-email" title="电子邮箱" target="_blank"><i class="fas fa-envelope"></i></a>
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
        MAX_PARTICLES: 4000,                  // 移动端性能优化，降低上限
        PARTICLE_SPEED_BASE: { yang: 18, yin: 10, gold: 6 },
        PARTICLE_DECAY: { min: 0.004, max: 0.012 },
        TEXT_SAMPLE_STEP: 2,                  // 文字路径采样密度
        
        // 轨迹参数
        MAX_TRAIL_LENGTH: 45,
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
        FONT_BASE_SIZE: 86,                   // 基础字体大小，会根据画布缩放
        
        // 页脚文字
        FOOTER_TEXT: '© 卜仙堂 · 道隐无名',
        
        // 外部链接配置 (用户自定义)
        LINKS: {
            blog: '#',           // 博客入口链接
            classics: '#',       // 经典解析链接
            socials: '#',        // 社交媒体链接
            wechat: '#',         // 微信公众号
            bilibili: 'https://space.bilibili.com/429714179',  // 示例B站
            email: 'mailto:example@buxiantang.com'
        }
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

    // 中国色
    const COLORS = {
        void: '#0a0a0f',
        paper: '#EEDEB0',
        yang: '#FF461F',
        yin: '#232021',
        gold: '#EACD76',
        amber: '#CA6924',
        ink: '#232021',
        cyan: '#425066',
    };

    // 物理状态
    const sim = {
        phase: 0,
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

    // ---------- 设置外部链接 ----------
    function applyLinks() {
        document.getElementById('nav-blog').href = CONFIG.LINKS.blog;
        document.getElementById('nav-classics').href = CONFIG.LINKS.classics;
        document.getElementById('nav-socials').href = CONFIG.LINKS.socials;
        document.getElementById('social-wechat').href = CONFIG.LINKS.wechat;
        document.getElementById('social-bilibili').href = CONFIG.LINKS.bilibili;
        document.getElementById('social-email').href = CONFIG.LINKS.email;
    }
    applyLinks();

    // ---------- 宣纸纹理生成 ----------
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
            const v = Math.floor(value * 30);
            data[i] = data[i+1] = data[i+2] = v;
            data[i+3] = 255;
        }
        texCtx.putImageData(imageData, 0, 0);
    }

    // ---------- 响应式 Logo 绘制 ----------
    function resizeLogoCanvas() {
        // 根据显示尺寸设置canvas分辨率，保持清晰
        const container = logoCanvas.parentElement;
        const displayWidth = logoCanvas.clientWidth;
        const displayHeight = logoCanvas.clientHeight;
        if (displayWidth === 0 || displayHeight === 0) return;
        
        // 设置canvas绘图尺寸为显示尺寸的2倍 (高清屏适配)
        const dpr = window.devicePixelRatio || 1;
        logoCanvas.width = displayWidth * dpr;
        logoCanvas.height = displayHeight * dpr;
        
        // 重新绘制文字 (如果已固化)
        if (sim.textSolidified) {
            drawLogoText();
        }
    }

    function drawLogoText() {
        const w = logoCanvas.width, h = logoCanvas.height;
        logoCtx.clearRect(0, 0, w, h);
        
        // 动态字体大小：基于画布高度计算
        const fontSize = h * 0.62; 
        logoCtx.font = "bold " + fontSize + "px 'STKaiti', 'KaiTi', 'Noto Serif SC', serif";
        logoCtx.textAlign = "center";
        logoCtx.textBaseline = "middle";
        
        const grad = logoCtx.createLinearGradient(w*0.15, 0, w*0.85, h);
        grad.addColorStop(0, COLORS.gold);
        grad.addColorStop(0.6, COLORS.amber);
        logoCtx.fillStyle = grad;
        logoCtx.shadowBlur = h * 0.12;
        logoCtx.shadowColor = COLORS.amber;
        logoCtx.fillText(CONFIG.MAIN_TEXT, w/2, h/2);
        logoCtx.shadowBlur = 0;
    }

    // ---------- 计算文字路径点阵 (适配移动端)----------
    function computeTextPoints() {
        // 创建一个离屏canvas，尺寸与logoCanvas显示比例一致
        const baseW = 360, baseH = 140;
        const offCanvas = new OffscreenCanvas(baseW, baseH);
        const offCtx = offCanvas.getContext('2d');
        offCtx.clearRect(0, 0, baseW, baseH);
        offCtx.font = "bold " + CONFIG.FONT_BASE_SIZE + "px 'STKaiti', 'KaiTi', 'Noto Serif SC', serif";
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillStyle = "#ffffff";
        offCtx.fillText(CONFIG.MAIN_TEXT, baseW/2, baseH/2);
        
        const imgData = offCtx.getImageData(0, 0, baseW, baseH);
        const data = imgData.data;
        const points = [];
        const step = CONFIG.TEXT_SAMPLE_STEP;
        for (let y = 0; y < baseH; y += step) {
            for (let x = 0; x < baseW; x += step) {
                const idx = (y * baseW + x) * 4;
                if (data[idx] > 128) {
                    const nx = (x / baseW) * 2 - 1;
                    const ny = (y / baseH) * 2 - 1;
                    // 映射到当前画布中心区域
                    const px = cx + nx * Math.min(w, h) * 0.38;
                    const py = cy + ny * Math.min(w, h) * 0.16;
                    points.push({ x: px, y: py });
                }
            }
        }
        textTargetPoints = points;
    }

    // ---------- 粒子类 (省略注释以节省篇幅，与之前相同) ----------
    class Particle {
        constructor(x, y, type) {
            this.x = x; this.y = y;
            this.type = type;
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
            else if (this.type === 1) color = COLORS.cyan;
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

    // 轨迹与绘制函数 (保持不变，略作调整)
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
        pCtx.shadowBlur = blur * 0.6;
        pCtx.lineWidth = 1.2;
        pCtx.strokeStyle = glowColor;
        pCtx.stroke();
        pCtx.shadowBlur = 0;
    }

    const inkDrops = [];
    function drawInkEffects() {
        inkCtx.clearRect(0, 0, w, h);
        for (let i=inkDrops.length-1; i>=0; i--) {
            const d = inkDrops[i];
            d.radius += 1.8;
            d.life -= 0.015;
            if (d.life <= 0) { inkDrops.splice(i,1); continue; }
            const gradient = inkCtx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
            gradient.addColorStop(0, 'rgba(35,32,33,'+ d.life*0.2 +')');
            gradient.addColorStop(1, 'rgba(35,32,33,0)');
            inkCtx.fillStyle = gradient;
            inkCtx.beginPath();
            inkCtx.arc(d.x, d.y, d.radius, 0, 2*Math.PI);
            inkCtx.fill();
        }
    }

    // 渲染循环
    function render() {
        bgCtx.fillStyle = sim.bgColor;
        bgCtx.fillRect(0, 0, w, h);
        
        pCtx.globalCompositeOperation = 'source-over';
        pCtx.fillStyle = sim.bgColor;
        pCtx.globalAlpha = sim.phase >= 3 ? 0.03 : 0.18;
        pCtx.fillRect(0, 0, w, h);
        pCtx.globalAlpha = 1.0;
        
        sim.time += 0.018;

        if (sim.phase === 1) {
            updateTrails();
            drawTrail(trails.yang, COLORS.yang, '#FF8A6F', 18);
            drawTrail(trails.yin, COLORS.cyan, '#6A7A8C', 14);
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
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(pCtx);
                if (p.life <= 0.01) particles.splice(i, 1);
            }
        }

        drawInkEffects();
        requestAnimationFrame(render);
    }

    // GSAP 时间线
    function startAnimation() {
        const tl = gsap.timeline({ delay: 0.5 });
        tl.set(sim, { phase: 1, bgColor: COLORS.void });
        tl.to(sim, { 
            orbitRadius: 0, duration: 5.2, ease: "power3.in",
            onUpdate: () => {
                if (sim.orbitRadius < 25) {
                    const s = 2.5 * (1 - sim.orbitRadius/25);
                    particleCanvas.style.transform = 'translate(' + (Math.random()*s-s/2) + 'px, ' + (Math.random()*s-s/2) + 'px)';
                } else particleCanvas.style.transform = '';
            },
            onComplete: () => particleCanvas.style.transform = ''
        });
        
        tl.add(() => { sim.phase = 2; trails.yang = []; trails.yin = []; sim.coreSize = 4; });
        tl.to(sim, { coreSize: 48, duration: 0.25, ease: "expo.out" });
        tl.add(() => {
            for (let i=0; i<1200; i++) particles.push(new Particle(cx, cy, i % 3));
            document.body.style.backgroundColor = '#FFF9F0';
            setTimeout(() => document.body.style.backgroundColor = '', 60);
        });
        tl.to(sim, { coreSize: 0, duration: 0.55, ease: "power2.in" });
        tl.to(sim, { bgColor: COLORS.paper, duration: 1.8 }, "-=0.3");
        
        tl.add(() => { sim.phase = 3; }, "-=0.6");
        tl.add(() => {
            for (let i=0; i<1000; i++) particles.push(new Particle(cx, cy, 2));
        }, "+=0.3");
        
        tl.add(() => {
            sim.textSolidified = true;
            drawLogoText();
            logoCanvas.style.transition = 'filter 0.8s';
            logoCanvas.style.filter = 'drop-shadow(0 0 30px #EACD76)';
            setTimeout(() => logoCanvas.style.filter = 'drop-shadow(4px 4px 12px rgba(0,0,0,0.1))', 400);
        }, "+=2.0");
        
        tl.to(logoCanvas, { opacity: 1, duration: 1.5, ease: "power2.out" }, "-=0.3");
        tl.fromTo(".matrix-nav", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, "-=1.0");
        tl.fromTo(".social-row", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2 }, "-=0.8");
        tl.to(".footer", { opacity: 0.7, duration: 1.8 }, "-=1.2");
    }

    // 交互事件
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
        const rect = particleCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (let i=0; i<4; i++) inkDrops.push({ x, y, radius: 4, life: 1.0 });
    }

    // 初始化与自适应
    function resize() {
        w = bgCanvas.width = particleCanvas.width = textureCanvas.width = inkCanvas.width = window.innerWidth;
        h = bgCanvas.height = particleCanvas.height = textureCanvas.height = inkCanvas.height = window.innerHeight;
        cx = w / 2; cy = h / 2;
        generateTexture();
        computeTextPoints();
        resizeLogoCanvas();
    }
    
    window.addEventListener('resize', () => {
        resize();
        if (sim.textSolidified) drawLogoText();
    });
    window.addEventListener('orientationchange', () => setTimeout(resize, 30));
    
    resize();
    
    document.fonts.ready.then(() => {
        computeTextPoints();
        startAnimation();
        render();
    });
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onDocumentClick);
    
    // 阻止导航默认行为（实际链接已配置，保留正常跳转）
    // 仅对没有配置有效链接的做预防
    document.querySelectorAll('.nav-item, .social-icon').forEach(el => {
        el.addEventListener('click', (e) => {
            const href = el.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                console.log('链接未配置:', el.innerText);
            }
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
