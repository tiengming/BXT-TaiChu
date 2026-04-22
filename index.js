export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>卜仙堂 · 道生万象</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        :root {
            --color-void: #0a0a0f;
            --color-paper: #f4f4ec;
            --color-yang: #ff461f;
            --color-yin: #101419;
            --color-gold: #eacd76;
            --color-ink: #2b2b2b;
        }
        body, html {
            margin: 0; padding: 0; width: 100%; height: 100%;
            overflow: hidden;
            background: var(--color-void);
            font-family: "STKaiti", "KaiTi", "Songti SC", serif;
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
            opacity: 0.18;
        }
        #ui-layer {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10; text-align: center;
            pointer-events: none;
            width: 100%;
        }
        .logo-wrapper {
            position: relative; display: inline-block;
            pointer-events: none;
        }
        #logo-canvas {
            width: 360px; height: 140px;
            opacity: 0;
            transition: opacity 0.5s;
            filter: drop-shadow(0 4px 12px rgba(234, 205, 118, 0.3));
            pointer-events: none;
        }
        .matrix-nav {
            margin-top: 50px; display: flex; gap: 40px;
            justify-content: center; opacity: 0;
            pointer-events: none;
        }
        .nav-item {
            color: var(--color-ink);
            text-decoration: none; font-size: 16px;
            letter-spacing: 4px; position: relative;
            padding-bottom: 8px; pointer-events: auto;
            opacity: 0.8; cursor: pointer;
            transition: color 0.4s ease, transform 0.4s ease;
        }
        .nav-item:hover { 
            color: var(--color-yang); opacity: 1; 
            transform: translateY(-2px); 
        }
        #ink-overlay {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none; z-index: 15;
        }
        #audio-prompt {
            position: absolute; bottom: 20px; left: 20px;
            color: rgba(0,0,0,0.2); font-size: 12px;
            z-index: 20; pointer-events: none;
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
</div>
<div id="audio-prompt">⚲ 点击页面任意位置 · 以闻道音</div>

