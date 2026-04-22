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
        /* ===== 中国色变量 (参考 zhongguose.com) ===== */
        :root {
            --color-void: #0a0a0f;      /* 极渊黑 */
            --color-paper: #F1F1F1;      /* 缟羽 */
            --color-yang: #FF461F;       /* 朱砂 */
            --color-yin: #232021;        /* 玄青 */
            --color-gold: #EACD76;       /* 金 */
            --color-amber: #CA6924;      /* 琥珀 */
            --color-ink: #50616D;        /* 墨色 */
            --color-cyan: #425066;       /* 黛蓝 */
            --color-ivory: #EEDEB0;      /* 牙色 */
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

        /* ===== UI 层 ===== */
        #ui-layer {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 20;
            text-align: center;
            pointer-events: none;
            width: 100%;
            padding: 0 20px;
        }

        .logo-wrapper {
            display: inline-block;
            pointer-events: none;
            position: relative;
        }

        #logo-canvas {
            width: min(360px, 70vw);
            height: auto;
            aspect-ratio: 360/140;
            opacity: 0;
            transition: opacity 1.2s ease;
            filter: drop-shadow(0 4px 12px rgba(234, 205, 118, 0.4));
            pointer-events: none;
        }

        /* 导航矩阵 */
        .matrix-nav {
            margin-top: 40px;
            display: flex;
            gap: 36px;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            flex-wrap: wrap;
        }

        .nav-item {
            color: var(--color-ink);
            text-decoration: none;
            font-size: clamp(14px, 4vw, 18px);
            letter-spacing: 6px;
            padding-bottom: 8px;
            pointer-events: auto;
            opacity: 0.75;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }

        .nav-item:hover {
            color: var(--color-yang);
            opacity: 1;
            transform: translateY(-3px);
        }

        /* 社交媒体图标行 */
        .social-row {
            margin-top: 48px;
            display: flex;
            gap: 32px;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
        }

        .social-icon {
            color: var(--color-amber);
            font-size: 28px;
            pointer-events: auto;
            cursor: pointer;
            transition: all 0.3s ease;
            filter: drop-shadow(0 0 4px rgba(202, 105, 36, 0.3));
        }

        .social-icon:hover {
            color: var(--color-yang);
            transform: scale(1.15) translateY(-2px);
            filter: drop-shadow(0 0 12px var(--color-yang));
        }

        /* 页脚 */
        .footer {
            position: absolute;
            bottom: 18px;
            left: 0;
            width: 100%;
            text-align: center;
            color: var(--color-ink);
            font-size: 12px;
            letter-spacing: 4px;
            opacity: 0;
            z-index: 20;
            pointer-events: none;
            transition: opacity 1.5s;
        }

        .footer span {
            opacity: 0.6;
        }

        /* 音频提示 */
        #audio-prompt {
            position: absolute;
            bottom: 20px;
            right: 24px;
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
    <div class="logo-wrapper">
        <canvas id="logo-canvas" width="360" height="140"></canvas>
    </div>

    <div class="matrix-nav">
        <a href="#blog" class="nav-item" data-text="博客入口">博客入口</a>
        <a href="#classics" class="nav-item" data-text="经典解析">经典解析</a>
        <a href="#socials" class="nav-item" data-text="社交媒体">社交媒体</a>
    </div>

    <div class="social-row">
        <a href="#" class="social-icon" title="微信公众号"><i class="fab fa-weixin"></i></a>
        <a href="#" class="social-icon" title="Bilibili"><i class="fab fa-bilibili"></i></a>
        <a href="#" class="social-icon" title="电子邮箱"><i class="fas fa-envelope"></i></a>
    </div>
</div>

<div class="footer">
    <span>© 卜仙堂 · 大象无形 · 道隐无名</span>
</div>

<div id="audio-prompt">⚲ 轻触闻道</div>

