export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卜仙堂 - 探寻天地之理</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        :root {
            --color-void: #0A0A0F;
            --color-paper: #F4F4EC;
            --color-yang: #FF461F;
            --color-yin: #101419;
            --color-gold: #EACD76;
        }

        body, html {
            margin: 0; padding: 0; width: 100%; height: 100%;
            overflow: hidden;
            background-color: var(--color-void);
            font-family: "STKaiti", "KaiTi", "Songti SC", serif;
        }

        #stage { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
        
        /* 增加宣纸纹理遮罩层 */
        #paper-texture {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            opacity: 0; z-index: 2; pointer-events: none;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 Atem%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            mix-blend-mode: overlay;
        }

        #flash { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #FFF; opacity: 0; z-index: 10; pointer-events: none; }

        #ui-layer {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 15; text-align: center; pointer-events: none;
            mix-blend-mode: multiply;
        }

        svg.logo-text { width: 400px; height: 160px; opacity: 0; }
        svg.logo-text text {
            font-size: 88px; letter-spacing: 12px;
            fill: transparent; stroke: var(--color-gold);
            stroke-width: 1.2px; stroke-dasharray: 800; stroke-dashoffset: 800;
        }

        .matrix-nav { margin-top: 60px; display: flex; gap: 45px; justify-content: center; opacity: 0; }
        .nav-item {
            color: var(--color-yin); text-decoration: none; font-size: 17px;
            letter-spacing: 5px; position: relative; padding-bottom: 10px;
            pointer-events: auto; transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
        }
        .nav-item::after {
            content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 1.5px;
            background-color: var(--color-yang); transition: all 0.5s ease; transform: translateX(-50%);
        }
        .nav-item:hover { color: var(--color-yang); transform: translateY(-3px); letter-spacing: 7px; }
        .nav-item:hover::after { width: 100%; }
    </style>
</head>
<body>
    <div id="flash"></div>
    <div id="paper-texture"></div>
    <canvas id="stage"></canvas>
    <div id="ui-layer">
        <svg class="logo-text" viewBox="0 0 400 160">
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">卜仙堂</text>
        </svg>
        <div class="matrix-nav">
            <a href="#blog" class="nav-item">云深不知处</a>
            <a href="#classics" class="nav-item">易理探微</a>
            <a href="#socials" class="nav-item">因缘往来</a>
        </div>
    </div>

<script>
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d', { alpha: false });
    let w, h, cx, cy;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cx = w / 2; cy = h / 2;
    }
    window.addEventListener('resize', resize);
    resize();

    const sim = {
        phase: 1, time: 0,
        orbitRadius: Math.max(w, h) * 0.7,
        coreSize: 0, particles: [],
        bgColor: '#0A0A0F'
    };

    const colors = { yang: '#FF461F', yin: '#101419', gold: '#EACD76', paper: '#F4F4EC' };

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 25 + 5;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            this.size = Math.random() * 3 + 0.5;
            this.color = color;
            this.life = 1.0;
            this.decay = Math.random() * 0.01 + 0.005;
            this.friction = 0.94;
        }
        update() {
            this.vx *= this.friction; this.vy *= this.friction;
            this.x += this.vx; this.y += this.vy;
            this.life -= this.decay;
        }
        draw(ctx) {
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }

    const trails = { yang: [], yin: [] };

    function render() {
        ctx.globalAlpha = sim.phase === 4 ? 1.0 : 0.18;
        ctx.fillStyle = sim.bgColor;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1.0;
        sim.time += 0.025;

        if (sim.phase <= 2) {
            // 物理优化：引入流体扰动方程
            const radiusNoise = Math.sin(sim.time * 2) * 20; 
            const angleYang = sim.time * 2.8;
            const angleYin = angleYang + Math.PI;
            const r = sim.orbitRadius + radiusNoise;

            const yX = cx + Math.cos(angleYang) * r;
            const yY = cy + Math.sin(angleYang) * r * 0.5 + Math.cos(sim.time * 1.5) * 40;
            trails.yang.push({x: yX, y: yY});
            
            const iX = cx + Math.cos(angleYin) * r;
            const iY = cy + Math.sin(angleYin) * r * 0.5 - Math.cos(sim.time * 1.5) * 40;
            trails.yin.push({x: iX, y: iY});

            if (trails.yang.length > 50) trails.yang.shift();
            if (trails.yin.length > 50) trails.yin.shift();

            const drawTrail = (trail, color, blur) => {
                if (trail.length < 2) return;
                ctx.beginPath(); ctx.moveTo(trail[0].x, trail[0].y);
                for(let i=1; i<trail.length; i++) {
                    const xc = (trail[i].x + trail[i-1].x) / 2;
                    const yc = (trail[i].y + trail[i-1].y) / 2;
                    ctx.quadraticCurveTo(trail[i-1].x, trail[i-1].y, xc, yc);
                }
                ctx.strokeStyle = color; ctx.lineWidth = 2.5;
                ctx.shadowBlur = blur; ctx.shadowColor = color;
                ctx.stroke(); ctx.shadowBlur = 0;
            };
            drawTrail(trails.yang, colors.yang, 20);
            drawTrail(trails.yin, colors.yin, 5);
        }

        if (sim.phase >= 3) {
            if (sim.coreSize > 0) {
                ctx.beginPath(); ctx.arc(cx, cy, sim.coreSize, 0, Math.PI * 2);
                ctx.fillStyle = colors.gold; ctx.shadowBlur = 60;
                ctx.shadowColor = colors.gold; ctx.fill(); ctx.shadowBlur = 0;
            }
            for (let i = sim.particles.length - 1; i >= 0; i--) {
                const p = sim.particles[i]; p.update(); p.draw(ctx);
                if (p.life <= 0) sim.particles.splice(i, 1);
            }
        }
        requestAnimationFrame(render);
    }
    render();

    const tl = gsap.timeline({ delay: 0.8 });
    tl.to(sim, { phase: 2, orbitRadius: 0, duration: 4.8, ease: "power4.in" });
    tl.add(() => { sim.phase = 3; trails.yang = []; trails.yin = []; });
    tl.to(sim, { coreSize: 55, duration: 0.18, ease: "expo.out" });
    tl.add(() => {
        for(let i=0; i<200; i++) {
            sim.particles.push(new Particle(cx, cy, i % 6 === 0 ? colors.yang : colors.gold));
        }
    });
    tl.to(sim, { coreSize: 0, duration: 0.45, ease: "power2.in" });
    tl.to("#flash", { opacity: 1, duration: 0.08 }, "-=0.4");
    tl.to(sim, { bgColor: colors.paper, duration: 0 }, "-=0.32");
    tl.to("#paper-texture", { opacity: 0.4, duration: 2 }, "-=0.32"); // 宣纸纹理显现
    tl.to("#flash", { opacity: 0, duration: 1.5, ease: "power2.out" });
    
    tl.to("svg.logo-text", { opacity: 1, duration: 0.1 }, "-=1.2");
    tl.to("svg.logo-text text", { strokeDashoffset: 0, duration: 3.2, ease: "expo.inOut" }, "-=1.2");
    tl.to("svg.logo-text text", { fill: "var(--color-yin)", stroke: "rgba(16,20,25,0.2)", duration: 2.5 }, "-=1.8");
    tl.to(".matrix-nav", { opacity: 1, y: -20, duration: 2, ease: "power2.out", stagger: 0.3 }, "-=2.0");
</script>
</body>
</html>`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};
