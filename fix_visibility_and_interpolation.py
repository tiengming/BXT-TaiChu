import re

with open("index.js", "r") as f:
    content = f.read()

# Fix setupLoading and add visibility safeguard
setup_loading_fix = """        setupLoading() {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.querySelector('.content-wrapper').style.opacity = 1;
                    document.getElementById('ink-loader').style.display = 'none';
                }
            });
            tl.to('.ink-spot', { width: '300vw', height: '300vw', opacity: 0, duration: 2.5, ease: "power2.inOut" })
              .to('#ink-loader', { opacity: 0, duration: 1 }, "-=1")
              .to('.content-wrapper', { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "-=1.5");

            // Safeguard: Force visibility after 5s if loader is still active
            setTimeout(() => {
                const loader = document.getElementById('ink-loader');
                if (loader && loader.style.display !== 'none') {
                    gsap.to('#ink-loader', { opacity: 0, duration: 0.5, onComplete: () => loader.style.display = 'none' });
                    gsap.to('.content-wrapper', { opacity: 1, y: 0, duration: 0.5 });
                }
            }, 5000);
        }"""

content = re.sub(r"setupLoading\(\) \{.*?\},", setup_loading_fix, content, flags=re.DOTALL)

# Update getPentadInfo to support daily interpolation
get_pentad_info_update = """        getPentadInfo(date) {
            try {
                const solarDay = SolarDay.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
                const pd = solarDay.getPhenologyDay();
                const pentad = pd.getPhenology();
                const name = pentad.getName();

                // Find current and next pentad
                const pentadKeys = Object.keys(CONFIG.PENTAD_MAP);
                let currentIndex = pentadKeys.findIndex(k => name.includes(k) || k.includes(name));
                if (currentIndex === -1) currentIndex = 0;

                const currentPentad = CONFIG.PENTAD_MAP[pentadKeys[currentIndex]];
                const nextPentad = CONFIG.PENTAD_MAP[pentadKeys[(currentIndex + 1) % 72]];

                // Calculate progress within the pentad (roughly 5 days)
                // We use pd.getDayIndex() which returns the index of the day within the pentad (1-5)
                const dayInPentad = pd.getIndex(); // 1 to 5
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
        },"""

content = re.sub(r"getPentadInfo\(date\) \{.*?\},", get_pentad_info_update, content, flags=re.DOTALL)

with open("index.js", "w") as f:
    f.write(content)
