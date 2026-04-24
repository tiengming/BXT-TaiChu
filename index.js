
const PENTAD_MAP = {
  "东风解冻": {
    "name": "东风解冻",
    "color": "#E0F0E9",
    "phrase": "立春初候，万物复苏"
  },
  "蛰虫始振": {
    "name": "蛰虫始振",
    "color": "#C0D9D9",
    "phrase": "立春二候，生机微动"
  },
  "鱼陟负冰": {
    "name": "鱼陟负冰",
    "color": "#A1C6C8",
    "phrase": "立春三候，阳气转达"
  },
  "獭祭鱼": {
    "name": "獭祭鱼",
    "color": "#B7D1CF",
    "phrase": "雨水初候，候鸟思归"
  },
  "候雁北": {
    "name": "候雁北",
    "color": "#87BFA2",
    "phrase": "雨水二候，鸿雁北飞"
  },
  "草木萌动": {
    "name": "草木萌动",
    "color": "#A8D8B9",
    "phrase": "雨水三候，春意渐浓"
  },
  "桃始华": {
    "name": "桃始华",
    "color": "#FFB7C5",
    "phrase": "惊蛰初候，桃花始开"
  },
  "仓庚鸣": {
    "name": "仓庚鸣",
    "color": "#FAD0C9",
    "phrase": "惊蛰二候，黄鹂鸣柳"
  },
  "鹰化为鸠": {
    "name": "鹰化为鸠",
    "color": "#E97692",
    "phrase": "惊蛰三候，春雷震响"
  },
  "玄鸟至": {
    "name": "玄鸟至",
    "color": "#EF82A0",
    "phrase": "春分初候，燕子归来"
  },
  "雷乃发声": {
    "name": "雷乃发声",
    "color": "#F3A694",
    "phrase": "春分二候，雷动九天"
  },
  "始电": {
    "name": "始电",
    "color": "#A1AF9D",
    "phrase": "春分三候，电光流转"
  },
  "桐始华": {
    "name": "桐始华",
    "color": "#B8D200",
    "phrase": "清明初候，桐花盛放"
  },
  "田鼠化为鴽": {
    "name": "田鼠化为鴽",
    "color": "#90B44B",
    "phrase": "清明二候，阴气渐消"
  },
  "虹始见": {
    "name": "虹始见",
    "color": "#6A8372",
    "phrase": "清明三候，彩虹初现"
  },
  "萍始生": {
    "name": "萍始生",
    "color": "#4F726C",
    "phrase": "谷雨初候，浮萍生长"
  },
  "鸣鸠拂其羽": {
    "name": "鸣鸠拂其羽",
    "color": "#2E5C5E",
    "phrase": "谷雨二候，布谷声声"
  },
  "戴胜降于桑": {
    "name": "戴胜降于桑",
    "color": "#1B4332",
    "phrase": "谷雨三候，桑蚕待吐"
  },
  "蝼蝈鸣": {
    "name": "蝼蝈鸣",
    "color": "#FADAD8",
    "phrase": "立夏初候，夏虫始鸣"
  },
  "蚯蚓出": {
    "name": "蚯蚓出",
    "color": "#F0A7A0",
    "phrase": "立夏二候，大地湿润"
  },
  "王瓜生": {
    "name": "王瓜生",
    "color": "#E96D71",
    "phrase": "立夏三候，蔓藤攀缘"
  },
  "苦菜秀": {
    "name": "苦菜秀",
    "color": "#D8302F",
    "phrase": "小满初候，苦菜繁茂"
  },
  "靡草死": {
    "name": "靡草死",
    "color": "#C93756",
    "phrase": "小满二候，喜阴草枯"
  },
  "麦秋至": {
    "name": "麦秋至",
    "color": "#A61B29",
    "phrase": "小满三候，麦收在望"
  },
  "螳螂生": {
    "name": "螳螂生",
    "color": "#8C1C13",
    "phrase": "芒种初候，螳螂破茧"
  },
  "鵙始鸣": {
    "name": "鵙始鸣",
    "color": "#F28E1C",
    "phrase": "芒种二候，伯劳啼鸣"
  },
  "反舌无声": {
    "name": "反舌无声",
    "color": "#EB7A77",
    "phrase": "芒种三候，百舌静止"
  },
  "鹿角解": {
    "name": "鹿角解",
    "color": "#F2A0A1",
    "phrase": "夏至初候，阳极阴生"
  },
  "蜩始鸣": {
    "name": "蜩始鸣",
    "color": "#EF928F",
    "phrase": "夏至二候，蝉鸣深树"
  },
  "半夏生": {
    "name": "半夏生",
    "color": "#C04851",
    "phrase": "夏至三候，良药而生"
  },
  "温风至": {
    "name": "温风至",
    "color": "#B93A26",
    "phrase": "小暑初候，热浪袭来"
  },
  "蟋蟀居壁": {
    "name": "蟋蟀居壁",
    "color": "#A7535A",
    "phrase": "小暑二候，蟋蟀避热"
  },
  "鹰始挚": {
    "name": "鹰始挚",
    "color": "#813C3C",
    "phrase": "小暑三候，老鹰盘旋"
  },
  "腐草为萤": {
    "name": "腐草为萤",
    "color": "#F47983",
    "phrase": "大暑初候，萤火微光"
  },
  "土润溽暑": {
    "name": "土润溽暑",
    "color": "#F9906F",
    "phrase": "大暑二候，湿热蒸腾"
  },
  "大雨时行": {
    "name": "大雨时行",
    "color": "#D25116",
    "phrase": "大暑三候，骤雨初歇"
  },
  "凉风至": {
    "name": "凉风至",
    "color": "#F8F4ED",
    "phrase": "立秋初候，暑气渐消"
  },
  "白露降": {
    "name": "白露降",
    "color": "#EEE6D8",
    "phrase": "立秋二候，晨露初凝"
  },
  "寒蝉鸣": {
    "name": "寒蝉鸣",
    "color": "#DED0B6",
    "phrase": "立秋三候，秋蝉哀婉"
  },
  "鹰乃祭鸟": {
    "name": "鹰乃祭鸟",
    "color": "#B99C6B",
    "phrase": "处暑初候，万物收敛"
  },
  "天地始肃": {
    "name": "天地始肃",
    "color": "#8C7042",
    "phrase": "处暑二候，肃杀之气"
  },
  "禾乃登": {
    "name": "禾乃登",
    "color": "#F9D3E3",
    "phrase": "处暑三候，五谷丰登"
  },
  "鸿雁来": {
    "name": "鸿雁来",
    "color": "#EACD76",
    "phrase": "白露初候，雁阵南翔"
  },
  "玄鸟归": {
    "name": "玄鸟归",
    "color": "#D58A46",
    "phrase": "白露二候，燕子南飞"
  },
  "群鸟养羞": {
    "name": "群鸟养羞",
    "color": "#B47131",
    "phrase": "白露三候，众鸟储食"
  },
  "雷始收声": {
    "name": "雷始收声",
    "color": "#8A5D2D",
    "phrase": "秋分初候，惊雷不再"
  },
  "蛰虫坯户": {
    "name": "蛰虫坯户",
    "color": "#6B4E24",
    "phrase": "秋分二候，虫入地中"
  },
  "水始涸": {
    "name": "水始涸",
    "color": "#F2EADA",
    "phrase": "秋分三候，降水骤减"
  },
  "鸿雁来宾": {
    "name": "鸿雁来宾",
    "color": "#E9D7C3",
    "phrase": "寒露初候，宾雁齐至"
  },
  "雀入大水为蛤": {
    "name": "雀入大水为蛤",
    "color": "#D4A373",
    "phrase": "寒露二候，海市蜃楼"
  },
  "菊有黄华": {
    "name": "菊有黄华",
    "color": "#B08D57",
    "phrase": "寒露三候，菊花金黄"
  },
  "豺乃祭兽": {
    "name": "豺乃祭兽",
    "color": "#8F7647",
    "phrase": "霜降初候，豺狼捕食"
  },
  "草木黄落": {
    "name": "草木黄落",
    "color": "#6D5E3B",
    "phrase": "霜降二候，落叶飘零"
  },
  "蛰虫咸俯": {
    "name": "蛰虫咸俯",
    "color": "#4B4630",
    "phrase": "霜降三候，昆虫冬眠"
  },
  "水始冰": {
    "name": "水始冰",
    "color": "#344352",
    "phrase": "立冬初候，凝水成冰"
  },
  "地始冻": {
    "name": "地始冻",
    "color": "#1E2732",
    "phrase": "立冬二候，土木封冻"
  },
  "雉入大水为蜃": {
    "name": "雉入大水为蜃",
    "color": "#10151D",
    "phrase": "立冬三候，大蛤隐现"
  },
  "虹藏不见": {
    "name": "虹藏不见",
    "color": "#0A0A0F",
    "phrase": "小雪初候，彩虹消隐"
  },
  "天气上升地气下降": {
    "name": "天气上升地气下降",
    "color": "#2C3E50",
    "phrase": "小雪二候，阴阳不交"
  },
  "闭塞而成冬": {
    "name": "闭塞而成冬",
    "color": "#1A1A1A",
    "phrase": "小雪三候，严冬已至"
  },
  "鹖鴠不鸣": {
    "name": "鹖鴠不鸣",
    "color": "#353535",
    "phrase": "大雪初候，寒鸟噤声"
  },
  "虎始交": {
    "name": "虎始交",
    "color": "#4A4A4A",
    "phrase": "大雪二候，猛虎寻偶"
  },
  "荔挺出": {
    "name": "荔挺出",
    "color": "#5F5F5F",
    "phrase": "大雪三候，马蔺萌发"
  },
  "蚯蚓结": {
    "name": "蚯蚓结",
    "color": "#747474",
    "phrase": "冬至初候，万象更新"
  },
  "麋角解": {
    "name": "麋角解",
    "color": "#898989",
    "phrase": "冬至二候，鹿角脱脱"
  },
  "水泉动": {
    "name": "水泉动",
    "color": "#9E9E9E",
    "phrase": "冬至三候，泉水涌动"
  },
  "雁北乡": {
    "name": "雁北乡",
    "color": "#B3B3B3",
    "phrase": "小寒初候，大雁北归"
  },
  "鹊始巢": {
    "name": "鹊始巢",
    "color": "#C8C8C8",
    "phrase": "小寒二候，喜鹊筑巢"
  },
  "雉始雊": {
    "name": "雉始雊",
    "color": "#DDDDDD",
    "phrase": "小寒三候，山鸡啼鸣"
  },
  "鸡始乳": {
    "name": "鸡始乳",
    "color": "#F2F2F2",
    "phrase": "大寒初候，幼鸡破壳"
  },
  "征鸟厉疾": {
    "name": "征鸟厉疾",
    "color": "#FFFFFF",
    "phrase": "大寒二候，猛禽巡猎"
  },
  "水泽腹坚": {
    "name": "水泽腹坚",
    "color": "#E6E1D5",
    "phrase": "大寒三候，厚冰载途"
  }
};

