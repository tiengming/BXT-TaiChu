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
        this.explosionParticles = null;

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

    initDuality() {
        const yangPoints = [];
        for (let i = 0; i < 50; i++) {
            yangPoints.push(new THREE.Vector3(0, 10 - i * 0.4, 0));
        }
        const yangCurve = new THREE.CatmullRomCurve3(yangPoints);
        const yangGeo = new THREE.TubeGeometry(yangCurve, 64, 0.02, 8, false);
        const yangMat = new THREE.MeshBasicMaterial({ color: 0xFF461F });
        this.yangRibbon = new THREE.Mesh(yangGeo, yangMat);
        this.yangRibbon.position.y = 10;
        this.scene.add(this.yangRibbon);

        const yinPoints = [];
        for (let i = 0; i < 50; i++) {
            yinPoints.push(new THREE.Vector3(0, -10 + i * 0.4, 0));
        }
        const yinCurve = new THREE.CatmullRomCurve3(yinPoints);
        const yinGeo = new THREE.TubeGeometry(yinCurve, 64, 0.02, 8, false);
        const yinMat = new THREE.MeshBasicMaterial({ color: 0x232021 });
        this.yinRibbon = new THREE.Mesh(yinGeo, yinMat);
        this.yinRibbon.position.y = -10;
        this.scene.add(this.yinRibbon);
    }

    initBigBang() {
        const geo = new THREE.SphereGeometry(0.1, 32, 32);
        const mat = new THREE.MeshBasicMaterial({ color: 0xEACD76, transparent: true, opacity: 0 });
        this.goldCore = new THREE.Mesh(geo, mat);
        this.scene.add(this.goldCore);

        const expGeo = new THREE.BufferGeometry();
        const expPos = [];
        for (let i = 0; i < 1000; i++) {
            expPos.push(0, 0, 0);
        }
        expGeo.setAttribute('position', new THREE.Float32BufferAttribute(expPos, 3));
        const expMat = new THREE.PointsMaterial({ color: 0xEACD76, size: 0.05, transparent: true, opacity: 0 });
        this.explosionParticles = new THREE.Points(expGeo, expMat);
        this.scene.add(this.explosionParticles);
    }

    start() {
        this.render();
        const mainTl = gsap.timeline();

        // Phase 1: Chaos
        mainTl.add(() => this.initChaos());
        mainTl.to({}, { duration: 3 }); // Wait in chaos

        // Phase 2: Duality
        mainTl.add(() => this.initDuality());
        mainTl.to(this.yangRibbon.position, { y: 0, duration: 4, ease: "power2.inOut" }, "+=0");
        mainTl.to(this.yinRibbon.position, { y: 0, duration: 4, ease: "power2.inOut" }, "-=4");

        // Phase 3: Big Bang
        mainTl.add(() => this.initBigBang());
        mainTl.to(this.goldCore.material, { opacity: 1, duration: 1 });
        mainTl.to(this.goldCore.scale, { x: 50, y: 50, z: 50, duration: 0.5, ease: "expo.in" });
        mainTl.add(() => {
            document.body.classList.add('paper-mode');
            this.particles.visible = false;
            this.yangRibbon.visible = false;
            this.yinRibbon.visible = false;
            this.goldCore.visible = false;
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
        if (this.particles) this.particles.rotation.y += 0.001;
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}
