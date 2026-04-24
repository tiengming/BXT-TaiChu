import re

with open("index.js", "r") as f:
    content = f.read()

# Completely replace Interaction object to ensure clean structure
interaction_block = """    const Interaction = {
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
    };"""

content = re.sub(r"const Interaction = \{.*?\};", interaction_block, content, flags=re.DOTALL)

with open("index.js", "w") as f:
    f.write(content)