<script>
(function(){
    "use strict";

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

    // ---------- 中国色 ----------
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
        textSolidified: false   // 文字是否已固化
    };

    const particles = [];
    const MAX_PARTICLES = 5000;
    const trails = { yang: [], yin: [] };
    const MAX_TRAIL = 55;

    // 文字目标点阵
    let textTargetPoints = [];

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
            const v = Math.floor(value * 35);
            data[i] = data[i+1] = data[i+2] = v;
            data[i+3] = 255;
        }
        texCtx.putImageData(imageData, 0, 0);
    }

    // ---------- 计算“卜仙堂”路径点阵 ----------
    function computeTextPoints() {
        const offCanvas = new OffscreenCanvas(360, 140);
        const offCtx = offCanvas.getContext('2d');
        offCtx.clearRect(0, 0, 360, 140);
        offCtx.font = "bold 86px 'STKaiti', 'KaiTi', 'Noto Serif SC', serif";
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillStyle = "#ffffff";
        offCtx.fillText("卜仙堂", 180, 70);
        
        const imgData = offCtx.getImageData(0, 0, 360, 140);
        const data = imgData.data;
        const points = [];
        const step = 2; // 密度
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
            const speed = type === 0 ? 18 : (type === 1 ? 10 : 6);
            this.vx = Math.cos(angle) * speed * (0.7 + Math.random()*0.6);
            this.vy = Math.sin(angle) * speed * (0.7 + Math.random()*0.6);
            this.size = type === 2 ? 1.8 : (2.2 + Math.random()*2.5);
            this.life = 1.0;
            this.decay = 0.004 + Math.random()*0.008;
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
                this.life = 0.95; // 保持可见
            }
        }
        draw(ctx) {
            if (this.life <= 0.01) return;
            ctx.globalAlpha = this.life * (this.type === 1 ? 0.8 : 1.0);
            let color;
            if (this.type === 0) color = COLORS.yang;
            else if (this.type === 1) color = COLORS.cyan; // 用黛蓝提亮阴线
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
        const sigma = 10, rho = 28, beta = 8/3;
        const dt = 0.012;
        const dx = sigma * (sim.ly - sim.lx) * dt;
        const dy = (sim.lx * (rho - sim.lz) - sim.ly) * dt;
        const dz = (sim.lx * sim.ly - beta * sim.lz) * dt;
        sim.lx += dx; sim.ly += dy; sim.lz += dz;
        const scale = Math.min(w, h) * 0.016;
        const yangX = cx + sim.lx * scale;
        const yangY = cy + sim.ly * scale;
        const yinX = cx - sim.ly * scale * 0.75;
        const yinY = cy - sim.lx * scale * 0.75;
        trails.yang.push({x: yangX, y: yangY});
        trails.yin.push({x: yinX, y: yinY});
        if (trails.yang.length > MAX_TRAIL) trails.yang.shift();
        if (trails.yin.length > MAX_TRAIL) trails.yin.shift();
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

        // 若文字已固化，绘制实体书法字 (叠加在粒子上方)
        if (sim.textSolidified) {
            logoCtx.clearRect(0, 0, 360, 140);
            logoCtx.font = "bold 86px 'STKaiti', 'KaiTi', 'Noto Serif SC', serif";
            logoCtx.textAlign = "center";
            logoCtx.textBaseline = "middle";
            // 金色渐变
            const grad = logoCtx.createLinearGradient(60, 0, 300, 140);
            grad.addColorStop(0, COLORS.gold);
            grad.addColorStop(0.6, COLORS.amber);
            logoCtx.fillStyle = grad;
            logoCtx.shadowBlur = 20;
            logoCtx.shadowColor = COLORS.amber;
            logoCtx.fillText("卜仙堂", 180, 70);
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
            // 凝固瞬间闪光
            logoCanvas.style.transition = 'filter 0.8s';
            logoCanvas.style.filter = 'drop-shadow(0 0 30px #EACD76)';
            setTimeout(() => logoCanvas.style.filter = 'drop-shadow(0 4px 12px rgba(234,205,118,0.4))', 400);
        }, "+=2.0");
        
        // UI 显现
        tl.to(logoCanvas, { opacity: 1, duration: 1.8 }, "-=0.5");
        tl.to(".matrix-nav", { opacity: 1, y: -12, duration: 1.5, stagger: 0.15 }, "-=1.2");
        tl.to(".social-row", { opacity: 1, y: -8, duration: 1.5 }, "-=1.0");
        tl.to(".footer", { opacity: 1, duration: 2.0 }, "-=1.8");
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
        if (near && Math.random() < 0.25) {
            inkDrops.push({ x, y, radius: 2, life: 0.9 });
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
                osc.frequency.value = 42;
                const gain = actx.createGain();
                gain.gain.value = 0.02;
                osc.connect(gain).connect(actx.destination);
                osc.start();
                osc.stop(actx.currentTime + 2.5);
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
