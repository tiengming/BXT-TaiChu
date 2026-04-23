export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>卜仙堂 · 道生万象</title>
    <link rel="icon" type="image/svg+xml" href="https://svg.buxiantang.top/images/originFavicon.svg">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            /* 传统色调：云白打底，边缘透出极淡的灰褐 */
            --color-paper: #F2EFE8;
            --color-paper-dark: #E6E1D5;
            /* 霁红：内敛的生机与阳气 */
            --color-yang: #C93756;
            /* 缃色：辅助的暖意 */
            --color-amber: #D58A46;
            /* 玄色：带温度的墨黑，不刺眼 */
            --color-ink: #1E2732;
            /* 远山灰：次要信息的隐退 */
            --color-footer: #7D8B99;
            --nav-gap: clamp(24px, 5vw, 48px);
            --social-gap: clamp(20px, 5vw, 36px);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body, html {
            width: 100%; height: 100%;
            overflow: hidden;
            /* 模拟宣纸的光晕感，中心微亮，四周沉静 */
            background: radial-gradient(circle at 50% 35%, var(--color-paper) 0%, var(--color-paper-dark) 100%);
            font-family: "STKaiti", "KaiTi", "Songti SC", "Noto Serif SC", serif;
            -webkit-font-smoothing: antialiased;
            /* PC端隐藏默认光标，为自定义朱砂点留白 */
            cursor: none;
        }

        /* 背景微弱的宣纸肌理（纯CSS实现） */
        .bg-texture {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.04"/></svg>');
            pointer-events: none;
            z-index: 0;
        }

        /* 自定义光标：朱砂游走 */
        #cursor-dot {
            position: fixed;
            top: 0; left: 0;
            width: 6px; height: 6px;
            background-color: var(--color-yang);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.15s ease-out, width 0.3s, height 0.3s, background-color 0.3s;
            mix-blend-mode: multiply;
        }

        /* 辅助光标：水墨晕染的拖尾 */
        #cursor-trail {
            position: fixed;
            top: 0; left: 0;
            width: 26px; height: 26px;
            border: 1px solid rgba(201, 55, 86, 0.25);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: transform 0.3s ease-out;
        }

        #ui-layer {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center; /* 居中排布，化解上部气结 */
            align-items: center;
            padding-bottom: 5vh; /* 微微上提，下方留出明堂 */
        }

        .content-wrapper {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            /* 页面加载时的从容浮现 */
            opacity: 0;
            animation: fadeIn 1.5s 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .logo-text {
            font-size: clamp(48px, 12vw, 84px);
            font-weight: bold;
            color: var(--color-ink);
            margin-bottom: 32px;
            letter-spacing: 4px;
            text-shadow: 2px 4px 12px rgba(0,0,0,0.05);
        }

        .matrix-nav {
            display: flex; flex-wrap: wrap;
            gap: var(--nav-gap);
            justify-content: center;
            margin-bottom: 32px;
        }

        .nav-item {
            color: var(--color-ink);
            font-size: clamp(20px, 5vw, 24px);
            letter-spacing: 4px;
            padding: 10px 0;
            opacity: 0.75;
            cursor: none; /* 沿用自定义光标 */
            /* 舒缓的呼吸感过渡，弃用生硬的匀速动画 */
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
            font-size: 20px;
            opacity: 0.4;
        }

        /* 悬停时的“吐故纳新” */
        .nav-item:hover {
            color: var(--color-yang);
            opacity: 1;
            letter-spacing: 6px; /* 字间距微扩，犹如思绪荡开 */
            transform: translateY(-2px);
            text-shadow: 0 4px 12px rgba(201, 55, 86, 0.15);
        }

        .social-row {
            display: flex; gap: var(--social-gap);
            justify-content: center;
            margin-top: 10px;
        }

        .social-icon {
            color: var(--color-amber);
            font-size: clamp(24px, 5vw, 30px);
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            opacity: 0.7;
            cursor: none;
            text-decoration: none;
        }

        .social-icon:hover {
            color: var(--color-yang);
            opacity: 1;
            transform: scale(1.08) translateY(-2px);
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.06));
        }

        .footer {
            position: absolute;
            bottom: clamp(20px, 5vh, 40px);
            color: var(--color-footer);
            font-size: clamp(10px, 3vw, 12px);
            letter-spacing: 6px;
            text-align: center;
            opacity: 0.6;
            transition: opacity 0.5s;
        }

        .footer:hover { opacity: 0.9; }

        /* 移动端降级处理：触屏无鼠标，回归本源 */
        @media (max-width: 768px) {
            body, html { cursor: auto; }
            #cursor-dot, #cursor-trail { display: none; }
            .nav-item, .social-icon { cursor: pointer; }
            /* 移动端减弱位移动效，防止排版抖动 */
            .nav-item:hover { letter-spacing: 4px; transform: none; } 
        }
    </style>
</head>
<body>

<div class="bg-texture"></div>

<div id="cursor-dot"></div>
<div id="cursor-trail"></div>

<div id="ui-layer">
    <div class="content-wrapper">
        <div class="logo-text">卜仙堂</div>
        <div class="matrix-nav">
            <a href="https://blog.buxiantang.top" class="nav-item" id="nav-blog">博客入口</a>
            <a href="https://anal.buxiantang.top/about" class="nav-item" id="nav-classics">经典解析</a>
            <a href="https://blog.buxiantang.top/about" class="nav-item" id="nav-about">关于我</a>
        </div>
        <div class="social-row">
            <a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwNzY4NDU3Nw==#wechat_redirect" class="social-icon" target="_blank"><i class="fab fa-weixin"></i></a>
            <a href="https://space.bilibili.com/265656567" class="social-icon" target="_blank"><i class="fab fa-bilibili"></i></a>
            <a href="mailto:tiengming@qq.com" class="social-icon" target="_blank"><i class="fas fa-envelope"></i></a>
        </div>
    </div>
    <div class="footer"><span>© 卜仙堂 · 道隐无名</span></div>
</div>

<script>
    // 光标游走逻辑：模拟研墨提笔时的涩滞与从容
    const dot = document.getElementById('cursor-dot');
    const trail = document.getElementById('cursor-trail');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let trailX = mouseX, trailY = mouseY;

    // 仅在支持精细指针的设备（PC端）启用此阵法
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 识别导航阵眼，落笔加重
        const interactables = document.querySelectorAll('a');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
                dot.style.backgroundColor = 'var(--color-ink)'; // 聚气成墨
                trail.style.borderColor = 'transparent';
            });
            el.addEventListener('mouseleave', () => {
                dot.style.transform = 'translate(-50%, -50%) scale(1)';
                dot.style.backgroundColor = 'var(--color-yang)'; // 散气化朱砂
                trail.style.borderColor = 'rgba(201, 55, 86, 0.25)';
            });
        });

        function render() {
            // 朱砂点紧随心念
            dotX += (mouseX - dotX) * 0.35;
            dotY += (mouseY - dotY) * 0.35;
            dot.style.left = dotX + 'px';
            dot.style.top = dotY + 'px';

            // 晕染圈稍作迟疑，留下余韵
            trailX += (mouseX - trailX) * 0.12;
            trailY += (mouseY - trailY) * 0.12;
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';

            requestAnimationFrame(render);
        }
        render();
    }
</script>
</body>
</html>`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};
