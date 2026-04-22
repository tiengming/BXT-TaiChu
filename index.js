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
            --color-void: #0A0A0F;   /* 极渊黑 */
            --color-paper: #F4F4EC;  /* 缟羽宣纸色 */
            --color-yang: #FF461F;   /* 朱砂 */
            --color-yin: #101419;    /* 浓墨 */
            --color-gold: #EACD76;   /* 黄金 */
        }

        body, html {
            margin: 0; padding: 0; width: 100%; height: 100%;
            overflow: hidden;
            background-color: var(--color-void);
            font-family: "STKaiti", "KaiTi", "Songti SC", serif; /* 强调东方韵味的楷体/宋体 */
            transition: background-color 0.1s; /* 由 JS 精准控制 */
        }

        /* 渲染主舞台 */
        #stage {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%; z-index: 1;
        }

        /* 创世闪光（视网膜残留效果） */
        #flash {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            background: #FFFFFF;
            opacity: 0; pointer-events: none;
            z-index: 5;
        }

        /* UI 与 文字层 */
        #ui-layer {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10; text-align: center;
            pointer-events: none;
            mix-blend-mode: multiply; /* 让文字与背景产生水墨交融感 */
        }

        /* 卜仙堂 SVG 描边文字 (模拟书法顿挫) */
        svg.logo-text {
            width: 360px; height: 140px; opacity: 0;
            filter: drop-shadow(0px 4px 12px rgba(234, 205, 118, 0.3));
        }
        
        svg.logo-text text {
            font-size: 84px; font-weight: normal; letter-spacing: 8px;
            fill: transparent;
            stroke: var(--color-gold);
            stroke-width: 1.5px;
            stroke-dasharray: 600; stroke-dashoffset: 600;
        }

        /* 极简导航矩阵 */
        .matrix-nav {
            margin-top: 50px; display: flex; gap: 40px;
            justify-content: center; opacity: 0;
        }

        .nav-item {
            color: var(--color-yin);
            text-decoration: none; font-size: 16px;
            letter-spacing: 4px; position: relative;
            padding-bottom: 8px; pointer-events: auto;
            transition: color 0.4s ease, transform 0.4s ease;
            opacity: 0.8;
        }

        /* 交互美学：悬停时底部的金线不仅延伸，且带有呼吸感 */
        .nav-item::after {
            content: ''; position: absolute;
            bottom: 0; left: 50%; width: 0; height: 1px;
            background-color: var(--color-yang);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); /* 柔和阻尼曲线 */
            transform: translateX(-50%);
        }

        .nav-item:hover { color: var(--color-yang); opacity: 1; transform: translateY(-2px); }
        .nav-item:hover::after { width: 100%; height: 2px; box-shadow: 0 0 8px var(--color-yang); }

    </style>
</head>
<body>

    <div id="flash"></div>
    <canvas id="stage"></canvas>

    <div id="ui-layer">
        <svg class="logo-text" viewBox="0 0 360 140">
            <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle">卜仙堂</text>
        </svg>

        <div class="matrix-nav">
            <a href="#blog" class="nav-item">博客入口</a>
            <a href="#classics" class="nav-item">经典解析</a>
            <a href="#socials" class="nav-item">社交媒体</a>
        </div>
    </div>