export default {
  async fetch(request, env, ctx) {
    const cf = request.cf || {};
    const userLocation = {
      lat: cf.latitude || 36.25,
      lon: cf.longitude || 117.10,
      city: cf.city || "泰安"
    };

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>卜仙堂 · 时空共鸣</title>
    <link rel="icon" type="image/svg+xml" href="https://svg.buxiantang.top/images/originFavicon.svg">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --theme-color: #C93756;
            --ink-depth: #1E2732;
            --paper-color: #F2EFE8;
            --paper-dark: #E6E1D5;
            --blur-strength: 0px;
            --shadow-intensity: 12px;
            --night-opacity: 0;
            --vignette-opacity: 0.04;
            --color-paper: var(--paper-color);
            --color-paper-dark: var(--paper-dark);
            --color-yang: var(--theme-color);
            --color-amber: #D58A46;
            --color-ink: var(--ink-depth);
            --color-footer: #7D8B99;
            --nav-gap: clamp(24px, 5vw, 48px);
            --social-gap: clamp(20px, 5vw, 36px);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body, html {
            width: 100%; height: 100%;
            overflow: hidden;
            background: radial-gradient(circle at 50% 35%, var(--color-paper) 0%, var(--color-paper-dark) 100%);
            font-family: "STKaiti", "KaiTi", "Songti SC", "Noto Serif SC", serif;
            -webkit-font-smoothing: antialiased;
            cursor: none;
        }

        .bg-texture {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            background-repeat: repeat;
            opacity: var(--vignette-opacity);
            pointer-events: none;
            z-index: 1;
            filter: blur(var(--blur-strength));
            transition: filter 1.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        body::after {
            content: '';
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #000;
            opacity: var(--night-opacity);
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: multiply;
            transition: opacity 2s ease;
        }

        #status-bar {
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            letter-spacing: 2px;
            color: var(--color-ink);
            opacity: 0;
            z-index: 10;
            display: flex;
            gap: 20px;
            transition: opacity 1s 1s;
        }

        #cursor-dot {
            position: fixed;
            top: 0; left: 0;
            width: 8px; height: 8px;
            background-color: var(--color-yang);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, background-color 0.3s, border 0.3s;
            mix-blend-mode: multiply;
        }

        #cursor-trail {
            position: fixed;
            top: 0; left: 0;
            width: 30px; height: 30px;
            border: 1px solid var(--theme-color);
            opacity: 0.15;
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
            justify-content: center;
            align-items: center;
            padding-bottom: 5vh;
            z-index: 5;
        }

        .content-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0;
        }

        .logo-text {
            font-size: clamp(48px, 12vw, 84px);
            font-weight: bold;
            color: var(--color-ink);
            margin-bottom: 32px;
            letter-spacing: 4px;
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

        .nav-item:hover {
            color: var(--color-yang);
            opacity: 1;
            letter-spacing: 6px;
            transform: translateY(-2px);
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
            text-decoration: none;
        }

        .social-icon:hover {
            color: var(--color-yang);
            opacity: 1;
            transform: scale(1.08) translateY(-2px);
        }

        .footer {
            position: absolute;
            bottom: clamp(20px, 5vh, 40px);
            color: var(--color-footer);
            font-size: clamp(10px, 3vw, 12px);
            letter-spacing: 4px;
            text-align: center;
            opacity: 0.6;
            transition: opacity 0.5s;
            width: 100%;
        }

        #ink-loader {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: var(--paper-color);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }

        .ink-spot {
            width: 0; height: 0;
            background: var(--theme-color);
            border-radius: 50%;
            filter: blur(50px);
            opacity: 0.4;
        }

        @media (max-width: 768px) {
            body, html { cursor: auto; }
            #cursor-dot, #cursor-trail { display: none; }
            .nav-item:hover { letter-spacing: 4px; transform: none; } 
        }
    </style>
</head>
<body>

<div id="ink-loader"><div class="ink-spot"></div></div>
<div class="bg-texture"></div>
<div id="status-bar"></div>

<div id="cursor-dot"></div>
<div id="cursor-trail"></div>

<div id="ui-layer">
    <div class="content-wrapper">
        <div class="logo-text">卜仙堂</div>
        <div class="matrix-nav">
            <a href="https://blog.buxiantang.top" class="nav-item">博客入口</a>
            <a href="https://anal.buxiantang.top/about" class="nav-item">经典解析</a>
            <a href="https://blog.buxiantang.top/about" class="nav-item">关于我</a>
        </div>
        <div class="social-row">
            <a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwNzY4NDU3Nw==#wechat_redirect" class="social-icon" target="_blank"><i class="fab fa-weixin"></i></a>
            <a href="https://space.bilibili.com/265656567" class="social-icon" target="_blank"><i class="fab fa-bilibili"></i></a>
            <a href="mailto:tiengming@qq.com" class="social-icon" target="_blank"><i class="fas fa-envelope"></i></a>
        </div>
    </div>
    <div class="footer" id="footer-text"><span>© 卜仙堂 · 道隐无名</span></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script type="module">
    import { SolarDay } from 'https://cdn.jsdelivr.net/npm/tyme4ts@1.4.6/dist/lib/index.mjs';

    const CONFIG = {
        DOJO_COORD: { lat: 36.25, lon: 117.10 },
        PENTAD_MAP: ${JSON.stringify(PENTAD_MAP)},
        USER_LOCATION: ${JSON.stringify(userLocation)}
    };

    const ThemeEngine = {
        init() {
            this.update();
            setInterval(() => this.update(), 3600000);
            this.startBreathing();
        },
        update() {
            const now = new Date();
            const info = this.getPentadInfo(now);
            const hour = now.getHours();

            let nightOpacity = 0;
            if (hour >= 18) nightOpacity = (hour - 18) / 6 * 0.4;
            else if (hour < 6) nightOpacity = (6 - hour) / 6 * 0.4;

            this.applyTheme(info.color, nightOpacity);
            this.updateStatusBar(info.name, info.phrase);
        },
        getPentadInfo(date) {
            try {
                const solarDay = SolarDay.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
                const pd = solarDay.getPhenologyDay();
                const pentad = pd.getPhenology();
                const name = pentad.getName();

                const pentadKeys = Object.keys(CONFIG.PENTAD_MAP);
                let currentIndex = pentadKeys.findIndex(k => name.includes(k) || k.includes(name));
                if (currentIndex === -1) currentIndex = 0;

                const currentPentad = CONFIG.PENTAD_MAP[pentadKeys[currentIndex]];
                const nextPentad = CONFIG.PENTAD_MAP[pentadKeys[(currentIndex + 1) % 72]];

                const dayInPentad = pd.getIndex();
                const progress = (dayInPentad - 1) / 5;

                const interpolatedColor = this.lerpColor(currentPentad.color, nextPentad.color, progress);

                return {
                    name: currentPentad.name,
                    phrase: currentPentad.phrase,
                    color: interpolatedColor
                };
            } catch (e) {
                console.error("Tyme engine error:", e);
            }
            return CONFIG.PENTAD_MAP["东风解冻"];
        },
        lerpColor(a, b, amount) {
            const ah = parseInt(a.replace(/#/g, ""), 16),
                  ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
                  bh = parseInt(b.replace(/#/g, ""), 16),
                  br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
                  rr = ar + amount * (br - ar),
                  rg = ag + amount * (bg - ag),
                  rb = ab + amount * (bb - ab);

            return "#" + ((1 << 24) + (Math.round(rr) << 16) + (Math.round(rg) << 8) + Math.round(rb)).toString(16).slice(1);
        },
        applyTheme(color, nightOpacity) {
            const root = document.documentElement;
            const rgb = this.hexToRgb(color);
            const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            const isDark = brightness < 128;
            const inkColor = isDark ? "#FFFFFF" : "#1E2732";

            gsap.to(root, {
                '--theme-color': color,
                '--night-opacity': nightOpacity,
                '--color-ink': inkColor,
                duration: 2.5,
                ease: "power2.inOut"
            });

            root.style.setProperty('--ink-contrast', isDark ? "0.1" : "0.04");
        },
        hexToRgb(hex) {
            const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 255, g: 255, b: 255 };
        },
        updateStatusBar(name, phrase) {
            const bar = document.getElementById('status-bar');
            if (bar) {
                bar.innerHTML = `<span>此间[${name}]</span><span>${phrase}</span>`;
                bar.style.opacity = 0.6;
            }
        },
        startBreathing() {
            gsap.to(document.documentElement, {
                '--vignette-opacity': 0.08,
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    };

    const PresenceEngine = {
        async init() {
            const pos = await this.getLocation();
            if (pos) {
                const dist = this.calculateDistance(pos.lat, pos.lon, CONFIG.DOJO_COORD.lat, CONFIG.DOJO_COORD.lon);
                this.updateUI(dist, pos.city);
            }
        },
        async getLocation() { return CONFIG.USER_LOCATION; },
        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            return 2 * R * Math.asin(Math.sqrt(a));
        },
        updateUI(dist, city) {
            const root = document.documentElement;
            const blur = Math.min(dist / 1000, 4);
            const shadow = Math.max(20 - (dist / 200), 4);

            gsap.to(root, {
                '--blur-strength': blur + 'px',
                '--shadow-intensity': shadow + 'px',
                duration: 3,
                ease: "power2.out"
            });

            const footer = document.getElementById('footer-text');
            if (footer) {
                footer.innerHTML = `<span>君在[${city}]，相距${Math.round(dist)}公里。© 卜仙堂 · 道隐无名</span>`;
            }
        }
    };

    const Interaction = {
        init() {
            this.setupCursor();
            this.setupLoading();
        },
        setupCursor() {
            const dot = document.getElementById('cursor-dot');
            const trail = document.getElementById('cursor-trail');
            let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
            let dotX = mouseX, dotY = mouseY;
            let trailX = mouseX, trailY = mouseY;

            if (window.matchMedia("(pointer: fine)").matches) {
                window.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });

                document.querySelectorAll('a').forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        gsap.to(dot, { scale: 3, backgroundColor: 'transparent', border: '1px solid var(--theme-color)', duration: 0.3 });
                        gsap.to(trail, { opacity: 0, duration: 0.3 });
                    });
                    el.addEventListener('mouseleave', () => {
                        gsap.to(dot, { scale: 1, backgroundColor: 'var(--theme-color)', border: 'none', duration: 0.3 });
                        gsap.to(trail, { opacity: 0.15, duration: 0.3 });
                    });
                });

                const render = () => {
                    dotX += (mouseX - dotX) * 0.25;
                    dotY += (mouseY - dotY) * 0.25;
                    dot.style.left = dotX + 'px';
                    dot.style.top = dotY + 'px';

                    trailX += (mouseX - trailX) * 0.1;
                    trailY += (mouseY - trailY) * 0.1;
                    trail.style.left = trailX + 'px';
                    trail.style.top = trailY + 'px';

                    requestAnimationFrame(render);
                };
                render();
            }
        },
        setupLoading() {
            const tl = gsap.timeline({
                onComplete: () => {
                    const wrapper = document.querySelector('.content-wrapper');
                    if (wrapper) wrapper.style.opacity = 1;
                    const loader = document.getElementById('ink-loader');
                    if (loader) loader.style.display = 'none';
                }
            });
            tl.to('.ink-spot', { width: '300vw', height: '300vw', opacity: 0, duration: 2.5, ease: "power2.inOut" })
              .to('#ink-loader', { opacity: 0, duration: 1 }, "-=1")
              .to('.content-wrapper', { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "-=1.5");

            setTimeout(() => {
                const loader = document.getElementById('ink-loader');
                if (loader && loader.style.display !== 'none') {
                    gsap.to('#ink-loader', { opacity: 0, duration: 0.5, onComplete: () => loader.style.display = 'none' });
                    gsap.to('.content-wrapper', { opacity: 1, y: 0, duration: 0.5 });
                }
            }, 5000);
        }
    };

    ThemeEngine.init();
    PresenceEngine.init();
    Interaction.init();
</script>

<noscript>
    <style>
        .content-wrapper { opacity: 1; transform: none; }
        body { cursor: auto; background: #F2EFE8; }
        #ink-loader, #cursor-dot, #cursor-trail { display: none; }
    </style>
</noscript>

</body>
</html>`;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};
