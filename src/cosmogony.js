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
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);

        this.initBackground();

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onMouseMove(e) {
        this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initBackground() {
        const geometry = new THREE.PlaneGeometry(30, 30);
        this.bgUniforms = {
            uTime: { value: 0 },
            uMode: { value: 0.0 },
            uMouse: { value: new THREE.Vector2(0, 0) }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: this.bgUniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform float uMode;
                uniform vec2 uMouse;
                varying vec2 vUv;

                float rand(vec2 n) {
                    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
                }

                float noise(vec2 p) {
                    vec2 ip = floor(p);
                    vec2 u = fract(p);
                    u = u*u*(3.0-2.0*u);
                    float res = mix(
                        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
                    return res*res;
                }

                void main() {
                    vec2 p = vUv * 3.0;
                    float n = noise(p + uTime * 0.05);

                    vec3 dark = vec3(0.086, 0.094, 0.137);
                    vec3 light = vec3(0.945, 0.945, 0.945);
                    vec3 baseColor = mix(dark, light, uMode);

                    // Ink dispersion logic
                    float dist = distance(vUv, uMouse * 0.5 + 0.5);
                    float inkFlow = uMode * (1.0 - smoothstep(0.0, 0.5, dist)) * 0.03;

                    float detailNoise = uMode * noise(p * 5.0 - uTime * 0.2) * 0.02;
                    vec3 finalColor = baseColor + n * 0.02 - inkFlow - detailNoise;

                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });

        this.bgMesh = new THREE.Mesh(geometry, material);
        this.bgMesh.position.z = -2;
        this.scene.add(this.bgMesh);
    }

    initChaos() {
        const starGeo = new THREE.BufferGeometry();
        const starPos = [];
        for (let i = 0; i < 2000; i++) {
            starPos.push(THREE.MathUtils.randFloatSpread(20), THREE.MathUtils.randFloatSpread(20), THREE.MathUtils.randFloatSpread(10));
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
        this.starsMat = new THREE.PointsMaterial({ color: 0x4B0082, size: 0.02, transparent: true, opacity: 0 });
        this.stars = new THREE.Points(starGeo, this.starsMat);
        this.scene.add(this.stars);
        gsap.to(this.starsMat, { opacity: 0.4, duration: 3 });
    }

    createFluidRibbon(color, isTop) {
        const points = [];
        for (let i = 0; i <= 60; i++) {
            points.push(new THREE.Vector3(0, isTop ? 10 : -10, 0));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 120, 0.03, 8, false);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
        const ribbon = new THREE.Mesh(geo, mat);
        ribbon.userData.points = points.map(p => p.clone());
        ribbon.userData.isTop = isTop;
        return ribbon;
    }

    initDuality() {
        this.yangRibbon = this.createFluidRibbon(0xFF461F, true);
        this.yinRibbon = this.createFluidRibbon(0x232021, false);
        this.scene.add(this.yangRibbon, this.yinRibbon);
        gsap.to([this.yangRibbon.material, this.yinRibbon.material], { opacity: 0.8, duration: 2 });
    }

    initBigBang() {
        const geo = new THREE.SphereGeometry(0.1, 32, 32);
        const mat = new THREE.MeshBasicMaterial({ color: 0xEACD76, transparent: true, opacity: 0 });
        this.goldCore = new THREE.Mesh(geo, mat);
        this.scene.add(this.goldCore);

        const burstGeo = new THREE.BufferGeometry();
        const burstPos = [];
        for (let i = 0; i < 1500; i++) burstPos.push(0,0,0);
        burstGeo.setAttribute('position', new THREE.Float32BufferAttribute(burstPos, 3));
        this.burstMat = new THREE.PointsMaterial({ color: 0xEACD76, size: 0.04, transparent: true, opacity: 0 });
        this.burst = new THREE.Points(burstGeo, this.burstMat);
        this.scene.add(this.burst);
    }

    updateRibbons(time) {
        [this.yangRibbon, this.yinRibbon].forEach(ribbon => {
            if (!ribbon || !ribbon.visible) return;
            const pts = ribbon.userData.points;
            const newPoints = [];
            this.mouse.lerp(this.targetMouse, 0.05);
            for (let i = 0; i < pts.length; i++) {
                const p = pts[i].clone();
                const progress = i / pts.length;
                const amp = 0.4 * Math.sin(time + progress * 4);
                p.x += Math.sin(time * 1.5 + progress * 8) * amp;
                p.z += Math.cos(time * 1.5 + progress * 8) * amp;
                const mouseWorld = new THREE.Vector3(this.mouse.x * 5, this.mouse.y * 5, 0);
                const dist = p.distanceTo(mouseWorld);
                if (dist < 2) {
                    const force = (2 - dist) / 2;
                    const dir = p.clone().sub(mouseWorld).normalize();
                    p.add(dir.multiplyScalar(force * 0.5));
                }
                newPoints.push(p);
            }
            const newCurve = new THREE.CatmullRomCurve3(newPoints);
            ribbon.geometry.dispose();
            ribbon.geometry = new THREE.TubeGeometry(newCurve, 120, 0.03, 8, false);
        });
    }

    render() {
        requestAnimationFrame(() => this.render());
        const time = this.clock.getElapsedTime();
        if (this.bgUniforms) {
            this.bgUniforms.uTime.value = time;
            this.bgUniforms.uMouse.value.copy(this.mouse);
        }
        if (this.stars) this.stars.rotation.y += 0.0005;
        this.updateRibbons(time);
        if (this.burst && this.burst.visible) {
            this.burst.geometry.attributes.position.needsUpdate = true;
        }
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.render();
        const mainTl = gsap.timeline();
        mainTl.add(() => this.initChaos());
        mainTl.to({}, { duration: 2 });
        mainTl.add(() => this.initDuality());

        const convergence = { val: 0 };
        mainTl.to(convergence, {
            val: 1,
            duration: 6,
            ease: "power2.inOut",
            onUpdate: () => {
                const v = convergence.val;
                [this.yangRibbon, this.yinRibbon].forEach(ribbon => {
                    if (!ribbon) return;
                    const pts = ribbon.userData.points;
                    const isTop = ribbon.userData.isTop;
                    pts.forEach((p, i) => {
                        const targetY = (i / pts.length - 0.5) * 3;
                        const startY = isTop ? 10 - i * 0.1 : -10 + i * 0.1;
                        p.y = startY + (targetY - startY) * v;
                    });
                });
            }
        });

        mainTl.add(() => this.initBigBang());
        mainTl.to(this.goldCore.material, { opacity: 1, duration: 0.5 });
        mainTl.to(this.goldCore.position, {
            x: 0.05, y: 0.05, duration: 0.05, repeat: 10, yoyo: true
        });

        mainTl.to(this.goldCore.scale, { x: 100, y: 100, z: 100, duration: 0.5, ease: "expo.in" });
        mainTl.to(this.bgUniforms.uMode, { value: 1.0, duration: 0.3, ease: "power2.out" }, "-=0.3");

        mainTl.add(() => {
            document.body.classList.add('paper-mode');
            if (this.stars) this.stars.visible = false;
            if (this.yangRibbon) this.yangRibbon.visible = false;
            if (this.yinRibbon) this.yinRibbon.visible = false;
            this.goldCore.visible = false;
            this.burstMat.opacity = 1;
        });

        const pos = this.burst.geometry.attributes.position.array;
        for (let i = 0; i < pos.length; i += 3) {
            mainTl.to(pos, {
                [i]: (Math.random() - 0.5) * 30,
                [i+1]: (Math.random() - 0.5) * 30,
                [i+2]: (Math.random() - 0.5) * 30,
                duration: 2,
                ease: "expo.out"
            }, "-=0.5");
        }
        mainTl.to(this.burstMat, { opacity: 0, duration: 1 }, "-=1");

        return mainTl;
    }
}