<script>
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d', { alpha: false }); // 关闭alpha提升渲染性能
    let w, h, cx, cy;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cx = w / 2; cy = h / 2;
    }
    window.addEventListener('resize', resize);
    resize();

    // 物理与状态引擎
    const sim = {
        phase: 1, // 1:混沌 2:螺旋化生 3:爆发 4:宁静
        time: 0,
        orbitRadius: Math.max(w, h) * 0.6, // 初始吸积盘半径
        coreSize: 0,
        particles: [],
        bgColor: '#0A0A0F' // 动态背景色
    };

    const colors = { yang: '#FF461F', yin: '#4A4C54', gold: '#EACD76', paper: '#F4F4EC' };

    // 高性能粒子类 (物理学阻尼模型)
    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 20 + 10; // 初速度极快，模拟大爆炸
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            this.size = Math.random() * 2.5 + 1;
            this.color = color;
            this.life = 1.0;
            this.decay = Math.random() * 0.015 + 0.005;
            this.friction = 0.92; // 空间阻尼，让粒子迅速减速漂浮
        }
        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }
        draw(ctx) {
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 轨迹记忆（尾迹）
    const trails = { yang: [], yin: [] };
    const maxTrail = 40;

    function render() {
        // 使用填充覆盖实现残影效果 (Motion Blur)
        ctx.globalAlpha = sim.phase === 4 ? 1.0 : 0.15;
        ctx.fillStyle = sim.bgColor;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1.0;

        sim.time += 0.03;

        // 阶段 1 & 2: 阴阳螺旋坍缩
        if (sim.phase <= 2) {
            // 参数方程：随时间缩小的螺旋线
            const angleYang = sim.time * 2.5;
            const angleYin = angleYang + Math.PI; // 相差180度
            const currentR = sim.orbitRadius;

            // 天丝（阳）
            const yX = cx + Math.cos(angleYang) * currentR;
            const yY = cy + Math.sin(angleYang) * currentR * 0.6 + Math.sin(sim.time)*50; // 加入Z轴扰动
            trails.yang.push({x: yX, y: yY});
            
            // 地丝（阴）
            const iX = cx + Math.cos(angleYin) * currentR;
            const iY = cy + Math.sin(angleYin) * currentR * 0.6 - Math.sin(sim.time)*50;
            trails.yin.push({x: iX, y: iY});

            if (trails.yang.length > maxTrail) trails.yang.shift();
            if (trails.yin.length > maxTrail) trails.yin.shift();

            // 绘制带有发光效果的丝线
            const drawTrail = (trail, color, blur) => {
                if (trail.length < 2) return;
                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);
                for(let i=1; i<trail.length; i++) {
                    const xc = (trail[i].x + trail[i-1].x) / 2;
                    const yc = (trail[i].y + trail[i-1].y) / 2;
                    ctx.quadraticCurveTo(trail[i-1].x, trail[i-1].y, xc, yc);
                }
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.shadowBlur = blur;
                ctx.shadowColor = color;
                ctx.stroke();
                ctx.shadowBlur = 0;
            };

            drawTrail(trails.yang, colors.yang, 15);
            drawTrail(trails.yin, colors.yin, 5); // 阴线光晕较弱，偏厚重
        }

        // 阶段 3 & 4: 爆炸与宁静期
        if (sim.phase >= 3) {
            // 金丹
            if (sim.coreSize > 0) {
                ctx.beginPath();
                ctx.arc(cx, cy, sim.coreSize, 0, Math.PI * 2);
                ctx.fillStyle = colors.gold;
                ctx.shadowBlur = 40; ctx.shadowColor = colors.gold;
                ctx.fill(); ctx.shadowBlur = 0;
            }

            // 更新和绘制粒子
            for (let i = sim.particles.length - 1; i >= 0; i--) {
                const p = sim.particles[i];
                p.update();
                p.draw(ctx);
                if (p.life <= 0) sim.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(render);
    }

    render(); // 启动引擎

    /* =========================================
       时间轴编排 (The Chronology of Creation)
       ========================================= */
    const tl = gsap.timeline({ delay: 0.5 });

    // 1. 轨道坍缩，张力拉满 (Orbital Decay)
    tl.to(sim, { 
        phase: 2, 
        orbitRadius: 0, 
        duration: 4.5, 
        ease: "power3.in" // 越来越快的坠落感
    });

    // 2. 奇点结丹
    tl.add(() => { sim.phase = 3; trails.yang = []; trails.yin = []; });
    tl.to(sim, { coreSize: 40, duration: 0.15, ease: "expo.out" }); // 瞬间凝结
    
    // 3. 宇宙大爆炸 (The Big Bang)
    tl.add(() => {
        // 生成高能粒子群
        for(let i=0; i<150; i++) {
            sim.particles.push(new Particle(cx, cy, i % 5 === 0 ? colors.yang : colors.gold));
        }
    });
    
    // 金丹消散，释放能量
    tl.to(sim, { coreSize: 0, duration: 0.4, ease: "power2.in" });

    // 极强烈的视网膜闪光
    tl.to("#flash", { opacity: 1, duration: 0.05 }, "-=0.4");
    
    // 物理世界的规则重写：暗夜转为白昼（宣纸）
    tl.to(sim, { bgColor: colors.paper, duration: 0 }, "-=0.35");
    tl.to("#flash", { opacity: 0, duration: 1.2, ease: "power2.out" });

    // 4. 真名显现 (Manifestation)
    tl.add(() => { sim.phase = 4; }, "-=0.5");
    tl.to("svg.logo-text", { opacity: 1, duration: 0.1 }, "-=1.0");
    
    // 模拟毛笔运笔，采用 CustomEase 或缓动组合实现顿挫感
    tl.to("svg.logo-text text", { 
        strokeDashoffset: 0, 
        duration: 3.5, 
        ease: "power2.inOut" 
    }, "-=1.0");
    
    // 墨汁晕染：金丝转为浓墨
    tl.to("svg.logo-text text", { 
        fill: "var(--color-yin)", 
        stroke: "var(--color-yin)",
        filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))", // 褪去金色光晕
        duration: 2.0 
    }, "-=1.5");

    // 5. 矩阵落印
    tl.to(".matrix-nav", { 
        opacity: 1, 
        y: -15, 
        duration: 1.5, 
        ease: "power1.out",
        stagger: 0.2 // 图标依次浮现
    }, "-=2.0");

</script>
</body>
</html>`;
    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
};
