import { Cosmogony } from './cosmogony.js';
import portalData from './portal-data.json';

document.addEventListener('DOMContentLoaded', () => {
    const cosmogony = new Cosmogony('canvas-container');

    // Setup UI from JSON
    const logo = document.getElementById('logo');
    if (logo) logo.textContent = portalData.brand;

    const navMatrix = document.querySelector('.nav-matrix');
    if (navMatrix) {
        portalData.navigation.forEach(item => {
            const a = document.createElement('a');
            a.href = item.url;
            a.className = 'nav-item';
            a.textContent = item.name;
            a.title = item.description;

            a.addEventListener('mouseenter', () => {
                a.style.color = item.hoverColor;
                a.style.borderColor = item.hoverColor;
            });

            a.addEventListener('mouseleave', () => {
                a.style.color = '';
                a.style.borderColor = '';
            });

            navMatrix.appendChild(a);
        });
    }

    // Start the animation sequence
    cosmogony.start();
});
