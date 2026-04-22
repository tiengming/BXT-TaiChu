export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>卜仙堂 · 道生万象</title>
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

        #audio-prompt {
            position: absolute; bottom: 20px; left: 20px;
            color: var(--color-amber); font-size: 12px;
            opacity: 0.4; z-index: 101; pointer-events: none;
        }

        @media (max-width: 600px) {
            .nav-item:not(:last-child)::after { font-size: 18px; }
            #ui-layer { padding-top: 50vh; }
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
<div id="audio-prompt">⚲ 轻触闻道</div>

<script>
(function(){
    "use strict";

    const CONFIG = {
        MAX_PARTICLES: 4500,
        PARTICLE_SPEED: { yang: 18, yin: 10, gold: 8 },
        DECAY: { min: 0.004, max: 0.012 },
        TEXT_STEP: 2,
        SMOKE_PER_FRAME: 8,
        AUDIO: { freq: 42, dur: 2.5, vol: 0.02 },
        INK: { life: 0.9, radius: 2, prob: 0.25 },
        MAIN_TEXT: '卜仙堂',
        FONT_SIZE: 72,
        LINKS: {
            blog: 'https://blog.buxiantang.top/', classics: 'https://anal.buxiantang.top/about', about: 'https://blog.buxiantang.top/about',
            wechat: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwNzY4NDU3Nw==#wechat_redirect', bilibili: 'https://space.bilibili.com/265656567', email: 'mailto:tiengming@qq.com'
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

    const COLORS = {
        void: '#0a0a0f', paper: '#F3F0E6',
        yang: '#FF461F', yin: '#344352',
        gold: '#EACD76', amber: '#CA6924',
        text: '#4A5B6E'
    };

    const sim = {
        phase: 0, time: 0, coreSize: 0, bgColor: COLORS.void,
        yangPos: { x: 0, y: 0 }, yinPos: { x: 0, y: 0 },
        vortexStrength: 0,
        textAlpha: 0
    };

    const particles = [];
    const smokeParticles = [];
    let textTargetPoints = [];

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

    function computeTextPoints() {
        const off = new OffscreenCanvas(1,1);
        const octx = off.getContext('2d');
        octx.font = "bold " + CONFIG.FONT_SIZE + "px 'STKaiti', 'KaiTi', 'Songti SC', serif";
        const metrics = octx.measureText(CONFIG.MAIN_TEXT);
        const textW = metrics.width;
        const textH = CONFIG.FONT_SIZE * 1.3;
        const baseW = Math.ceil(textW + 60);
        const baseH = Math.ceil(textH + 30);
        
        const off2 = new OffscreenCanvas(baseW, baseH);
        const octx2 = off2.getContext('2d');
        octx2.font = "bold " + CONFIG.FONT_SIZE + "px 'STKaiti', 'KaiTi', 'Songti SC', serif";
        octx2.textAlign = "center"; octx2.textBaseline = "middle";
        octx2.fillStyle = "#fff";
        octx2.fillText(CONFIG.MAIN_TEXT, baseW/2, baseH/2);
        
        const img = octx2.getImageData(0,0,baseW,baseH);
        const pts = [];
        const step = CONFIG.TEXT_STEP;
        for (let y=0; y<baseH; y+=step) {
            for (let x=0; x<baseW; x+=step) {
                if (img.data[(y*baseW+x)*4] > 128) {
                    const nx = (x / baseW) - 0.5;
                    const ny = (y / baseH) - 0.5;
                    pts.push({ nx, ny, baseW, baseH });
                }
            }
        }
        textTargetPoints = pts;
    }

    class Particle {
        constructor(x,y,type) {
            this.x=x; this.y=y; this.type=type;
            const a=Math.random()*Math.PI*2;
            const s=type===0?CONFIG.PARTICLE_SPEED.yang:(type===1?CONFIG.PARTICLE_SPEED.yin:CONFIG.PARTICLE_SPEED.gold);
            this.vx=Math.cos(a)*s*(0.7+Math.random()*0.6);
            this.vy=Math.sin(a)*s*(0.7+Math.random()*0.6);
            this.size=type===2?2.2:(2.0+Math.random()*2.5);
            this.life=1.0;
            this.decay=CONFIG.DECAY.min+Math.random()*(CONFIG.DECAY.max-CONFIG.DECAY.min);
            this.progress = 0;
            if(type===2){
                this.target = textTargetPoints.length ? 
                    textTargetPoints[Math.floor(Math.random()*textTargetPoints.length)] : null;
                this.startX = x; this.startY = y;
                this.settled = false;
            }
        }
        update() {
            if(this.type===2 && !this.settled && this.target) {
                const scale = Math.min(w, h) * 0.58;
                const tx = cx + this.target.nx * scale * (this.target.baseW / this.target.baseH) * 0.95;
                const ty = cy * 0.65 + this.target.ny * scale * 0.85;
                
                this.progress = Math.min(1, this.progress + 0.03);
                const eased = 1 - Math.pow(1 - this.progress, 1.5);
                
                const targetX = this.startX + (tx - this.startX) * eased;
                const targetY = this.startY + (ty - this.startY) * eased;
                
                const noise = 0.4 * (1 - eased);
                this.x = targetX + (Math.random()-0.5)*noise;
                this.y = targetY + (Math.random()-0.5)*noise;
                
                if(this.progress >= 0.99) {
                    this.settled = true;
                    this.x = tx; this.y = ty;
                }
            } else {
                this.vx *= 0.96; this.vy *= 0.96;
                this.x += this.vx; this.y += this.vy;
            }
            
            if(sim.phase >= 3) {
                this.life -= this.decay * 1.5;
            } else {
                this.life -= this.decay;
            }
            if(this.type === 2 && this.settled) {
                this.life -= 0.01;
            }
        }
        draw(ctx) {
            if(this.life <= 0) return;
            ctx.globalAlpha = this.life * (this.type===1?0.85:1);
            let c = this.type===0?COLORS.yang:(this.type===1?COLORS.yin:COLORS.gold);
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * (0.8+0.2*Math.sin(sim.time*4+this.x)), 0, 2*Math.PI);
            ctx.fill();
            if(this.type===2){ 
                ctx.shadowBlur = 10; ctx.shadowColor = COLORS.amber; ctx.fill(); ctx.shadowBlur = 0; 
            }
        }
    }

    class SmokeParticle {
        constructor(x, y, color) {
            this.x = x; this.y = y;
            this.vx = (Math.random() - 0.5) * 2.5;
            this.vy = (Math.random() - 0.5) * 2.5;
            this.size = 15 + Math.random() * 25;
            this.life = 0.7 + Math.random() * 0.5;
            this.decay = 0.008 + Math.random() * 0.01;
            this.color = color;
        }
        update(vortexStrength) {
            if (vortexStrength > 0) {
                const dx = this.x - cx;
                const dy = this.y - cy;
                const dist = Math.hypot(dx, dy);
                if (dist > 5) {
                    const angle = Math.atan2(dy, dx);
                    const offsetAngle = angle - vortexStrength * 0.05;
                    const radius = dist * (1 - vortexStrength * 0.01);
                    const targetX = cx + Math.cos(offsetAngle) * radius;
                    const targetY = cy + Math.sin(offsetAngle) * radius;
                    this.vx += (targetX - this.x) * 0.02;
                    this.vy += (targetY - this.y) * 0.02;
                }
            }
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }
        draw(ctx) {
            if (this.life <= 0) return;
            const alpha = this.life * 0.3;
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, this.color + '80');
            gradient.addColorStop(0.6, this.color + '20');
            gradient.addColorStop(1, this.color + '00');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function emitSmoke() {
        if (sim.phase !== 1) return;
        const yangColor = COLORS.yang;
        const yinColor = COLORS.yin;
        for (let i=0; i<CONFIG.SMOKE_PER_FRAME/2; i++) {
            smokeParticles.push(new SmokeParticle(
                sim.yangPos.x + (Math.random()-0.5)*20,
                sim.yangPos.y + (Math.random()-0.5)*20,
                yangColor
            ));
            smokeParticles.push(new SmokeParticle(
                sim.yinPos.x + (Math.random()-0.5)*20,
                sim.yinPos.y + (Math.random()-0.5)*20,
                yinColor
            ));
        }
    }

    function drawSmoke() {
        for (let i=smokeParticles.length-1; i>=0; i--) {
            const p = smokeParticles[i];
            p.update(sim.vortexStrength);
            p.draw(pCtx);
            if (p.life <= 0) smokeParticles.splice(i,1);
        }
    }

    // 东方水墨阴影文字
    function drawSolidText() {
        if(sim.phase !== 4) return;
        const fontSize = Math.min(w, h) * 0.12;
        pCtx.font = "bold " + fontSize + "px 'STKaiti', 'KaiTi', 'Songti SC', serif";
        pCtx.textAlign = "center"; pCtx.textBaseline = "middle";
        const tx = cx;
        const ty = cy * 0.65;

        // 第一层：最模糊、最淡的阴影（远处晕染）
        pCtx.fillStyle = COLORS.text;
        pCtx.globalAlpha = sim.textAlpha * 0.15;
        pCtx.shadowColor = COLORS.text;
        pCtx.shadowBlur = 35;
        pCtx.shadowOffsetX = 6;
        pCtx.shadowOffsetY = 8;
        pCtx.fillText(CONFIG.MAIN_TEXT, tx, ty);

        // 第二层：中等模糊阴影
        pCtx.globalAlpha = sim.textAlpha * 0.25;
        pCtx.shadowBlur = 20;
        pCtx.shadowOffsetX = 3;
        pCtx.shadowOffsetY = 4;
        pCtx.fillText(CONFIG.MAIN_TEXT, tx, ty);

        // 第三层：轻微模糊阴影
        pCtx.globalAlpha = sim.textAlpha * 0.5;
        pCtx.shadowBlur = 8;
        pCtx.shadowOffsetX = 1;
        pCtx.shadowOffsetY = 2;
        pCtx.fillText(CONFIG.MAIN_TEXT, tx, ty);

        // 第四层：文字本体（无阴影）
        pCtx.shadowBlur = 0;
        pCtx.shadowOffsetX = 0;
        pCtx.shadowOffsetY = 0;
        pCtx.globalAlpha = sim.textAlpha;
        pCtx.fillStyle = COLORS.text;
        pCtx.fillText(CONFIG.MAIN_TEXT, tx, ty);
    }

    const inkDrops=[];
    function drawInk() {
        inkCtx.clearRect(0,0,w,h);
        for(let i=inkDrops.length-1;i>=0;i--) {
            const d=inkDrops[i]; d.radius+=1.8; d.life-=0.015;
            if(d.life<=0){ inkDrops.splice(i,1); continue; }
            const g=inkCtx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.radius);
            g.addColorStop(0,'rgba(74,91,110,'+d.life*0.2+')'); g.addColorStop(1,'rgba(74,91,110,0)');
            inkCtx.fillStyle=g; inkCtx.beginPath(); inkCtx.arc(d.x,d.y,d.radius,0,2*Math.PI); inkCtx.fill();
        }
    }

    function render() {
        bgCtx.fillStyle = sim.bgColor;
        bgCtx.fillRect(0, 0, w, h);

        pCtx.globalCompositeOperation = 'source-over';
        pCtx.fillStyle = sim.bgColor;
        pCtx.globalAlpha = sim.phase >= 3 ? 0.05 : 0.12;
        pCtx.fillRect(0, 0, w, h);
        pCtx.globalAlpha = 1.0;

        sim.time += 0.018;

        emitSmoke();
        drawSmoke();

        if (sim.phase >= 2) {
            if (sim.coreSize > 0) {
                const grad = pCtx.createRadialGradient(cx,cy,0,cx,cy,sim.coreSize);
                grad.addColorStop(0,COLORS.gold); grad.addColorStop(0.8,COLORS.amber);
                pCtx.fillStyle=grad; pCtx.shadowBlur=60; pCtx.shadowColor=COLORS.gold;
                pCtx.beginPath(); pCtx.arc(cx,cy,sim.coreSize,0,2*Math.PI); pCtx.fill();
                pCtx.shadowBlur=0;
            }
            for (let i=particles.length-1; i>=0; i--) {
                particles[i].update();
                particles[i].draw(pCtx);
                if (particles[i].life <= 0) particles.splice(i,1);
            }
        }

        drawSolidText();
        drawInk();
        requestAnimationFrame(render);
    }

    function startAnim() {
        const tl = gsap.timeline({ delay:0.3 });
        
        tl.set(sim, { phase:0, bgColor:COLORS.void });
        tl.to({}, { duration: 1.0 });

        tl.add(() => { sim.phase = 1; sim.vortexStrength = 0; });
        tl.fromTo(sim.yangPos, 
            { x: cx, y: -100 }, 
            { x: cx, y: cy * 0.7, duration: 4.0, ease: "power2.inOut" }, 0);
        tl.fromTo(sim.yinPos, 
            { x: cx, y: h + 100 }, 
            { x: cx, y: cy * 1.3, duration: 4.0, ease: "power2.inOut" }, 0);
        
        // 飞入后半程开启漩涡
        tl.to(sim, { vortexStrength: 1.2, duration: 2.5, ease: "power2.in" }, "+=1.5");
        
        // 漩涡蓄力，让能量充分卷入
        tl.to({}, { duration: 0.6 });
        
        // 金丹出现（伴随生长动画）
        tl.add(() => { 
            sim.phase = 2; 
            smokeParticles.length = 0;
            sim.coreSize = 5;
        });
        tl.to(sim, { coreSize: 60, duration: 0.35, ease: "expo.out" });
        tl.add(() => { for(let i=0;i<1500;i++) particles.push(new Particle(cx, cy, i%3)); });
        tl.to(sim, { coreSize: 0, duration: 0.5, ease: "power2.in" });
        tl.to(sim, { bgColor: COLORS.paper, duration: 1.8 }, "-=0.3");
        
        tl.add(() => { sim.phase = 3; }, "-=0.5");
        tl.add(() => { for(let i=0;i<900;i++) particles.push(new Particle(cx, cy, 2)); }, "+=0.2");
        
        tl.to({}, { duration: 2.5 });
        tl.add(() => {
            sim.phase = 4;
            particles.length = 0;
            gsap.to(sim, { textAlpha: 1, duration: 1.5, ease: "power2.out" });
        });
        
        tl.fromTo(".matrix-nav", { opacity:0, y:10 }, { opacity:1, y:0, duration:1.0, stagger:0.1 }, "-=1.2");
        tl.fromTo(".social-row", { opacity:0, y:10 }, { opacity:1, y:0, duration:1.0 }, "-=0.8");
        tl.to(".footer", { opacity:0.7, duration:1.5 }, "-=1.2");
    }

    function resize() {
        w=bgCanvas.width=particleCanvas.width=textureCanvas.width=inkCanvas.width=window.innerWidth;
        h=bgCanvas.height=particleCanvas.height=textureCanvas.height=inkCanvas.height=window.innerHeight;
        cx=w/2; cy=h/2;
        generateTexture();
        computeTextPoints();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', ()=>setTimeout(resize,30));
    resize();

    document.fonts.ready.then(()=>{
        computeTextPoints();
        startAnim();
        render();
    });

    window.addEventListener('mousemove', (e)=>{
        if(sim.phase<4) return;
        const rect=particleCanvas.getBoundingClientRect();
        const x=e.clientX-rect.left, y=e.clientY-rect.top;
        if([...document.querySelectorAll('.nav-item,.social-icon')].some(el=>{
            const b=el.getBoundingClientRect();
            return e.clientX>=b.left-30&&e.clientX<=b.right+30&&e.clientY>=b.top-30&&e.clientY<=b.bottom+30;
        }) && Math.random()<CONFIG.INK.prob) {
            inkDrops.push({x,y,radius:CONFIG.INK.radius, life:CONFIG.INK.life});
        }
    });

    window.addEventListener('click', (e)=>{
        if(!window._audioInit) {
            window._audioInit=true;
            const AC=window.AudioContext||window.webkitAudioContext;
            if(AC) {
                const ctx=new AC(); const osc=ctx.createOscillator();
                osc.type='sine'; osc.frequency.value=CONFIG.AUDIO.freq;
                const gain=ctx.createGain(); gain.gain.value=CONFIG.AUDIO.vol;
                osc.connect(gain).connect(ctx.destination);
                osc.start(); osc.stop(ctx.currentTime+CONFIG.AUDIO.dur);
            }
            document.getElementById('audio-prompt').style.opacity='0';
        }
        const rect=particleCanvas.getBoundingClientRect();
        for(let i=0;i<4;i++) inkDrops.push({x:e.clientX-rect.left, y:e.clientY-rect.top, radius:4, life:1});
    });

})();
</script>
</body>
</html>`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};
