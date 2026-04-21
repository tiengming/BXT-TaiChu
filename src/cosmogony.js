import * as THREE from 'three';
import gsap from 'gsap';

export class Cosmogony {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
        this.particles = null;
        this.yinRibbon = null;
        this.yangRibbon = null;
        this.goldCore = null;
        this.clock = new THREE.Clock();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initChaos() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 5000; i++) {
            vertices.push(
                THREE.MathUtils.randFloatSpread(20),
                THREE.MathUtils.randFloatSpread(20),
                THREE.MathUtils.randFloatSpread(20)
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({
            color: 0x4B0082,
            size: 0.05,
            transparent: true,
            opacity: 0.5
        });
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        gsap.to(material, {
            opacity: 0.8,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    createFluidRibbon(color, isTop) {
        const points = [];
        for (let i = 0; i <= 50; i++) {
            points.push(new THREE.Vector3(0, isTop ? 10 : -10, 0));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 100, 0.03, 8, false);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
        const ribbon = new THREE.Mesh(geo, mat);

        // Store original points for fluid animation
        ribbon.userData.originalPoints = points.map(p => p.clone());
        ribbon.userData.isTop = isTop;

        return ribbon;
    }

    initDuality() {
        this.yangRibbon = this.createFluidRibbon(0xFF461F, true);
        this.yinRibbon = this.createFluidRibbon(0x232021, false);
        this.scene.add(this.yangRibbon, this.yinRibbon);
    }

    updateRibbons(time) {
        [this.yangRibbon, this.yinRibbon].forEach(ribbon => {
            if (!ribbon) return;
            const points = ribbon.userData.originalPoints;
            const isTop = ribbon.userData.isTop;
            const newPoints = [];

            for (let i = 0; i < points.length; i++) {
                const p = points[i].clone();
                const progress = i / points.length;

                // Fluid motion: combine sine waves for organic feel
                const amp = 0.5 * Math.sin(time + progress * 5);
                const freq = 2;
                p.x += Math.sin(time * freq + progress * 10) * amp;
                p.z += Math.cos(time * freq + progress * 10) * amp;

                // Keep moving towards center
                newPoints.push(p);
            }

            const newCurve = new THREE.CatmullRomCurve3(newPoints);
            ribbon.geometry.dispose();
            ribbon.geometry = new THREE.TubeGeometry(newCurve, 100, 0.03, 8, false);
        });
    }

    initBigBang() {
        const geo = new THREE.SphereGeometry(0.1, 32, 32);
        const mat = new THREE.MeshBasicMaterial({ color: 0xEACD76, transparent: true, opacity: 0 });
        this.goldCore = new THREE.Mesh(geo, mat);
        this.scene.add(this.goldCore);
    }

    start() {
        this.render();
        const mainTl = gsap.timeline();

        // Phase 1: Chaos
        mainTl.add(() => this.initChaos());
        mainTl.to({}, { duration: 2 });

        // Phase 2: Duality (Converging fluid ribbons)
        mainTl.add(() => this.initDuality());

        // Custom animation for ribbon points convergence
        const convergence = { val: 0 };
        mainTl.to(convergence, {
            val: 1,
            duration: 6,
            ease: "power2.inOut",
            onUpdate: () => {
                const v = convergence.val;
                [this.yangRibbon, this.yinRibbon].forEach(ribbon => {
                    if (!ribbon) return;
                    const points = ribbon.userData.originalPoints;
                    const isTop = ribbon.userData.isTop;
                    points.forEach((p, i) => {
                        const targetY = (i / points.length - 0.5) * 4; // Spread around center
                        const startY = isTop ? 10 - i * 0.2 : -10 + i * 0.2;
                        p.y = startY + (targetY - startY) * v;
                    });
                });
            }
        });

        // Phase 3: Big Bang
        mainTl.add(() => this.initBigBang(), "-=1");
        mainTl.to(this.goldCore.material, { opacity: 1, duration: 1 });
        mainTl.to(this.goldCore.scale, { x: 80, y: 80, z: 80, duration: 0.8, ease: "expo.in" });
        mainTl.add(() => {
            document.body.classList.add('paper-mode');
            if (this.particles) this.particles.visible = false;
            if (this.yangRibbon) this.yangRibbon.visible = false;
            if (this.yinRibbon) this.yinRibbon.visible = false;
            if (this.goldCore) this.goldCore.visible = false;
        });

        // Phase 4: Manifestation
        mainTl.to({}, { duration: 0.5 });
        mainTl.add(() => {
            const overlay = document.getElementById('overlay');
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
            }
        });

        return mainTl;
    }

    render() {
        requestAnimationFrame(() => this.render());
        const time = this.clock.getElapsedTime();

        if (this.particles) this.particles.rotation.y += 0.001;
        this.updateRibbons(time);

        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}
