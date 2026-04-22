var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
var index_default = {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>\u535C\u4ED9\u5802 \xB7 \u9053\u751F\u4E07\u8C61</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        /* ===== \u7528\u6237\u914D\u7F6E\u533A ===== */
        :root {
            --color-void: #0a0a0f;
            --color-paper: #EEDEB0;
            --color-yang: #FF461F;
            --color-yin: #344352;
            --color-gold: #EACD76;
            --color-amber: #CA6924;
            --color-ink: #232021;
            --color-footer: #4A3F3A;

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

        #canvas-container { position: relative; width: 100%; height: 100%; }

        canvas {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
        }

        #bg-canvas { z-index: 1; }
        #texture-canvas {
            z-index: 2;
            pointer-events: none;
            mix-blend-mode: multiply;
            opacity: 0.15;
        }
        #particle-canvas { z-index: 3; }
        #ink-overlay {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none; z-index: 4;
        }

        /* UI \u5C42\uFF1A\u6700\u9AD8\u5C42\u7EA7 */
        #ui-layer {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 100;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .matrix-nav {
            display: flex; flex-wrap: wrap;
            gap: var(--nav-gap);
            justify-content: center;
            opacity: 0; pointer-events: none;
            margin-bottom: var(--content-gap);
            margin-top: 100px;
        }

        .nav-item {
            color: var(--color-ink);
            font-size: clamp(18px, 5vw, 24px);
            letter-spacing: clamp(4px, 2vw, 8px);
            padding: 8px 0;
            pointer-events: auto;
            opacity: 0.85;
            cursor: pointer;
            transition: all 0.3s;
            text-shadow: 1px 1px 3px rgba(255,255,240,0.8);
            white-space: nowrap;
            position: relative;
            text-decoration: none;
        }

        .nav-item:not(:last-child)::after {
            content: '\xB7';
            position: absolute;
            right: calc(-1 * var(--nav-gap) / 2);
            top: 50%;
            transform: translate(50%, -50%);
            color: var(--color-amber);
            font-size: 20px;
            opacity: 0.5;
        }

        .nav-item:hover {
            color: var(--color-yang); opacity: 1;
            transform: translateY(-3px);
        }

        .social-row {
            display: flex; gap: var(--social-gap);
            justify-content: center;
            opacity: 0; pointer-events: none;
            margin-bottom: calc(var(--content-gap) * 0.8);
        }

        .social-icon {
            color: var(--color-amber);
            font-size: clamp(24px, 7vw, 32px);
            pointer-events: auto;
            transition: all 0.3s;
            opacity: 0.75;
            text-decoration: none;
        }

        .social-icon:hover {
            color: var(--color-yang); opacity: 1;
            transform: scale(1.1) translateY(-3px);
        }

        .footer {
            color: var(--color-footer);
            font-size: clamp(10px, 3vw, 13px);
            letter-spacing: 4px;
            opacity: 0;
            text-align: center;
            pointer-events: none;
            transition: opacity 1.5s;
        }

        #audio-prompt {
            position: absolute; bottom: 20px; left: 20px;
            color: var(--color-amber); font-size: 12px;
            opacity: 0.5; z-index: 101; pointer-events: none;
        }

        @media (max-width: 600px) {
            .nav-item:not(:last-child)::after { font-size: 16px; }
            .matrix-nav { margin-top: 60px; }
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
        <a href="#" class="nav-item" id="nav-blog">\u535A\u5BA2\u5165\u53E3</a>
        <a href="#" class="nav-item" id="nav-classics">\u7ECF\u5178\u89E3\u6790</a>
        <a href="#" class="nav-item" id="nav-socials">\u5173\u4E8E\u6211</a>
    </div>
    <div class="social-row">
        <a href="#" class="social-icon" id="social-wechat" target="_blank"><i class="fab fa-weixin"></i></a>
        <a href="#" class="social-icon" id="social-bilibili" target="_blank"><i class="fab fa-bilibili"></i></a>
        <a href="#" class="social-icon" id="social-email" target="_blank"><i class="fas fa-envelope"></i></a>
    </div>
    <div class="footer"><span>\xA9 \u535C\u4ED9\u5802 \xB7 \u9053\u9690\u65E0\u540D</span></div>
</div>
<div id="audio-prompt">\u26B2 \u8F7B\u89E6\u95FB\u9053</div>

<script>
(function(){
    "use strict";

    const CONFIG = {
        MAX_PARTICLES: 4000,
        PARTICLE_SPEED: { yang: 18, yin: 10, gold: 6 },
        DECAY: { min: 0.004, max: 0.012 },
        TEXT_STEP: 1,
        MAX_TRAIL: 45,
        LORENZ: { sigma: 10, rho: 28, beta: 8/3, dt: 0.012 },
        AUDIO: { freq: 42, dur: 2.5, vol: 0.02 },
        INK: { life: 0.9, radius: 2, prob: 0.25 },
        MAIN_TEXT: '\u535C\u4ED9\u5802',
        FONT_BASE: 52,
        LINKS: {
            blog: 'https://blog.buxiantang.top', classics: 'https://anal.buxiantang.top/about', socials: 'https://blog.buxiantang.top/about',
            wechat: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwNzY4NDU3Nw==#wechat_redirect', bilibili: 'https://space.bilibili.com/429714179', email: 'mailto:tiengming@qq.com'
        }
    };

    document.getElementById('nav-blog').href = CONFIG.LINKS.blog;
    document.getElementById('nav-classics').href = CONFIG.LINKS.classics;
    document.getElementById('nav-socials').href = CONFIG.LINKS.socials;
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
        void: '#0a0a0f', paper: '#EEDEB0', yang: '#FF461F', yin: '#344352',
        gold: '#EACD76', amber: '#CA6924'
    };

    const sim = {
        phase: 0, time: 0, orbitRadius: 0, coreSize: 0,
        bgColor: COLORS.void, lx: 0.1, ly: 0, lz: 0, textSolidified: false
    };

    const particles = [];
    const trails = { yang: [], yin: [] };
    let textTargetPoints = [];

    function generateTexture() {
        const tw = textureCanvas.width, th = textureCanvas.height;
        if (!tw || !th) return;
        const img = texCtx.createImageData(tw, th);
        const d = img.data;
        for (let i=0; i<d.length; i+=4) {
            const x = (i/4)%tw, y = Math.floor(i/4/tw);
            const v = Math.floor(((Math.sin(x*0.02)*Math.cos(y*0.02) + Math.sin(x*0.05+1)*Math.cos(y*0.05)*0.5 + Math.sin(x*0.1)*Math.cos(y*0.1)*0.2)*0.5+0.5)*30) + 225;
            d[i]=d[i+1]=d[i+2]=v; d[i+3]=255;
        }
        texCtx.putImageData(img, 0, 0);
    }

    function computeTextPoints() {
        const baseW = 400, baseH = 200;
        const off = new OffscreenCanvas(baseW, baseH);
        const octx = off.getContext('2d');
        octx.font = "italic " + CONFIG.FONT_BASE + "px 'Huayan Shoujin', 'STSong', 'FangSong', 'Songti SC', serif";
        octx.textAlign = "center"; octx.textBaseline = "middle";
        octx.fillStyle = "#fff";
        octx.fillText(CONFIG.MAIN_TEXT, baseW/2, baseH/2);
        const img = octx.getImageData(0,0,baseW,baseH);
        const pts = [];
        const step = CONFIG.TEXT_STEP;
        for (let y=0; y<baseH; y+=step) {
            for (let x=0; x<baseW; x+=step) {
                if (img.data[(y*baseW+x)*4] > 128) {
                    const nx = (x/baseW)-0.5, ny = (y/baseH)-0.5;
                    pts.push({ nx, ny });
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
            this.size=type===2?1.2:(2.2+Math.random()*2.5);
            this.life=1;
            this.decay=CONFIG.DECAY.min+Math.random()*(CONFIG.DECAY.max-CONFIG.DECAY.min);
            if(type===2){
                this.target=textTargetPoints.length ? textTargetPoints[Math.floor(Math.random()*textTargetPoints.length)] : null;
                this.settled=false;
            }
        }
        update() {
            if(this.type===2 && !this.settled) {
                if(this.target) {
                    const tx = cx + this.target.nx * Math.min(w,h)*0.82;
                    const ty = cy + this.target.ny * Math.min(w,h)*0.4 - 100;
                    const dx=tx-this.x, dy=ty-this.y;
                    if(Math.hypot(dx,dy)<2.0) { this.settled=true; this.vx=this.vy=0; }
                    else { this.vx+=dx*0.022; this.vy+=dy*0.022; }
                }
            }
            this.vx*=0.95; this.vy*=0.95;
            this.x+=this.vx; this.y+=this.vy;

            // Phase 3 \u4E4B\u540E\u52A0\u5FEB\u975E\u6587\u5B57\u7C92\u5B50\u7684\u6D88\u5931
            if(sim.phase >= 3 && this.type !== 2) {
                this.life -= 0.05;
            } else if(this.type!==2||!this.settled) {
                this.life-=this.decay;
            } else {
                this.life=0.95;
            }
        }
        draw(ctx) {
            if(this.life<=0.01) return;
            ctx.globalAlpha=this.life*(this.type===1?0.8:1);
            let c=this.type===0?COLORS.yang:(this.type===1?COLORS.yin:COLORS.gold);
            ctx.fillStyle=c;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size*(0.7+0.3*Math.sin(sim.time*4+this.x)),0,2*Math.PI);
            ctx.fill();
            if(this.type===2){ ctx.shadowBlur=10; ctx.shadowColor=COLORS.amber; ctx.fill(); ctx.shadowBlur=0; }
        }
    }

    function updateTrails() {
        const {sigma, rho, beta, dt} = CONFIG.LORENZ;
        const dx=sigma*(sim.ly-sim.lx)*dt, dy=(sim.lx*(rho-sim.lz)-sim.ly)*dt, dz=(sim.lx*sim.ly-beta*sim.lz)*dt;
        sim.lx+=dx; sim.ly+=dy; sim.lz+=dz;
        const s=Math.min(w,h)*0.016;
        trails.yang.push({x:cx+sim.lx*s, y:cy+sim.ly*s});
        trails.yin.push({x:cx-sim.ly*s*0.75, y:cy-sim.lx*s*0.75});
        if(trails.yang.length>CONFIG.MAX_TRAIL) trails.yang.shift();
        if(trails.yin.length>CONFIG.MAX_TRAIL) trails.yin.shift();
    }

    function drawTrail(t, base, glow, blur) {
        if(t.length<2) return;
        pCtx.beginPath(); pCtx.moveTo(t[0].x,t[0].y);
        for(let i=1;i<t.length;i++) {
            const xc=(t[i].x+t[i-1].x)/2, yc=(t[i].y+t[i-1].y)/2;
            pCtx.quadraticCurveTo(t[i-1].x,t[i-1].y,xc,yc);
        }
        pCtx.strokeStyle=base; pCtx.lineWidth=2.8; pCtx.shadowBlur=blur; pCtx.shadowColor=glow; pCtx.stroke();
        pCtx.shadowBlur=0;
    }

    const inkDrops=[];
    function drawInk() {
        inkCtx.clearRect(0,0,w,h);
        for(let i=inkDrops.length-1;i>=0;i--) {
            const d=inkDrops[i]; d.radius+=1.8; d.life-=0.015;
            if(d.life<=0){ inkDrops.splice(i,1); continue; }
            const g=inkCtx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.radius);
            g.addColorStop(0,'rgba(35,32,33,'+d.life*0.2+')'); g.addColorStop(1,'rgba(35,32,33,0)');
            inkCtx.fillStyle=g; inkCtx.beginPath(); inkCtx.arc(d.x,d.y,d.radius,0,2*Math.PI); inkCtx.fill();
        }
    }

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
            drawTrail(trails.yin, COLORS.yin, '#6A7A8C', 14);
        } else if (sim.phase >= 2) {
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
                if (particles[i].life <= 0.01) particles.splice(i,1);
            }
        }

        drawInk();
        requestAnimationFrame(render);
    }

    function startAnim() {
        const tl = gsap.timeline({ delay:0.5 });
        tl.set(sim, { phase:1, bgColor:COLORS.void });
        tl.to(sim, { orbitRadius:0, duration:5.2, ease:"power3.in" });
        tl.add(()=>{ sim.phase=2; trails.yang=[]; trails.yin=[]; sim.coreSize=4; });
        tl.to(sim, { coreSize:48, duration:0.25, ease:"expo.out" });
        tl.add(()=>{ for(let i=0;i<1200;i++) particles.push(new Particle(cx,cy,i%3)); });
        tl.to(sim, { coreSize:0, duration:0.55, ease:"power2.in" });
        tl.to(sim, { bgColor:COLORS.paper, duration:1.8 }, "-=0.3");
        tl.add(()=>{ sim.phase=3; }, "-=0.6");
        tl.add(()=>{ for(let i=0;i<1000;i++) particles.push(new Particle(cx,cy,2)); }, "+=0.3");
        tl.add(()=>{ sim.textSolidified=true; }, "+=2.0");
        tl.fromTo(".matrix-nav", { opacity:0, y:15 }, { opacity:1, y:0, duration:1.2, stagger:0.1 }, "-=1.0");
        tl.fromTo(".social-row", { opacity:0, y:15 }, { opacity:1, y:0, duration:1.2 }, "-=0.8");
        tl.to(".footer", { opacity:0.8, duration:1.8 }, "-=1.2");
    }

    function resize() {
        w=bgCanvas.width=particleCanvas.width=textureCanvas.width=inkCanvas.width=window.innerWidth;
        h=bgCanvas.height=particleCanvas.height=textureCanvas.height=inkCanvas.height=window.innerHeight;
        cx=w/2; cy=h/2;
        generateTexture();
        computeTextPoints();
        for(let p of particles) {
            if(p.type === 2) {
                p.settled = false;
                p.target = textTargetPoints[Math.floor(Math.random()*textTargetPoints.length)];
            }
        }
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
        if(sim.phase<3) return;
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
<\/script>
</body>
</html>`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};

// ../home/jules/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../home/jules/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-XaY8uI/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = index_default;

// ../home/jules/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-XaY8uI/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
