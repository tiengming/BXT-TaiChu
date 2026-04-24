import re

with open("index.js", "r") as f:
    content = f.read()

# The previous re.sub might have failed or duplicated due to complex structure.
# Let s rewrite the whole <script type="module"> block to be safe.
script_start = '<script type="module">'
script_end = '</script>'

match = re.search(f"{script_start}(.*?){script_end}", content, re.DOTALL)
if match:
    # Build the desired script content
    new_script_content = f"""
    import {{ SolarDay }} from 'https://cdn.jsdelivr.net/npm/tyme4ts@1.4.6/dist/lib/index.mjs';

    const CONFIG = {{
        DOJO_COORD: {{ lat: 36.25, lon: 117.10 }},
        PENTAD_MAP: ${{JSON.stringify(PENTAD_MAP)}},
        USER_LOCATION: {{
            lat: request.cf?.latitude || 36.25,
            lon: request.cf?.longitude || 117.10,
            city: request.cf?.city || "泰安"
        }}
    }};

    const ThemeEngine = {{
        init() {{
            this.update();
            setInterval(() => this.update(), 3600000);
            this.startBreathing();
        }},
        update() {{
            const now = new Date();
            const info = this.getPentadInfo(now);
            const hour = now.getHours();

            let nightOpacity = 0;
            if (hour >= 18) nightOpacity = (hour - 18) / 6 * 0.4;
            else if (hour < 6) nightOpacity = (6 - hour) / 6 * 0.4;

            this.applyTheme(info.color, nightOpacity);
            this.updateStatusBar(info.name, info.phrase);
        }},
        getPentadInfo(date) {{
            try {{
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

                return {{
                    name: currentPentad.name,
                    phrase: currentPentad.phrase,
                    color: interpolatedColor
                }};
            }} catch (e) {{
                console.error("Tyme engine error:", e);
            }}
            return CONFIG.PENTAD_MAP["东风解冻"];
        }},
        lerpColor(a, b, amount) {{
            const ah = parseInt(a.replace(/#/g, ""), 16),
                  ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
                  bh = parseInt(b.replace(/#/g, ""), 16),
                  br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
                  rr = ar + amount * (br - ar),
                  rg = ag + amount * (bg - ag),
                  rb = ab + amount * (bb - ab);

            return "#" + ((1 << 24) + (Math.round(rr) << 16) + (Math.round(rg) << 8) + Math.round(rb)).toString(16).slice(1);
        }},
        applyTheme(color, nightOpacity) {{
            const root = document.documentElement;
            const rgb = this.hexToRgb(color);
            const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            const isDark = brightness < 128;
            const inkColor = isDark ? "#FFFFFF" : "#1E2732";

            gsap.to(root, {{
                '--theme-color': color,
                '--night-opacity': nightOpacity,
                '--color-ink': inkColor,
                duration: 2.5,
                ease: "power2.inOut"
            }});

            root.style.setProperty('--ink-contrast', isDark ? "0.1" : "0.04");
        }},
        hexToRgb(hex) {{
            const result = /^#?([a-f\\\\d]{{2}})([a-f\\\\d]{{2}})([a-f\\\\d]{{2}})$/i.exec(hex);
            return result ? {{
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }} : {{ r: 255, g: 255, b: 255 }};
        }},
        updateStatusBar(name, phrase) {{
            const bar = document.getElementById('status-bar');
            if (bar) {{
                bar.innerHTML = `<span>此间[${{name}}]</span><span>${{phrase}}</span>`;
                bar.style.opacity = 0.6;
            }}
        }},
        startBreathing() {{
            gsap.to(document.documentElement, {{
                '--vignette-opacity': 0.08,
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            }});
        }}
    }};

    const PresenceEngine = {{
        async init() {{
            const pos = await this.getLocation();
            if (pos) {{
                const dist = this.calculateDistance(pos.lat, pos.lon, CONFIG.DOJO_COORD.lat, CONFIG.DOJO_COORD.lon);
                this.updateUI(dist, pos.city);
            }}
        }},
        async getLocation() {{ return CONFIG.USER_LOCATION; }},
        calculateDistance(lat1, lon1, lat2, lon2) {{
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            return 2 * R * Math.asin(Math.sqrt(a));
        }},
        updateUI(dist, city) {{
            const root = document.documentElement;
            const blur = Math.min(dist / 1000, 4);
            const shadow = Math.max(20 - (dist / 200), 4);

            gsap.to(root, {{
                '--blur-strength': blur + 'px',
                '--shadow-intensity': shadow + 'px',
                duration: 3,
                ease: "power2.out"
            }});

            const footer = document.getElementById('footer-text');
            if (footer) {{
                footer.innerHTML = `<span>君在[${{city}}]，相距${{Math.round(dist)}}公里。© 卜仙堂 · 道隐无名</span>`;
            }}
        }}
    }};

    const Interaction = {{
        init() {{
            this.setupCursor();
            this.setupLoading();
        }},
        setupCursor() {{
            const dot = document.getElementById('cursor-dot');
            const trail = document.getElementById('cursor-trail');
            let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
            let dotX = mouseX, dotY = mouseY;
            let trailX = mouseX, trailY = mouseY;

            if (window.matchMedia("(pointer: fine)").matches) {{
                window.addEventListener('mousemove', (e) => {{
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                }});

                document.querySelectorAll('a').forEach(el => {{
                    el.addEventListener('mouseenter', () => {{
                        gsap.to(dot, {{ scale: 3, backgroundColor: 'transparent', border: '1px solid var(--theme-color)', duration: 0.3 }});
                        gsap.to(trail, {{ opacity: 0, duration: 0.3 }});
                    }});
                    el.addEventListener('mouseleave', () => {{
                        gsap.to(dot, {{ scale: 1, backgroundColor: 'var(--theme-color)', border: 'none', duration: 0.3 }});
                        gsap.to(trail, {{ opacity: 0.15, duration: 0.3 }});
                    }});
                }});

                const render = () => {{
                    dotX += (mouseX - dotX) * 0.25;
                    dotY += (mouseY - dotY) * 0.25;
                    dot.style.left = dotX + 'px';
                    dot.style.top = dotY + 'px';

                    trailX += (mouseX - trailX) * 0.1;
                    trailY += (mouseY - trailY) * 0.1;
                    trail.style.left = trailX + 'px';
                    trail.style.top = trailY + 'px';

                    requestAnimationFrame(render);
                }};
                render();
            }}
        }},
        setupLoading() {{
            const tl = gsap.timeline({{
                onComplete: () => {{
                    const wrapper = document.querySelector('.content-wrapper');
                    if (wrapper) wrapper.style.opacity = 1;
                    const loader = document.getElementById('ink-loader');
                    if (loader) loader.style.display = 'none';
                }}
            }});
            tl.to('.ink-spot', {{ width: '300vw', height: '300vw', opacity: 0, duration: 2.5, ease: "power2.inOut" }})
              .to('#ink-loader', {{ opacity: 0, duration: 1 }}, "-=1")
              .to('.content-wrapper', {{ opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }}, "-=1.5");

            setTimeout(() => {{
                const loader = document.getElementById('ink-loader');
                if (loader && loader.style.display !== 'none') {{
                    gsap.to('#ink-loader', {{ opacity: 0, duration: 0.5, onComplete: () => loader.style.display = 'none' }});
                    gsap.to('.content-wrapper', {{ opacity: 1, y: 0, duration: 0.5 }});
                }}
            }}, 5000);
        }}
    }};

    ThemeEngine.init();
    PresenceEngine.init();
    Interaction.init();
    """

    new_content = content[:match.start()] + script_start + new_script_content + script_end + content[match.end():]

    with open("index.js", "w") as f:
        f.write(new_content)
