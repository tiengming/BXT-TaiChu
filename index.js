export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>卜仙堂 · 道生万象</title>
    <link rel="icon" type="image/svg+xml" href="https://svg.buxiantang.top/images/originFavicon.svg">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --color-void: #0a0a0f;
            --color-paper: #F3F0E6;
            --color-yang: #FF461F;
            --color-yin: #344352;
            --color-gold: #EACD76;
            --color-amber: #CA6924;
            --color-ink: #4A5B6E;
            --color-footer: #5C6B7A;
            --nav-gap: clamp(24px, 5vw, 48px);
            --social-gap: clamp(20px, 5vw, 36px);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body, html {
            width: 100%; height: 100%;
            overflow: hidden;
            background-color: var(--color-void);
            font-family: "STKaiti", "KaiTi", "Songti SC", "Noto Serif SC", serif;
            -webkit-font-smoothing: antialiased;
        }

        #canvas-container { position: relative; width: 100%; height: 100%; }

        canvas {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
        }

        #bg-canvas { z-index: 1; }
        #texture-canvas {
            z-index: 2; pointer-events: none;
            mix-blend-mode: multiply; opacity: 0.15;
        }
        #particle-canvas { z-index: 3; }
        #ink-overlay { z-index: 4; pointer-events: none; }

        #ui-layer {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 100;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 55vh;
        }

        .matrix-nav {
            display: flex; flex-wrap: wrap;
            gap: var(--nav-gap);
            justify-content: center;
            opacity: 0; pointer-events: none;
            margin-bottom: 20px;
        }

        .nav-item {
            color: var(--color-ink);
            font-size: clamp(20px, 5vw, 26px);
            letter-spacing: 6px;
            padding: 8px 0;
            pointer-events: auto;
            opacity: 0.85;
            cursor: pointer;
            transition: all 0.25s ease-out;
            text-shadow: 2px 2px 4px rgba(255,255,240,0.6);
            white-space: nowrap;
            text-decoration: none;
            position: relative;
            font-weight: 500;
        }

        .nav-item:not(:last-child)::after {
            content: '·';
            position: absolute;
            right: calc(-1 * var(--nav-gap) / 2);
            top: 50%;
            transform: translate(50%, -50%);
            color: var(--color-amber);
            font-size: 22px;
            opacity: 0.5;
        }

        .nav-item:hover {
            color: var(--color-yang); opacity: 1;
            transform: translateY(-4px);
        }

        .social-row {
            display: flex; gap: var(--social-gap);
            justify-content: center;
            opacity: 0; pointer-events: none;
            margin-top: 16px;
        }

        .social-icon {
            color: var(--color-amber);
            font-size: clamp(26px, 6vw, 34px);
            pointer-events: auto;
            transition: all 0.3s;
            opacity: 0.8;
            text-decoration: none;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .social-icon:hover {
            color: var(--color-yang); opacity: 1;
            transform: scale(1.12) translateY(-3px);
        }

        .footer {
            color: var(--color-footer);
            font-size: clamp(10px, 3vw, 13px);
            letter-spacing: 4px;
            opacity: 0;
            text-align: center;
            margin-top: 24px;
            pointer-events: none;
            transition: opacity 1.5s;
        }

        #progress-bar-container {
            position: absolute; bottom: 0; left: 0;
            width: 100%; height: 2px;
            background: transparent;
            z-index: 150;
            pointer-events: none;
        }
        #progress-bar {
            width: 0%; height: 100%;
            background: var(--color-gold);
            box-shadow: 0 0 8px var(--color-gold);
            transition: width 0.05s linear;
        }

        #phase-hint {
            position: absolute; bottom: 20px; left: 20px;
            color: var(--color-amber);
            font-size: 13px;
            opacity: 0.5;
            z-index: 151;
            pointer-events: none;
            letter-spacing: 2px;
        }

        #skip-btn {
            position: absolute; bottom: 20px; right: 20px;
            color: var(--color-amber);
            font-size: 14px;
            opacity: 0.5;
            z-index: 200;
            cursor: pointer;
            pointer-events: auto;
            background: rgba(10,10,15,0.3);
            padding: 6px 14px;
            border-radius: 30px;
            backdrop-filter: blur(4px);
            border: 0.5px solid rgba(234,205,118,0.3);
            transition: all 0.2s;
            letter-spacing: 1px;
        }
        #skip-btn:hover {
            opacity: 0.9;
            background: rgba(234,205,118,0.15);
            border-color: var(--color-gold);
        }

        @media (max-width: 600px) {
            .nav-item:not(:last-child)::after { font-size: 18px; }
            #ui-layer { padding-top: 50vh; }
            #skip-btn { padding: 4px 10px; font-size: 12px; }
        }
    </style>
</head>
<body>

<div id="canvas-container">
    <canvas id="bg-canvas"></canvas>
    <canvas id="texture-canvas"></canvas>
    <canvas id="particle-canvas"></canvas>
    <canvas id="ink-overlay"></canvas>
</div>

<div id="progress-bar-container"><div id="progress-bar"></div></div>
<div id="phase-hint">⚲ 化生 · 阴阳交融</div>
<div id="skip-btn">⏭ 跳过</div>

<div id="ui-layer">
    <div class="matrix-nav">
        <a href="#" class="nav-item" id="nav-blog">博客入口</a>
        <a href="#" class="nav-item" id="nav-classics">经典解析</a>
        <a href="#" class="nav-item" id="nav-about">关于我</a>
    </div>
    <div class="social-row">
        <a href="#" class="social-icon" id="social-wechat" target="_blank"><i class="fab fa-weixin"></i></a>
        <a href="#" class="social-icon" id="social-bilibili" target="_blank"><i class="fab fa-bilibili"></i></a>
        <a href="#" class="social-icon" id="social-email" target="_blank"><i class="fas fa-envelope"></i></a>
    </div>
    <div class="footer"><span>© 卜仙堂 · 道隐无名</span></div>