<script>
(function(){
    "use strict";

    // ---------- 全局变量与 Canvas 引用 ----------
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

    // ---------- 尺寸自适应 ----------
    function resize() {
        w = bgCanvas.width = particleCanvas.width = textureCanvas.width = inkCanvas.width = window.innerWidth;
        h = bgCanvas.height = particleCanvas.height = textureCanvas.height = inkCanvas.height = window.innerHeight;
        cx = w / 2; cy = h / 2;
        generateTexture();
        computeTextPoints();
    }
    window.addEventListener('resize', resize);

    // ---------- 宣纸纹理生成 ----------
    function generateTexture() {
        const tw = textureCanvas.width, th = textureCanvas.height;
        const imageData = texCtx.createImageData(tw, th);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % tw;
            const y = Math.floor(i / 4 / tw);
            const value = (Math.sin(x * 0.02) * Math.cos(y * 0.02) + 
                          Math.sin(x * 0.05 + 1) * Math.cos(y * 0.05) * 0.5 + 
                          Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.2) * 0.5 + 0.5;
            const v = Math.floor(value * 40);
            data[i] = data[i+1] = data[i+2] = v;
            data[i+3] = 255;
        }
        texCtx.putImageData(imageData, 0, 0);
    }

    // ---------- 文字路径点阵 ----------
    let textTargetPoints = [];
    function computeTextPoints() {
        const offCanvas = new OffscreenCanvas(360, 140);
        const offCtx = offCanvas.getContext('2d');
        offCtx.clearRect(0, 0, 360, 140);
        offCtx.font = "bold 84px 'STKaiti', 'KaiTi', serif";
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillStyle = "#ffffff";
        offCtx.fillText("卜仙堂", 180, 70);
        
        const imgData = offCtx.getImageData(0, 0, 360, 140);
        const data = imgData.data;
        const points = [];
        const step = 2;
        for (let y = 0; y < 140; y += step) {
            for (let x = 0; x < 360; x += step) {
                const idx = (y * 360 + x) * 4;
                if (data[idx] > 128) {
                    const nx = (x / 360) * 2 - 1;
                    const ny = (y / 140) * 2 - 1;
                    const px = cx + nx * Math.min(w, h) * 0.35;
                    const py = cy + ny * Math.min(w, h) * 0.15;
                    points.push({ x: px, y: py });
                }
            }
        }
        textTargetPoints = points;
    }

    // ---------- 物理状态 ----------
    const sim = {
        phase: 0,
        time: 0,
        orbitRadius: 0,
        coreSize: 0,
        bgColor: '#0a0a0f',
        lx: 0.1, ly: 0, lz: 0,
    };

    const particles = [];
    const MAX_PARTICLES = 4000;
    const trails = { yang: [], yin: [] };
    const MAX_TRAIL = 50;
    const COLORS = {
        yang: '#ff461f',
        yin: '#101419',
        gold: '#eacd76',
        paper: '#f4f4ec',
        void: '#0a0a0f'
    };

    class Particle {
        constructor(x, y, type) {
            this.x = x; this.y = y;
            this.type = type;
            const angle = Math.random() * Math.PI * 2;
            const speed = type === 0 ? 15 : (type === 1 ? 8 : 5);
            this.vx = Math.cos(angle) * speed * (0.8 + Math.random()*0.6);
            this.vy = Math.sin(angle) * speed * (0.8 + Math.random()*0.6);
            this.size = type === 2 ? 1.5 : (2 + Math.random()*2);
            this.life = 1.0;
            this.decay = 0.005 + Math.random()*0.01;
            if (type === 2) {
                this.target = null;
                this.settled = false;
            }
        }
        update() {
            if (this.type === 2 && !this.settled) {
                if (textTargetPoints.length > 0 && !this.target) {
                    let minDist = Infinity;
                    let nearest = null;
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
                    if (dist < 3) {
                        this.settled = true;
                        this.vx = this.vy = 0;
                    } else {
                        const force = 0.02;
                        this.vx += dx * force;
                        this.vy += dy * force;
                    }
                }
            }
            this.vx *= 0.96;
            this.vy *= 0.96;
            this.x += this.vx;
            this.y += this.vy;
            if (this.type !== 2 || !this.settled) {
                this.life -= this.decay;
            } else {
                this.life = 1.0;
            }
        }
        draw(ctx) {
            if (this.life <= 0) return;
            ctx.globalAlpha = this.life * (this.type === 1 ? 0.7 : 1.0);
            let color;
            if (this.type === 0) color = COLORS.yang;
            else if (this.type === 1) color = COLORS.yin;
            else color = COLORS.gold;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * (0.7 + 0.3*Math.sin(sim.time*5 + this.x)), 0, 2*Math.PI);
            ctx.fill();
            if (this.type === 2) {
                ctx.shadowBlur = 12;
                ctx.shadowColor = COLORS.gold;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    function updateTrails() {
        const sigma = 10, rho = 28, beta = 8/3;
        const dt = 0.01;
        const dx = sigma * (sim.ly - sim.lx) * dt;
        const dy = (sim.lx * (rho - sim.lz) - sim.ly) * dt;
        const dz = (sim.lx * sim.ly - beta * sim.lz) * dt;
        sim.lx += dx; sim.ly += dy; sim.lz += dz;
        const scale = Math.min(w, h) * 0.015;
        const offsetX = cx, offsetY = cy;
        const yangX = offsetX + sim.lx * scale;
        const yangY = offsetY + sim.ly * scale;
        const yinX = offsetX - sim.ly * scale * 0.8;
        const yinY = offsetY - sim.lx * scale * 0.8;
        trails.yang.push({x: yangX, y: yangY});
        trails.yin.push({x: yinX, y: yinY});
        if (trails.yang.length > MAX_TRAIL) trails.yang.shift();
        if (trails.yin.length > MAX_TRAIL) trails.yin.shift();
        sim.orbitRadius = Math.hypot(sim.lx, sim.ly) * scale;
    }

    function drawTrail(trail, color, blur) {
        if (trail.length < 2) return;
        pCtx.beginPath();
        pCtx.moveTo(trail[0].x, trail[0].y);
        for (let i=1; i<trail.length; i++) {
            const xc = (trail[i].x + trail[i-1].x)/2;
            const yc = (trail[i].y + trail[i-1].y)/2;
            pCtx.quadraticCurveTo(trail[i-1].x, trail[i-1].y, xc, yc);
        }
        pCtx.strokeStyle = color;
        pCtx.lineWidth = 2.5;
        pCtx.shadowBlur = blur;
        pCtx.shadowColor = color;
        pCtx.stroke();
        pCtx.shadowBlur = 0;
    }

    const inkDrops = [];
    function drawInkEffects() {
        inkCtx.clearRect(0, 0, w, h);
        for (let i=inkDrops.length-1; i>=0; i--) {
            const d = inkDrops[i];
            d.radius += 2;
            d.life -= 0.02;
            if (d.life <= 0) { inkDrops.splice(i,1); continue; }
            const gradient = inkCtx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
            gradient.addColorStop(0, 'rgba(16,20,25,'+ d.life*0.3 +')');
            gradient.addColorStop(1, 'rgba(16,20,25,0)');
            inkCtx.fillStyle = gradient;
            inkCtx.beginPath();
            inkCtx.arc(d.x, d.y, d.radius, 0, 2*Math.PI);
            inkCtx.fill();
        }
    }

    function render() {
        bgCtx.fillStyle = sim.bgColor;
        bgCtx.fillRect(0, 0, w, h);
        
        pCtx.globalCompositeOperation = 'source-over';
        pCtx.fillStyle = sim.bgColor;
        pCtx.globalAlpha = sim.phase === 3 ? 0.05 : 0.2;
        pCtx.fillRect(0, 0, w, h);
        pCtx.globalAlpha = 1.0;
        
        sim.time += 0.02;
        
        if (sim.phase === 0) {
            // 混沌期静默
        } else if (sim.phase === 1) {
            updateTrails();
            drawTrail(trails.yang, COLORS.yang, 12);
            drawTrail(trails.yin, COLORS.yin, 6);
            if (trails.yang.length > 0) {
                const yp = trails.yang[trails.yang.length-1];
                pCtx.beginPath();
                pCtx.arc(yp.x, yp.y, 8, 0, 2*Math.PI);
                pCtx.fillStyle = COLORS.yang;
                pCtx.shadowBlur = 20; pCtx.shadowColor = COLORS.yang;
                pCtx.fill();
            }
            if (trails.yin.length > 0) {
                const ip = trails.yin[trails.yin.length-1];
                pCtx.beginPath();
                pCtx.arc(ip.x, ip.y, 6, 0, 2*Math.PI);
                pCtx.fillStyle = COLORS.yin;
                pCtx.shadowBlur = 15; pCtx.shadowColor = COLORS.yin;
                pCtx.fill();
            }
            pCtx.shadowBlur = 0;
        } else if (sim.phase >= 2) {
            if (sim.coreSize > 0) {
                const gradient = pCtx.createRadialGradient(cx, cy, 0, cx, cy, sim.coreSize);
                gradient.addColorStop(0, COLORS.gold);
                gradient.addColorStop(0.7, COLORS.yang);
                pCtx.fillStyle = gradient;
                pCtx.shadowBlur = 50; pCtx.shadowColor = COLORS.gold;
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

    function startAnimation() {
        const tl = gsap.timeline({ delay: 0.3 });
        tl.set(sim, { phase: 1, bgColor: COLORS.void });
        tl.to(sim, { 
            orbitRadius: 0,
            duration: 5,
            ease: "power3.in",
            onUpdate: function() {
                if (sim.orbitRadius < 30) {
                    const shake = 2 * (1 - sim.orbitRadius/30);
                    // 使用字符串拼接避免模板字符串转义
                    particleCanvas.style.transform = 'translate(' + (Math.random()*shake-shake/2) + 'px, ' + (Math.random()*shake-shake/2) + 'px)';
                } else {
                    particleCanvas.style.transform = '';
                }
            },
            onComplete: () => particleCanvas.style.transform = ''
        });
        tl.add(() => { 
            sim.phase = 2; 
            trails.yang = []; trails.yin = [];
            sim.coreSize = 5;
        });
        tl.to(sim, { coreSize: 45, duration: 0.2, ease: "expo.out" });
        tl.add(() => {
            for (let i=0; i<1200; i++) {
                let type = i % 3;
                particles.push(new Particle(cx, cy, type));
            }
            document.body.style.backgroundColor = '#ffffff';
            setTimeout(() => document.body.style.backgroundColor = '', 50);
        });
        tl.to(sim, { coreSize: 0, duration: 0.5, ease: "power2.in" });
        tl.to(sim, { bgColor: COLORS.paper, duration: 1.5 }, "-=0.3");
        tl.add(() => { sim.phase = 3; }, "-=0.5");
        tl.add(() => {
            for (let i=0; i<800; i++) {
                particles.push(new Particle(cx, cy, 2));
            }
        }, "+=0.2");
        tl.to(logoCanvas, { opacity: 1, duration: 2.0 }, "-=1.0");
        tl.to(".matrix-nav", { opacity: 1, y: -15, duration: 1.8, stagger: 0.2 }, "-=1.5");
    }

    function onMouseMove(e) {
        if (sim.phase < 3) return;
        const rect = particleCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const navs = document.querySelectorAll('.nav-item');
        let near = false;
        navs.forEach(n => {
            const b = n.getBoundingClientRect();
            if (e.clientX >= b.left-20 && e.clientX <= b.right+20 && e.clientY >= b.top-20 && e.clientY <= b.bottom+20) near = true;
        });
        if (near && Math.random() < 0.3) {
            inkDrops.push({ x, y, radius: 2, life: 1.0 });
        }
    }

    let audioCtx = null;
    function initAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 35;
        const gain = audioCtx.createGain();
        gain.gain.value = 0.0001;
        osc.connect(gain).connect(audioCtx.destination);
        osc.start();
        document.getElementById('audio-prompt').style.opacity = '0';
    }

    resize();
    document.fonts.ready.then(() => {
        computeTextPoints();
        startAnimation();
        render();
    });
    
    window.addEventListener('resize', () => {
        computeTextPoints();
        generateTexture();
    });
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('mousemove', onMouseMove);
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const rect = particleCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            for (let i=0; i<3; i++) {
                inkDrops.push({ x, y, radius: 5, life: 1.0 });
            }
            console.log('导航至:', item.getAttribute('href'));
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
