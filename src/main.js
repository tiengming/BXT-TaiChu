import { Cosmogony } from './cosmogony.js';
import portalData from './portal-data.json';

document.addEventListener('DOMContentLoaded', () => {
    const cosmogony = new Cosmogony('canvas-container');

    const logo = document.getElementById('logo');
    if (logo) {
        logo.innerHTML = `<span class="logo-text">${portalData.brand}</span>`;
        logo.style.opacity = '0';
    }

    const navMatrix = document.querySelector('.nav-matrix');
    if (navMatrix) {
        portalData.navigation.forEach(item => {
            const a = document.createElement('a');
            a.href = item.url;
            a.className = 'nav-item';
            a.innerHTML = `<span class="nav-text">${item.name}</span>`;
            a.style.opacity = '0';
            a.style.transform = 'translateY(20px)';

            a.addEventListener('mouseenter', () => {
                a.style.color = item.hoverColor;
                a.style.borderColor = item.hoverColor;
            });

            a.addEventListener('mouseleave', () => {
                a.style.color = '';
                a.style.borderColor = '';
            });

            // Click ripple effect
            a.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = `${e.offsetX}px`;
                ripple.style.top = `${e.offsetY}px`;
                a.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });

            navMatrix.appendChild(a);
        });
    }

    const timeline = cosmogony.start();

    timeline.to(logo, { opacity: 1, duration: 2, ease: "power2.out" });
    timeline.to('.nav-item', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=1");
});