</div>

<script>
(function(){
    "use strict";

    const CONFIG = {
        TAIL_COUNT: 12,
        LERP_FACTOR: 0.12,
        SWING_AMP: 4.0,
        SWING_FREQ: 0.05,
        BANG_PARTICLES: 2000,
        MAIN_TEXT: '卜仙堂',
        FONT_SIZE: 72,
        TIMING: {
            phase1: 2.5,
            phase2: 3.2,
            phase3: 0.8,
            whitePoint: 0.5,
            bang: 0.6,
            fadeOut: 1.0
        },
        LINKS: {
            blog: 'https://blog.buxiantang.top',
            classics: 'https://anal.buxiantang.top/about',
            about: 'https://blog.buxiantang.top/about',
            wechat: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwNzY4NDU3Nw==#wechat_redirect',
            bilibili: 'https://space.bilibili.com/265656567',
            email: 'mailto:tiengming@qq.com'
        }
    };

    document.getElementById('nav-blog').href = CONFIG.LINKS.blog;
    document.getElementById('nav-classics').href = CONFIG.LINKS.classics;
    document.getElementById('nav-about').href = CONFIG.LINKS.about;
    document.getElementById('social-wechat').href = CONFIG.LINKS.wechat;
    document.getElementById('social-bilibili').href = CONFIG.LINKS.bilibili;
    document.getElementById('social-email').href = CONFIG.LINKS.email;

    const bgCanvas = document.getElementById('bg-canvas');
    const particleCanvas = document.getElementById('particle-canvas');
    const textureCanvas = document.getElementById('texture-canvas');
    const inkCanvas = document.getElementById('ink-overlay');
    const bgCtx = bgCanvas.getContext('2d');
    const pCtx = particleCanvas.getContext('2d', { alpha: true });
    const texCtx = textureCanvas.getContext('2d');
    const inkCtx = inkCanvas.getContext('2d');

    let w, h, cx, cy;
    let animationTimeline;
    let phase = 0;
    let globalTime = 0;

    const COLORS = {
        void: '#0a0a0f', paper: '#F3F0E6',
        yang: '#FF461F', yin: '#344352',
        white: '#FFFFFF'
    };

    let bgColor = COLORS.void;
    let whitePointSize = 0;
    let textAlpha = 0;
    let whitePointActive = false;

    const energyGroups = {
        yang: { head: null, tails: [], color: COLORS.yang, phase: 0, startX: 0, startY: 0, targetY: 0, v0: 0, a: 0 },
        yin:  { head: null, tails: [], color: COLORS.yin,  phase: 0, startX: 0, startY: 0, targetY: 0, v0: 0, a: 0 }
    };

    const bangParticles = [];

    const phaseHint = document.getElementById('phase-hint');
    const progressBar = document.getElementById('progress-bar');
    const skipBtn = document.getElementById('skip-btn');

    function skipAnimation() {
        if (animationTimeline) {
            animationTimeline.seek(99);
            animationTimeline.kill();
        }
        phase = 4;
        textAlpha = 1;
        bgColor = COLORS.paper;
        whitePointSize = 0;
        whitePointActive = false;
        energyGroups.yang.head = null;
        energyGroups.yang.tails = [];
        energyGroups.yin.head = null;
        energyGroups.yin.tails = [];
        bangParticles.length = 0;
        phaseHint.style.opacity = '0';
        progressBar.style.width = '100%';
        document.querySelector('.matrix-nav').style.opacity = '1';
        document.querySelector('.social-row').style.opacity = '1';
        document.querySelector('.footer').style.opacity = '0.7';
        skipBtn.style.opacity = '0';
        skipBtn.style.pointerEvents = 'none';
    }
    skipBtn.addEventListener('click', skipAnimation);

    function generateTexture() {
        const tw = textureCanvas.width, th = textureCanvas.height;
        if (!tw || !th) return;
        const img = texCtx.createImageData(tw, th);
        const d = img.data;
        for (let i=0; i<d.length; i+=4) {
            const x = (i/4)%tw, y = Math.floor(i/4/tw);
            const v = Math.floor(((Math.sin(x*0.02)*Math.cos(y*0.02) + 
                                   Math.sin(x*0.05+1)*Math.cos(y*0.05)*0.5 + 
                                   Math.sin(x*0.1)*Math.cos(y*0.1)*0.2)*0.5+0.5)*20);
            d[i]=d[i+1]=d[i+2]=v; d[i+3]=255;
        }
        texCtx.putImageData(img, 0, 0);
    }

    function updateHeadPosition(group, dt, isYang) {
        const head = group.head;
        if (!head) return;

        if (group.phase === 0) {
            const t = group.entryTime;
            const displacement = group.v0 * t + 0.5 * group.a * t * t;
            head.x = group.startX;
            head.y = group.startY + displacement;
            head.vx = 0;
            head.vy = group.v0 + group.a * t;
            group.entryTime += dt;
        } else if (group.phase === 1) {
            const progress = Math.min(1, group.spiralTime / CONFIG.TIMING.phase2);
            const startR = Math.min(w, h) * 0.45;
            const endR = Math.min(w, h) * 0.02;
            const r = startR + (endR - startR) * progress;
            const omega = 2.5 * progress;
            
            // 逆时针：阳（上）角度递减，阴（下）角度递增
            if (isYang) {
                group.spiralAngle -= omega * dt;
            } else {
                group.spiralAngle += omega * dt;
            }
            
            head.x = cx + Math.cos(group.spiralAngle) * r;
            head.y = cy + Math.sin(group.spiralAngle) * r * 0.7;
            
            const vr = (endR - startR) / CONFIG.TIMING.phase2;
            const vt = omega * r;
            const theta = group.spiralAngle;
            head.vx = vr * Math.cos(theta) - vt * Math.sin(theta);
            head.vy = vr * Math.sin(theta) + vt * Math.cos(theta);
            
            group.spiralTime += dt;
        } else if (group.phase === 2) {
            const r = Math.min(w, h) * 0.02;
            const omega = 2.0;
            if (isYang) {
                group.circleAngle -= omega * dt;
            } else {
                group.circleAngle += omega * dt;
            }
            head.x = cx + Math.cos(group.circleAngle) * r;
            head.y = cy + Math.sin(group.circleAngle) * r * 0.7;
            
            const vt = omega * r;
            const theta = group.circleAngle;
            head.vx = -vt * Math.sin(theta);
            head.vy = vt * Math.cos(theta);
        }
    }

    function updateTails(group, dt) {
        const tails = group.tails;
        if (tails.length === 0) return;
        const head = group.head;
        if (!head) return;

        let prev = head;
        for (let i = 0; i < tails.length; i++) {
            const tail = tails[i];
            const lerp = CONFIG.LERP_FACTOR * (1 - i / tails.length * 0.3);
            tail.x += (prev.x - tail.x) * lerp;
            tail.y += (prev.y - tail.y) * lerp;
            
            const dx = prev.x - tail.x;
            const dy = prev.y - tail.y;
            const len = Math.hypot(dx, dy);
            if (len > 0.1) {
                const perpX = -dy / len;
                const perpY = dx / len;
                const swing = Math.sin(globalTime * CONFIG.SWING_FREQ + i * 0.8) * CONFIG.SWING_AMP * (i / tails.length);
                tail.x += perpX * swing;
                tail.y += perpY * swing;
            }
            
            if (group.phase >= 1) {
                const toCenterX = tail.x - cx;
                const toCenterY = tail.y - cy;
                const dist = Math.hypot(toCenterX, toCenterY);
                if (dist > 1) {
                    const centrifugal = 0.015 * (i + 1);
                    tail.x += toCenterX / dist * centrifugal;
                    tail.y += toCenterY / dist * centrifugal;
                }
            }
            
            prev = tail;
        }
    }

    function initEnergyGroups() {
        const startR = Math.min(w, h) * 0.45;
        
        energyGroups.yang.head = { x: cx, y: -80, vx: 0, vy: 0 };
        energyGroups.yang.startX = cx;
        energyGroups.yang.startY = -80;
        energyGroups.yang.targetY = cy - startR * 0.7;
        energyGroups.yang.v0 = 8;
        const deltaY = energyGroups.yang.targetY - energyGroups.yang.startY;
        energyGroups.yang.a = - (energyGroups.yang.v0 * energyGroups.yang.v0) / (2 * deltaY);
        energyGroups.yang.entryTime = 0;
        energyGroups.yang.spiralTime = 0;
        energyGroups.yang.spiralAngle = -Math.PI/2;
        energyGroups.yang.circleAngle = -Math.PI/2;
        
        energyGroups.yin.head = { x: cx, y: h + 80, vx: 0, vy: 0 };
        energyGroups.yin.startX = cx;
        energyGroups.yin.startY = h + 80;
        energyGroups.yin.targetY = cy + startR * 0.7;
        energyGroups.yin.v0 = -8;
        const deltaYin = energyGroups.yin.targetY - energyGroups.yin.startY;
        energyGroups.yin.a = - (energyGroups.yin.v0 * energyGroups.yin.v0) / (2 * deltaYin);
        energyGroups.yin.entryTime = 0;
        energyGroups.yin.spiralTime = 0;
        energyGroups.yin.spiralAngle = Math.PI/2;
        energyGroups.yin.circleAngle = Math.PI/2;
        
        for (let g of [energyGroups.yang, energyGroups.yin]) {
            g.tails = [];
            const head = g.head;
            for (let i = 0; i < CONFIG.TAIL_COUNT; i++) {
                g.tails.push({ x: head.x, y: head.y });
            }
        }
    }

    class BangParticle {
        constructor(x, y) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = 12 + Math.random() * 28;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = 2.0 + Math.random() * 5;
            this.life = 1.0;
            this.decay = 0.022 + Math.random() * 0.03;
        }
        update() {
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }
        draw(ctx) {
            if (this.life <= 0) return;
            ctx.globalAlpha = this.life * 0.9;
            ctx.fillStyle = COLORS.white;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function drawWhitePoint() {
        if (!whitePointActive || whitePointSize <= 0.01) return;
        const grad = pCtx.createRadialGradient(cx, cy, 0, cx, cy, whitePointSize * 2.0);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.4, 'rgba(255,255,240,0.9)');
        grad.addColorStop(1, 'rgba(255,255,240,0)');
        pCtx.fillStyle = grad;
        pCtx.shadowBlur = 60;
        pCtx.shadowColor = '#FFFFFF';
        pCtx.beginPath();
        pCtx.arc(cx, cy, whitePointSize * 1.6, 0, Math.PI*2);
        pCtx.fill();
        pCtx.shadowBlur = 0;
    }

    function drawFinalText() {
        if (phase !== 4 || textAlpha <= 0.01) return;
        const fontSize = Math.min(w, h) * 0.12;
        pCtx.font = "bold " + fontSize + "px 'STKaiti', 'KaiTi', 'Songti SC', serif";
        pCtx.textAlign = "center";
        pCtx.textBaseline = "middle";
        pCtx.fillStyle = '#4A5B6E';
        pCtx.globalAlpha = textAlpha;
        pCtx.fillText(CONFIG.MAIN_TEXT, cx, cy * 0.65);
        pCtx.globalAlpha = 1.0;
    }

    function render() {
        bgCtx.fillStyle = bgColor;
        bgCtx.fillRect(0, 0, w, h);
        pCtx.globalCompositeOperation = 'source-over';
        pCtx.fillStyle = bgColor;
        pCtx.globalAlpha = 0.12;
        pCtx.fillRect(0, 0, w, h);
        pCtx.globalAlpha = 1.0;
        
        const dt = 0.016;
        
        if (phase < 3) {
            if (energyGroups.yang.head) {
                updateHeadPosition(energyGroups.yang, dt, true);
                updateTails(energyGroups.yang, dt);
            }
            if (energyGroups.yin.head) {
                updateHeadPosition(energyGroups.yin, dt, false);
                updateTails(energyGroups.yin, dt);
            }
        }
        
        for (let g of [energyGroups.yang, energyGroups.yin]) {
            const head = g.head;
            if (!head) continue;
            
            for (let i = 0; i < g.tails.length; i++) {
                const tail = g.tails[i];
                const widthRatio = 1 - i / g.tails.length;
                const size = 7 * widthRatio + 2;
                const alpha = 0.35 * widthRatio;
                
                const gradient = pCtx.createRadialGradient(tail.x, tail.y, 0, tail.x, tail.y, size * 1.5);
                gradient.addColorStop(0, g.color + 'A0');
                gradient.addColorStop(0.6, g.color + '30');
                gradient.addColorStop(1, g.color + '00');
                pCtx.fillStyle = gradient;
                pCtx.globalAlpha = alpha;
                pCtx.beginPath();
                pCtx.arc(tail.x, tail.y, size, 0, Math.PI*2);
                pCtx.fill();
            }
            
            let headSize = 14;
            if (phase >= 2) {
                const distToCenter = Math.hypot(head.x - cx, head.y - cy);
                headSize = Math.max(8, 14 * Math.min(1, distToCenter / 30));
            }
            const headGrad = pCtx.createRadialGradient(head.x, head.y, 0, head.x, head.y, headSize * 2);
            headGrad.addColorStop(0, g.color + 'FF');
            headGrad.addColorStop(0.5, g.color + '80');
            headGrad.addColorStop(1, g.color + '00');
            pCtx.fillStyle = headGrad;
            pCtx.globalAlpha = 1.0;
            pCtx.beginPath();
            pCtx.arc(head.x, head.y, headSize, 0, Math.PI*2);
            pCtx.fill();
        }
        
        drawWhitePoint();

        if (phase === 3) {
            for (let i=bangParticles.length-1; i>=0; i--) {
                bangParticles[i].update();
                bangParticles[i].draw(pCtx);
                if (bangParticles[i].life <= 0) bangParticles.splice(i,1);
            }
            if (bangParticles.length < 10 && phase === 3) {
                phase = 4;
                gsap.to({ t: 0 }, {
                    t: 1,
                    duration: CONFIG.TIMING.fadeOut,
                    ease: "power2.out",
                    onUpdate: function() { textAlpha = this.targets()[0].t; },
                    onComplete: () => { textAlpha = 1; }
                });
            }
        }

        drawFinalText();
        requestAnimationFrame(render);
        globalTime += dt;
    }

    function startAnim() {
        initEnergyGroups();
        
        const tl = gsap.timeline({
            onUpdate: function() {
                const prog = this.progress();
                progressBar.style.width = (prog * 100) + '%';
                if (prog < 0.25) phaseHint.innerHTML = '⚲ 化生 · 阴阳交融';
                else if (prog < 0.65) phaseHint.innerHTML = '⚲ 漩涡 · 凝聚归一';
                else if (prog < 0.85) phaseHint.innerHTML = '⚲ 太初 · 光耀大千';
                else phaseHint.innerHTML = '⚲ 真名 · 卜仙堂';
            }
        });
        animationTimeline = tl;

        tl.to({}, { duration: CONFIG.TIMING.phase1 });
        tl.add(() => {
            energyGroups.yang.phase = 1;
            energyGroups.yin.phase = 1;
        });
        
        tl.to({}, { duration: CONFIG.TIMING.phase2 });
        tl.add(() => {
            energyGroups.yang.phase = 2;
            energyGroups.yin.phase = 2;
        });
        
        tl.to({}, { duration: CONFIG.TIMING.phase3 });
        
        // 强制重合并激活白点
        tl.add(() => {
            if (energyGroups.yang.head) {
                energyGroups.yang.head.x = cx;
                energyGroups.yang.head.y = cy;
            }
            if (energyGroups.yin.head) {
                energyGroups.yin.head.x = cx;
                energyGroups.yin.head.y = cy;
            }
            whitePointActive = true;
            whitePointSize = 14;
        });
        
        tl.to({}, {
            duration: CONFIG.TIMING.whitePoint,
            onUpdate: function() {
                whitePointSize = 14 + 24 * this.progress();
            }
        });
        
        tl.add(() => {
            phase = 3;
            energyGroups.yang.head = null;
            energyGroups.yang.tails = [];
            energyGroups.yin.head = null;
            energyGroups.yin.tails = [];
            bgColor = COLORS.paper;
            whitePointActive = false;
            for (let i=0; i<CONFIG.BANG_PARTICLES; i++) {
                bangParticles.push(new BangParticle(cx, cy));
            }
        });
        
        tl.fromTo(".matrix-nav", { opacity:0, y:10 }, { opacity:1, y:0, duration:1.0, stagger:0.1 }, "+=0.9");
        tl.fromTo(".social-row", { opacity:0, y:10 }, { opacity:1, y:0, duration:1.0 }, "-=0.6");
        tl.to(".footer", { opacity:0.7, duration:1.5 }, "-=1.0");
        
        tl.add(() => {
            phaseHint.style.opacity = '0';
            skipBtn.style.opacity = '0';
            skipBtn.style.pointerEvents = 'none';
            progressBar.style.opacity = '0';
        }, "+=1.0");
    }

    function resize() {
        w = bgCanvas.width = particleCanvas.width = textureCanvas.width = inkCanvas.width = window.innerWidth;
        h = bgCanvas.height = particleCanvas.height = textureCanvas.height = inkCanvas.height = window.innerHeight;
        cx = w/2; cy = h/2;
        generateTexture();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 30));
    resize();

    document.fonts.ready.then(() => {
        startAnim();
        render();
    });

})();
</script>
</body>
</html>`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 55vh;
        }

        .matrix-nav {
            display: flex; flex-wrap: wrap;
            gap: var(--nav-gap);
            justify-content: center;
            opacity: 0; pointer-events: none;
            margin-bottom: 20px;
        }

        .nav-item {
            color: var(--color-ink);
            font-size: clamp(20px, 5vw, 26px);
            letter-spacing: 6px;
            padding: 8px 0;
            pointer-events: auto;
            opacity: 0.85;
            cursor: pointer;
            transition: all 0.25s ease-out;
            text-shadow: 2px 2px 4px rgba(255,255,240,0.6);
            white-space: nowrap;
            text-decoration: none;
            position: relative;
            font-weight: 500;
        }

        .nav-item:not(:last-child)::after {
            content: '·';
            position: absolute;
            right: calc(-1 * var(--nav-gap) / 2);
            top: 50%;
            transform: translate(50%, -50%);
            color: var(--color-amber);
            font-size: 22px;
            opacity: 0.5;
        }

        .nav-item:hover {
            color: var(--color-yang); opacity: 1;
            transform: translateY(-4px);
        }

        .social-row {
            display: flex; gap: var(--social-gap);
            justify-content: center;
            opacity: 0; pointer-events: none;
            margin-top: 16px;
        }

        .social-icon {
            color: var(--color-amber);
            font-size: clamp(26px, 6vw, 34px);
            pointer-events: auto;
            transition: all 0.3s;
            opacity: 0.8;
            text-decoration: none;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .social-icon:hover {
            color: var(--color-yang); opacity: 1;
            transform: scale(1.12) translateY(-3px);
        }

        .footer {
            color: var(--color-footer);
            font-size: clamp(10px, 3vw, 13px);
            letter-spacing: 4px;
            opacity: 0;
            text-align: center;
            margin-top: 24px;
            pointer-events: none;
            transition: opacity 1.5s;
        }

        #progress-bar-container {
            position: absolute; bottom: 0; left: 0;
            width: 100%; height: 2px;
            background: transparent;
            z-index: 150;
            pointer-events: none;
        }
        #progress-bar {
            width: 0%; height: 100%;
            background: var(--color-gold);
            box-shadow: 0 0 8px var(--color-gold);
            transition: width 0.05s linear;
        }

        #phase-hint {
            position: absolute; bottom: 20px; left: 20px;
            color: var(--color-amber);
            font-size: 13px;
            opacity: 0.5;
            z-index: 151;
            pointer-events: none;
            letter-spacing: 2px;
        }

        #skip-btn {
            position: absolute; bottom: 20px; right: 20px;
            color: var(--color-amber);
            font-size: 14px;
            opacity: 0.5;
            z-index: 200;
            cursor: pointer;
            pointer-events: auto;
            background: rgba(10,10,15,0.3);
            padding: 6px 14px;
            border-radius: 30px;
            backdrop-filter: blur(4px);
            border: 0.5px solid rgba(234,205,118,0.3);
            transition: all 0.2s;
            letter-spacing: 1px;
        }
        #skip-btn:hover {
            opacity: 0.9;
            background: rgba(234,205,118,0.15);
            border-color: var(--color-gold);
        }

        @media (max-width: 600px) {
            .nav-item:not(:last-child)::after { font-size: 18px; }
            #ui-layer { padding-top: 50vh; }
            #skip-btn { padding: 4px 10px; font-size: 12px; }
        }
    </style>
</head>
<body>

<div id="canvas-container">
    <canvas id="bg-canvas"></canvas>
    <canvas id="texture-canvas"></canvas>
    <canvas id="particle-canvas"></canvas>
    <canvas id="ink-overlay"></canvas>
</div>

<div id="progress-bar-container"><div id="progress-bar"></div></div>
<div id="phase-hint">⚲ 化生 · 阴阳交融</div>
<div id="skip-btn">⏭ 跳过</div>

<div id="ui-layer">
    <div class="matrix-nav">
        <a href="#" class="nav-item" id="nav-blog">博客入口</a>
        <a href="#" class="nav-item" id="nav-classics">经典解析</a>
        <a href="#" class="nav-item" id="nav-about">关于我</a>
    </div>
    <div class="social-row">
        <a href="#" class="social-icon" id="social-wechat" target="_blank"><i class="fab fa-weixin"></i></a>
        <a href="#" class="social-icon" id="social-bilibili" target="_blank"><i class="fab fa-bilibili"></i></a>
        <a href="#" class="social-icon" id="social-email" target="_blank"><i class="fas fa-envelope"></i></a>
    </div>
    <div class="footer"><span>© 卜仙堂 · 道隐无名</span></div>
</div>

<script>
(function(){
    "use strict";

    const CONFIG = {
        TAIL_COUNT: 12,
        LERP_FACTOR: 0.12,
        SWING_AMP: 4.0,
        SWING_FREQ: 0.05,
        BANG_PARTICLES: 2000,
        MAIN_TEXT: '卜仙堂',
        FONT_SIZE: 72,
        TIMING: {
            phase1: 2.5,
            phase2: 3.2,
            phase3: 0.8,
            whitePoint: 0.5,
            bang: 0.6,
            fadeOut: 1.0
        },
        LINKS: {
            blog: 'https://blog.buxiantang.top',
            classics: 'https://anal.buxiantang.top/about',
            about: 'https://blog.buxiantang.top/about',
            wechat: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwNzY4NDU3Nw==#wechat_redirect',
            bilibili: 'https://space.bilibili.com/265656567',
            email: 'mailto:tiengming@qq.com'
        }
    };

    document.getElementById('nav-blog').href = CONFIG.LINKS.blog;
    document.getElementById('nav-classics').href = CONFIG.LINKS.classics;
    document.getElementById('nav-about').href = CONFIG.LINKS.about;
    document.getElementById('social-wechat').href = CONFIG.LINKS.wechat;
    document.getElementById('social-bilibili').href = CONFIG.LINKS.bilibili;
    document.getElementById('social-email').href = CONFIG.LINKS.email;

    const bgCanvas = document.getElementById('bg-canvas');
    const particleCanvas = document.getElementById('particle-canvas');
    const textureCanvas = document.getElementById('texture-canvas');
    const inkCanvas = document.getElementById('ink-overlay');
    const bgCtx = bgCanvas.getContext('2d');
    const pCtx = particleCanvas.getContext('2d', { alpha: true });
    const texCtx = textureCanvas.getContext('2d');
    const inkCtx = inkCanvas.getContext('2d');

    let w, h, cx, cy;
    let animationTimeline;
    let phase = 0;
    let globalTime = 0;

    const COLORS = {
        void: '#0a0a0f', paper: '#F3F0E6',
        yang: '#FF461F', yin: '#344352',
        white: '#FFFFFF'
    };

    let bgColor = COLORS.void;
    let whitePointSize = 0;
    let textAlpha = 0;
    let whitePointActive = false;

    const energyGroups = {
        yang: { head: null, tails: [], color: COLORS.yang, phase: 0, startX: 0, startY: 0, targetY: 0, v0: 0, a: 0 },
        yin:  { head: null, tails: [], color: COLORS.yin,  phase: 0, startX: 0, startY: 0, targetY: 0, v0: 0, a: 0 }
    };

    const bangParticles = [];

    const phaseHint = document.getElementById('phase-hint');
    const progressBar = document.getElementById('progress-bar');
    const skipBtn = document.getElementById('skip-btn');

    function skipAnimation() {
        if (animationTimeline) {
            animationTimeline.seek(99);
            animationTimeline.kill();
        }
        phase = 4;
        textAlpha = 1;
        bgColor = COLORS.paper;
        whitePointSize = 0;
        whitePointActive = false;
        energyGroups.yang.head = null;
        energyGroups.yang.tails = [];
        energyGroups.yin.head = null;
        energyGroups.yin.tails = [];
        bangParticles.length = 0;
        phaseHint.style.opacity = '0';
        progressBar.style.width = '100%';
        document.querySelector('.matrix-nav').style.opacity = '1';
        document.querySelector('.social-row').style.opacity = '1';
        document.querySelector('.footer').style.opacity = '0.7';
        skipBtn.style.opacity = '0';
        skipBtn.style.pointerEvents = 'none';
    }
    skipBtn.addEventListener('click', skipAnimation);

    function generateTexture() {
        const tw = textureCanvas.width, th = textureCanvas.height;
        if (!tw || !th) return;
        const img = texCtx.createImageData(tw, th);
        const d = img.data;
        for (let i=0; i<d.length; i+=4) {
            const x = (i/4)%tw, y = Math.floor(i/4/tw);
            const v = Math.floor(((Math.sin(x*0.02)*Math.cos(y*0.02) + 
                                   Math.sin(x*0.05+1)*Math.cos(y*0.05)*0.5 + 
                                   Math.sin(x*0.1)*Math.cos(y*0.1)*0.2)*0.5+0.5)*20);
            d[i]=d[i+1]=d[i+2]=v; d[i+3]=255;
        }
        texCtx.putImageData(img, 0, 0);
    }

    function updateHeadPosition(group, dt, isYang) {
        const head = group.head;
        if (!head) return;

        if (group.phase === 0) {
            const t = group.entryTime;
            const displacement = group.v0 * t + 0.5 * group.a * t * t;
            head.x = group.startX;
            head.y = group.startY + displacement;
            head.vx = 0;
            head.vy = group.v0 + group.a * t;
            group.entryTime += dt;
        } else if (group.phase === 1) {
            const progress = Math.min(1, group.spiralTime / CONFIG.TIMING.phase2);
            const startR = Math.min(w, h) * 0.45;
            const endR = Math.min(w, h) * 0.02;
            const r = startR + (endR - startR) * progress;
            const omega = 2.5 * progress;
            
            // 逆时针：阳（上）角度递减，阴（下）角度递增
            if (isYang) {
                group.spiralAngle -= omega * dt;
            } else {
                group.spiralAngle += omega * dt;
            }
            
            head.x = cx + Math.cos(group.spiralAngle) * r;
            head.y = cy + Math.sin(group.spiralAngle) * r * 0.7;
            
            const vr = (endR - startR) / CONFIG.TIMING.phase2;
            const vt = omega * r;
            const theta = group.spiralAngle;
            head.vx = vr * Math.cos(theta) - vt * Math.sin(theta);
            head.vy = vr * Math.sin(theta) + vt * Math.cos(theta);
            
            group.spiralTime += dt;
        } else if (group.phase === 2) {
            const r = Math.min(w, h) * 0.02;
            const omega = 2.0;
            if (isYang) {
                group.circleAngle -= omega * dt;
            } else {
                group.circleAngle += omega * dt;
            }
            head.x = cx + Math.cos(group.circleAngle) * r;
            head.y = cy + Math.sin(group.circleAngle) * r * 0.7;
            
            const vt = omega * r;
            const theta = group.circleAngle;
            head.vx = -vt * Math.sin(theta);
            head.vy = vt * Math.cos(theta);
        }
    }

    function updateTails(group, dt) {
        const tails = group.tails;
        if (tails.length === 0) return;
        const head = group.head;
        if (!head) return;

        let prev = head;
        for (let i = 0; i < tails.length; i++) {
            const tail = tails[i];
            const lerp = CONFIG.LERP_FACTOR * (1 - i / tails.length * 0.3);
            tail.x += (prev.x - tail.x) * lerp;
            tail.y += (prev.y - tail.y) * lerp;
            
            const dx = prev.x - tail.x;
            const dy = prev.y - tail.y;
            const len = Math.hypot(dx, dy);
            if (len > 0.1) {
                const perpX = -dy / len;
                const perpY = dx / len;
                const swing = Math.sin(globalTime * CONFIG.SWING_FREQ + i * 0.8) * CONFIG.SWING_AMP * (i / tails.length);
                tail.x += perpX * swing;
                tail.y += perpY * swing;
            }
            
            if (group.phase >= 1) {
                const toCenterX = tail.x - cx;
                const toCenterY = tail.y - cy;
                const dist = Math.hypot(toCenterX, toCenterY);
                if (dist > 1) {
                    const centrifugal = 0.015 * (i + 1);
                    tail.x += toCenterX / dist * centrifugal;
                    tail.y += toCenterY / dist * centrifugal;
                }
            }
            
            prev = tail;
        }
    }

    function initEnergyGroups() {
        const startR = Math.min(w, h) * 0.45;
        
        energyGroups.yang.head = { x: cx, y: -80, vx: 0, vy: 0 };
        energyGroups.yang.startX = cx;
        energyGroups.yang.startY = -80;
        energyGroups.yang.targetY = cy - startR * 0.7;
        energyGroups.yang.v0 = 8;
        const deltaY = energyGroups.yang.targetY - energyGroups.yang.startY;
        energyGroups.yang.a = - (energyGroups.yang.v0 * energyGroups.yang.v0) / (2 * deltaY);
        energyGroups.yang.entryTime = 0;
        energyGroups.yang.spiralTime = 0;
        energyGroups.yang.spiralAngle = -Math.PI/2;
        energyGroups.yang.circleAngle = -Math.PI/2;
        
        energyGroups.yin.head = { x: cx, y: h + 80, vx: 0, vy: 0 };
        energyGroups.yin.startX = cx;
        energyGroups.yin.startY = h + 80;
        energyGroups.yin.targetY = cy + startR * 0.7;
        energyGroups.yin.v0 = -8;
        const deltaYin = energyGroups.yin.targetY - energyGroups.yin.startY;
        energyGroups.yin.a = - (energyGroups.yin.v0 * energyGroups.yin.v0) / (2 * deltaYin);
        energyGroups.yin.entryTime = 0;
        energyGroups.yin.spiralTime = 0;
        energyGroups.yin.spiralAngle = Math.PI/2;
        energyGroups.yin.circleAngle = Math.PI/2;
        
        for (let g of [energyGroups.yang, energyGroups.yin]) {
            g.tails = [];
            const head = g.head;
            for (let i = 0; i < CONFIG.TAIL_COUNT; i++) {
                g.tails.push({ x: head.x, y: head.y });
            }
        }
    }

    class BangParticle {
        constructor(x, y) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = 12 + Math.random() * 28;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = 2.0 + Math.random() * 5;
            this.life = 1.0;
            this.decay = 0.022 + Math.random() * 0.03;
        }
        update() {
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }
        draw(ctx) {
            if (this.life <= 0) return;
            ctx.globalAlpha = this.life * 0.9;
            ctx.fillStyle = COLORS.white;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function drawWhitePoint() {
        if (!whitePointActive || whitePointSize <= 0.01) return;
        const grad = pCtx.createRadialGradient(cx, cy, 0, cx, cy, whitePointSize * 2.0);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.4, 'rgba(255,255,240,0.9)');
        grad.addColorStop(1, 'rgba(255,255,240,0)');
        pCtx.fillStyle = grad;
        pCtx.shadowBlur = 60;
        pCtx.shadowColor = '#FFFFFF';
        pCtx.beginPath();
        pCtx.arc(cx, cy, whitePointSize * 1.6, 0, Math.PI*2);
        pCtx.fill();
        pCtx.shadowBlur = 0;
    }

    function drawFinalText() {
        if (phase !== 4 || textAlpha <= 0.01) return;
        const fontSize = Math.min(w, h) * 0.12;
        pCtx.font = "bold " + fontSize + "px 'STKaiti', 'KaiTi', 'Songti SC', serif";
        pCtx.textAlign = "center";
        pCtx.textBaseline = "middle";
        pCtx.fillStyle = '#4A5B6E';
        pCtx.globalAlpha = textAlpha;
        pCtx.fillText(CONFIG.MAIN_TEXT, cx, cy * 0.65);
        pCtx.globalAlpha = 1.0;
    }

    function render() {
        bgCtx.fillStyle = bgColor;
        bgCtx.fillRect(0, 0, w, h);
        pCtx.globalCompositeOperation = 'source-over';
        pCtx.fillStyle = bgColor;
        pCtx.globalAlpha = 0.12;
        pCtx.fillRect(0, 0, w, h);
        pCtx.globalAlpha = 1.0;
        
        const dt = 0.016;
        
        if (phase < 3) {
            if (energyGroups.yang.head) {
                updateHeadPosition(energyGroups.yang, dt, true);
                updateTails(energyGroups.yang, dt);
            }
            if (energyGroups.yin.head) {
                updateHeadPosition(energyGroups.yin, dt, false);
                updateTails(energyGroups.yin, dt);
            }
        }
        
        for (let g of [energyGroups.yang, energyGroups.yin]) {
            const head = g.head;
            if (!head) continue;
            
            for (let i = 0; i < g.tails.length; i++) {
                const tail = g.tails[i];
                const widthRatio = 1 - i / g.tails.length;
                const size = 7 * widthRatio + 2;
                const alpha = 0.35 * widthRatio;
                
                const gradient = pCtx.createRadialGradient(tail.x, tail.y, 0, tail.x, tail.y, size * 1.5);
                gradient.addColorStop(0, g.color + 'A0');
                gradient.addColorStop(0.6, g.color + '30');
                gradient.addColorStop(1, g.color + '00');
                pCtx.fillStyle = gradient;
                pCtx.globalAlpha = alpha;
                pCtx.beginPath();
                pCtx.arc(tail.x, tail.y, size, 0, Math.PI*2);
                pCtx.fill();
            }
            
            let headSize = 14;
            if (phase >= 2) {
                const distToCenter = Math.hypot(head.x - cx, head.y - cy);
                headSize = Math.max(8, 14 * Math.min(1, distToCenter / 30));
            }
            const headGrad = pCtx.createRadialGradient(head.x, head.y, 0, head.x, head.y, headSize * 2);
            headGrad.addColorStop(0, g.color + 'FF');
            headGrad.addColorStop(0.5, g.color + '80');
            headGrad.addColorStop(1, g.color + '00');
            pCtx.fillStyle = headGrad;
            pCtx.globalAlpha = 1.0;
            pCtx.beginPath();
            pCtx.arc(head.x, head.y, headSize, 0, Math.PI*2);
            pCtx.fill();
        }
        
        drawWhitePoint();

        if (phase === 3) {
            for (let i=bangParticles.length-1; i>=0; i--) {
                bangParticles[i].update();
                bangParticles[i].draw(pCtx);
                if (bangParticles[i].life <= 0) bangParticles.splice(i,1);
            }
            if (bangParticles.length < 10 && phase === 3) {
                phase = 4;
                gsap.to({ t: 0 }, {
                    t: 1,
                    duration: CONFIG.TIMING.fadeOut,
                    ease: "power2.out",
                    onUpdate: function() { textAlpha = this.targets()[0].t; },
                    onComplete: () => { textAlpha = 1; }
                });
            }
        }

        drawFinalText();
        requestAnimationFrame(render);
        globalTime += dt;
    }

    function startAnim() {
        initEnergyGroups();
        
        const tl = gsap.timeline({
            onUpdate: function() {
                const prog = this.progress();
                progressBar.style.width = (prog * 100) + '%';
                if (prog < 0.25) phaseHint.innerHTML = '⚲ 化生 · 阴阳交融';
                else if (prog < 0.65) phaseHint.innerHTML = '⚲ 漩涡 · 凝聚归一';
                else if (prog < 0.85) phaseHint.innerHTML = '⚲ 太初 · 光耀大千';
                else phaseHint.innerHTML = '⚲ 真名 · 卜仙堂';
            }
        });
        animationTimeline = tl;

        tl.to({}, { duration: CONFIG.TIMING.phase1 });
        tl.add(() => {
            energyGroups.yang.phase = 1;
            energyGroups.yin.phase = 1;
        });
        
        tl.to({}, { duration: CONFIG.TIMING.phase2 });
        tl.add(() => {
            energyGroups.yang.phase = 2;
            energyGroups.yin.phase = 2;
        });
        
        tl.to({}, { duration: CONFIG.TIMING.phase3 });
        
        // 强制重合并激活白点
        tl.add(() => {
            if (energyGroups.yang.head) {
                energyGroups.yang.head.x = cx;
                energyGroups.yang.head.y = cy;
            }
            if (energyGroups.yin.head) {
                energyGroups.yin.head.x = cx;
                energyGroups.yin.head.y = cy;
            }
            whitePointActive = true;
            whitePointSize = 14;
        });
        
        tl.to({}, {
            duration: CONFIG.TIMING.whitePoint,
            onUpdate: function() {
                whitePointSize = 14 + 24 * this.progress();
            }
        });
        
        tl.add(() => {
            phase = 3;
            energyGroups.yang.head = null;
            energyGroups.yang.tails = [];
            energyGroups.yin.head = null;
            energyGroups.yin.tails = [];
            bgColor = COLORS.paper;
            whitePointActive = false;
            for (let i=0; i<CONFIG.BANG_PARTICLES; i++) {
                bangParticles.push(new BangParticle(cx, cy));
            }
        });
        
        tl.fromTo(".matrix-nav", { opacity:0, y:10 }, { opacity:1, y:0, duration:1.0, stagger:0.1 }, "+=0.9");
        tl.fromTo(".social-row", { opacity:0, y:10 }, { opacity:1, y:0, duration:1.0 }, "-=0.6");
        tl.to(".footer", { opacity:0.7, duration:1.5 }, "-=1.0");
        
        tl.add(() => {
            phaseHint.style.opacity = '0';
            skipBtn.style.opacity = '0';
            skipBtn.style.pointerEvents = 'none';
            progressBar.style.opacity = '0';
        }, "+=1.0");
    }

    function resize() {
        w = bgCanvas.width = particleCanvas.width = textureCanvas.width = inkCanvas.width = window.innerWidth;
        h = bgCanvas.height = particleCanvas.height = textureCanvas.height = inkCanvas.height = window.innerHeight;
        cx = w/2; cy = h/2;
        generateTexture();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 30));
    resize();

    document.fonts.ready.then(() => {
        startAnim();
        render();
    });

})();
</script>
</body>
</html>`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};
