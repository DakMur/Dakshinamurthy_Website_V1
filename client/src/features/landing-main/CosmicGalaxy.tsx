import { useEffect, useRef, memo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { motion } from "motion/react";

interface GalaxyProps {
  isWarping: boolean;
  isExplore?: boolean;
  route?: string;
  activeTab?: string;
  isModalOpen?: boolean;
}

export default function CosmicGalaxy({ isWarping, isExplore = false, route, activeTab, isModalOpen = false }: GalaxyProps) {
  const currentTab = activeTab || route || 'landing';
  const isPaused =
    currentTab === 'tattva' ||
    currentTab === 'registration' ||
    window.location.pathname.includes('/tattva') ||
    window.location.pathname.includes('/registration') ||
    isModalOpen;

  const isSimulationActive = !isPaused;

  const isSimulationActiveRef = useRef(isSimulationActive);
  const startLoopRef = useRef<(() => void) | null>(null);
  const stopLoopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isSimulationActiveRef.current = isSimulationActive;
    if (isSimulationActive && startLoopRef.current) {
      startLoopRef.current();
    } else if (!isSimulationActive && stopLoopRef.current) {
      stopLoopRef.current();
    }
  }, [isSimulationActive]);

  const animTimeRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Base Setup
    const scene = new THREE.Scene();

    const parameters = {
      count: 140000,
      size: 0.035,
      radius: 11,
      branches: 3,
      spin: 0.9,
      randomnessPower: 1.8,
      insideColor: "#fffbe6",
      midColor: "#e07bc5",
      outsideColor: "#113cd6",
      rotationSpeed: 0.04,
    };

    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Standing Canvas Texture Generator
    const createCircleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d");
      if (!ctx) return null;

      ctx.clearRect(0, 0, 64, 64);

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(c);
      texture.flipY = false;
      texture.premultiplyAlpha = false;
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createCircleTexture();

    const randomNormal = () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    // 2. Galaxy Generation
    let galaxyGeometry: THREE.BufferGeometry | null = null;
    let galaxyMaterial: THREE.PointsMaterial | null = null;
    let galaxyPoints: THREE.Points | null = null;

    const generateGalaxy = () => {
      if (galaxyPoints !== null) {
        galaxyGeometry?.dispose();
        galaxyMaterial?.dispose();
        galaxyGroup.remove(galaxyPoints);
      }

      galaxyGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      const colorInside = new THREE.Color(parameters.insideColor);
      const colorMid = new THREE.Color(parameters.midColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius_i = Math.pow(Math.random(), parameters.randomnessPower) * parameters.radius;
        const spinAngle = radius_i * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const armX = Math.cos(branchAngle + spinAngle) * radius_i;
        const armZ = Math.sin(branchAngle + spinAngle) * radius_i;

        const centralBulge = Math.exp(-radius_i * 1.2) * 1.5;
        const scatterSpread = 0.4 * (radius_i * 0.15 + 0.2);

        const randomX = randomNormal() * (scatterSpread + centralBulge);
        const randomY = randomNormal() * (scatterSpread * 0.25 + centralBulge * 1.2);
        const randomZ = randomNormal() * (scatterSpread + centralBulge);

        positions[i3] = armX + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = armZ + randomZ;

        const mixedColor = colorInside.clone();
        const progress = radius_i / parameters.radius;

        if (progress < 0.2) {
          const normalizeCore = progress / 0.2;
          mixedColor.lerp(colorMid, normalizeCore);
        } else {
          const normalizeOuter = (progress - 0.2) / 0.8;
          mixedColor.copy(colorMid).lerp(colorOutside, normalizeOuter * 1.15);
        }

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        map: particleTexture,
      });

      galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
      galaxyGroup.add(galaxyPoints);
    };

    // 3. Ambient Stars (Twinkling using custom ShaderMaterial)
    let ambientStars: THREE.Points | null = null;
    let starsGeometry: THREE.BufferGeometry | null = null;
    let starsMaterial: THREE.ShaderMaterial | null = null;

    const generateAmbientStars = () => {
      const count = 1000;
      const radius = 40;

      starsGeometry = new THREE.BufferGeometry();
      const starsPositions = new Float32Array(count * 3);
      const speeds = new Float32Array(count);
      const phases = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starsPositions[i3 + 2] = radius * Math.cos(phi);

        speeds[i] = 0.35 + Math.random() * 0.65;
        phases[i] = Math.random() * Math.PI * 2;
      }

      starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3));
      starsGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
      starsGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

      starsMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: particleTexture },
        },
        vertexShader: `
          uniform float uTime;
          attribute float aSpeed;
          attribute float aPhase;
          varying float vAlpha;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (10.0 / -mvPosition.z) * (0.8 + 0.4 * sin(uTime * aSpeed * 1.5 + aPhase));
            vAlpha = 0.15 + 0.55 * (0.5 + 0.5 * sin(uTime * aSpeed + aPhase));
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying float vAlpha;
          void main() {
            vec4 texColor = texture(uTexture, gl_PointCoord);
            gl_FragColor = vec4(texColor.rgb, texColor.a * vAlpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
      });

      ambientStars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(ambientStars);
    };

    // 4. Floating Cosmic Dust (Drifting slowly, golden)
    let cosmicDust: THREE.Points | null = null;
    let dustGeometry: THREE.BufferGeometry | null = null;
    let dustMaterial: THREE.ShaderMaterial | null = null;

    const generateCosmicDust = () => {
      const count = 300;
      dustGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const directions = new Float32Array(count * 3);
      const phases = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 24;
        positions[i3 + 1] = (Math.random() - 0.5) * 24;
        positions[i3 + 2] = (Math.random() - 0.5) * 24;

        directions[i3] = (Math.random() - 0.3) * 0.4;
        directions[i3 + 1] = (Math.random() - 0.2) * 0.5;
        directions[i3 + 2] = (Math.random() - 0.5) * 0.4;

        phases[i] = Math.random() * Math.PI * 2;
      }

      dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      dustGeometry.setAttribute("aDirection", new THREE.BufferAttribute(directions, 3));
      dustGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

      dustMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: particleTexture },
        },
        vertexShader: `
          uniform float uTime;
          attribute vec3 aDirection;
          attribute float aPhase;
          varying float vAlpha;
          void main() {
            vec3 pos = position + aDirection * uTime * 0.08;
            pos.x = mod(pos.x + 12.0, 24.0) - 12.0;
            pos.y = mod(pos.y + 12.0, 24.0) - 12.0;
            pos.z = mod(pos.z + 12.0, 24.0) - 12.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (12.0 / -mvPosition.z);
            vAlpha = 0.22 * (0.5 + 0.5 * sin(uTime * 0.4 + aPhase));
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying float vAlpha;
          void main() {
            vec4 texColor = texture(uTexture, gl_PointCoord);
            gl_FragColor = vec4(vec3(0.85, 0.72, 0.4) * texColor.rgb, texColor.a * vAlpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
      });

      cosmicDust = new THREE.Points(dustGeometry, dustMaterial);
      scene.add(cosmicDust);
    };

    // 5. Micro Sparkles (Flashes on and off on the spiral arms)
    let microSparkles: THREE.Points | null = null;
    let sparklesGeometry: THREE.BufferGeometry | null = null;
    let sparklesMaterial: THREE.ShaderMaterial | null = null;

    const generateMicroSparkles = () => {
      const count = 120;
      sparklesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const phases = new Float32Array(count);
      const armAngles = new Float32Array(count);
      const radii = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = Math.pow(Math.random(), 1.5) * parameters.radius;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        radii[i] = radius;
        armAngles[i] = branchAngle;
        phases[i] = Math.random() * Math.PI * 2;

        positions[i3] = 0;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = 0;
      }

      sparklesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      sparklesGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
      sparklesGeometry.setAttribute("aArmAngle", new THREE.BufferAttribute(armAngles, 1));
      sparklesGeometry.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));

      sparklesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: particleTexture },
        },
        vertexShader: `
          uniform float uTime;
          attribute float aPhase;
          attribute float aArmAngle;
          attribute float aRadius;
          varying float vAlpha;
          void main() {
            float spin = aRadius * 0.9;
            float x = cos(aArmAngle + spin) * aRadius;
            float z = sin(aArmAngle + spin) * aRadius;
            
            x += sin(uTime * 1.5 + aPhase) * 0.2;
            z += cos(uTime * 1.5 + aPhase) * 0.2;
            
            vec4 mvPosition = modelViewMatrix * vec4(x, 0.0, z, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (16.0 / -mvPosition.z) * (0.6 + 0.4 * sin(uTime * 10.0 + aPhase));
            
            float pulse = sin(uTime * 5.0 + aPhase);
            if (pulse > 0.88) {
              vAlpha = (pulse - 0.88) / 0.12;
            } else {
              vAlpha = 0.0;
            }
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying float vAlpha;
          void main() {
            vec4 texColor = texture(uTexture, gl_PointCoord);
            gl_FragColor = vec4(vec3(1.0, 0.9, 0.6) * texColor.rgb, texColor.a * vAlpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
      });

      microSparkles = new THREE.Points(sparklesGeometry, sparklesMaterial);
      galaxyGroup.add(microSparkles);
    };

    generateGalaxy();
    generateAmbientStars();
    generateCosmicDust();
    generateMicroSparkles();

    // 6. Dimensions & Renderer Setup
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 4.0, 9.5);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(sizes.width, sizes.height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 2;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Avoid vertical jumps during mobile scrolling when address bar toggles
      if (sizes.width === newWidth && Math.abs(sizes.height - newHeight) < 120) {
        return;
      }

      sizes.width = newWidth;
      sizes.height = newHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // ONE-SHOT REDRAW: If paused, render exactly 1 frame to fit new zoom level
      // DO NOT start requestAnimationFrame loop
      if (!isSimulationActiveRef.current) {
        renderer.render(scene, camera);
      }
    };
    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    const clock = new THREE.Timer();

    let animationId: number | null = null;

    const tick = (timestamp: number = performance.now()) => {
      if (!isSimulationActiveRef.current) {
        animationId = null;
        return;
      }
      animationId = window.requestAnimationFrame(tick);
      
      // 1. UPDATE TIMER FIRST (Required for THREE.Timer)
      if (clock && typeof (clock as any).update === 'function') {
        (clock as any).update(timestamp);
      }

      const delta = clock.getDelta();

      // Fallback Safety: Use fixed ~60fps step if timer fails to return delta
      const safeDelta = Math.min(delta > 0 ? delta : 0.016, 0.033);
      animTimeRef.current += safeDelta;
      
      const elapsedTime = animTimeRef.current;

      if (starsMaterial) starsMaterial.uniforms.uTime.value = elapsedTime;
      if (dustMaterial) dustMaterial.uniforms.uTime.value = elapsedTime;
      if (sparklesMaterial) sparklesMaterial.uniforms.uTime.value = elapsedTime;

      if (galaxyMaterial) {
        galaxyMaterial.opacity = 0.6 + 0.16 * Math.sin(elapsedTime * (Math.PI * 2 / 14));
        galaxyMaterial.size = parameters.size * (0.92 + 0.08 * Math.sin(elapsedTime * (Math.PI * 2 / 14)));
      }

      const currentSpeed = isWarping ? parameters.rotationSpeed * 12 : parameters.rotationSpeed;
      galaxyGroup.rotation.y += safeDelta * currentSpeed;

      if (ambientStars) {
        ambientStars.rotation.y += safeDelta * currentSpeed * 0.35;
      }
      if (cosmicDust) {
        cosmicDust.rotation.y -= safeDelta * currentSpeed * 0.2;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    startLoopRef.current = () => {
      if (animationId === null) {
        clock.getDelta(); // reset clock delta to avoid huge jump
        tick();
      }
    };

    stopLoopRef.current = () => {
      if (animationId !== null) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
      }
      renderer.render(scene, camera);
    };

    tick();

    // Cleanup System
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId !== null) {
        window.cancelAnimationFrame(animationId);
      }
      controls.dispose();
      galaxyGeometry?.dispose();
      galaxyMaterial?.dispose();
      starsGeometry?.dispose();
      starsMaterial?.dispose();
      dustGeometry?.dispose();
      dustMaterial?.dispose();
      sparklesGeometry?.dispose();
      sparklesMaterial?.dispose();
      particleTexture?.dispose();
      renderer.dispose();
    };
  }, [isWarping]);

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] z-[-1] pointer-events-none overflow-hidden select-none bg-[#07070a]">
      {/* CSS Keyframes for travelling light and sequential ambient animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes tech-pcb-flow {
          0% { stroke-dashoffset: 80; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes tech-text-shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes tech-lotus-pulse {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1.0; }
        }
        /* Sequential joint activations for Robotic Arm */
        @keyframes tech-joint-base {
          0%, 100%, 35% { fill-opacity: 0.2; }
          17% { fill-opacity: 1.0; }
        }
        @keyframes tech-joint-elbow {
          0%, 100%, 17%, 68% { fill-opacity: 0.2; }
          50% { fill-opacity: 1.0; }
        }
        @keyframes tech-joint-wrist {
          0%, 100%, 50% { fill-opacity: 0.2; }
          83% { fill-opacity: 1.0; }
        }
        /* Sequential node activations for Neural Network & AI Head synapses */
        @keyframes tech-node-1 { 0%, 100%, 20% { opacity: 0.45; } 10% { opacity: 1.0; } }
        @keyframes tech-node-2 { 0%, 100%, 10%, 30% { opacity: 0.45; } 20% { opacity: 1.0; } }
        @keyframes tech-node-3 { 0%, 100%, 15%, 35% { opacity: 0.45; } 25% { opacity: 1.0; } }
        @keyframes tech-node-4 { 0%, 100%, 30%, 50% { opacity: 0.45; } 40% { opacity: 1.0; } }
        @keyframes tech-node-5 { 0%, 100%, 45%, 65% { opacity: 0.45; } 55% { opacity: 1.0; } }
        @keyframes tech-node-6 { 0%, 100%, 55%, 75% { opacity: 0.45; } 65% { opacity: 1.0; } }
        @keyframes tech-node-7 { 0%, 100%, 40%, 60% { opacity: 0.45; } 50% { opacity: 1.0; } }
        @keyframes tech-node-8 { 0%, 100%, 25%, 45% { opacity: 0.45; } 35% { opacity: 1.0; } }
        /* Staggered flickers for binary digits */
        @keyframes tech-binary-1 { 0%, 100%, 15% { opacity: 0.55; } 7% { opacity: 1.0; } }
        @keyframes tech-binary-2 { 0%, 100%, 30% { opacity: 0.55; } 18% { opacity: 1.0; } }
        @keyframes tech-binary-3 { 0%, 100%, 45% { opacity: 0.55; } 33% { opacity: 1.0; } }
        @keyframes tech-binary-4 { 0%, 100%, 60% { opacity: 0.55; } 48% { opacity: 1.0; } }
        @keyframes tech-binary-5 { 0%, 100%, 75% { opacity: 0.55; } 63% { opacity: 1.0; } }
        @keyframes tech-binary-6 { 0%, 100%, 90% { opacity: 0.55; } 78% { opacity: 1.0; } }
        
        /* Slow breathing ambient light for technology container */
        @keyframes tech-ambient-light {
          0%, 100% { opacity: 0.40; }
          50% { opacity: 0.50; }
        }
        /* Slow bloom breathing for layered engravings (80% ↔ 110% breathing range) */
        @keyframes tech-bloom-breathe {
          0%, 100% { opacity: 0.80; filter: drop-shadow(0 0 1.8px rgba(212,175,55,0.8)) drop-shadow(0 0 4px rgba(212,175,55,0.4)); }
          50% { opacity: 1.10; filter: drop-shadow(0 0 3.6px rgba(212,175,55,1.0)) drop-shadow(0 0 9px rgba(212,175,55,0.6)); }
        }
        /* Terminal cursor blink keyframes */
        @keyframes terminal-cursor {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        /* Waveform traveling pulse keyframes */
        @keyframes tech-wave-flow {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
      `}} />

      {/* Global SVG Filters and Animated Shimmer Gradients */}
      <svg className="absolute pointer-events-none opacity-0" aria-hidden="true" width="1" height="1">
        <defs>
          {/* Engraved circuitry light bloom filter (Target: Core stdDev 1.6, Outer stdDev 6.5, matrix alpha boosted by ~2.0x-2.5x) */}
          <filter id="engraved-bloom" x="-60%" y="-60%" width="220%" height="220%">
            {/* Tight core glow blur */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur-tight" />
            {/* Wide soft scattering halo */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="blur-wide" />

            {/* Map wide blur to antique gold with boosted alpha */}
            <feColorMatrix type="matrix" in="blur-wide" result="glow-wide" values="
              0.83 0 0 0 0
              0 0.69 0 0 0
              0 0 0.22 0 0
              0 0 0 1.35 0" />

            {/* Map tight blur to warm gold with boosted alpha */}
            <feColorMatrix type="matrix" in="blur-tight" result="glow-tight" values="
              0.90 0 0 0 0
              0 0.75 0 0 0
              0 0 0.30 0 0
              0 0 0 2.40 0" />

            <feMerge>
              <feMergeNode in="glow-wide" />
              <feMergeNode in="glow-tight" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Controller Travelling Reflection Gradient */}
          <linearGradient id="controller-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37">
              <animate attributeName="offset" values="-1; 2" dur="7s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#fffbe6" stopOpacity="0.8">
              <animate attributeName="offset" values="-0.5; 2.5" dur="7s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#d4af37">
              <animate attributeName="offset" values="0; 3" dur="7s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Drone Casing Shimmer Gradient */}
          <linearGradient id="drone-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#fffbe6" stopOpacity="0.75">
              <animate attributeName="offset" values="-0.5; 1.5" dur="6.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>

          {/* Camera Lens Reflection Shimmer */}
          <linearGradient id="lens-shimmer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95">
              <animate attributeName="offset" values="-0.5; 1.5" dur="7.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
          </linearGradient>

          {/* GPU Casing Shimmer Gradient */}
          <linearGradient id="gpu-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#fffbe6" stopOpacity="0.8">
              <animate attributeName="offset" values="-0.5; 1.5" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>

          {/* Propeller motion blur filter */}
          <filter id="propeller-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
          </filter>
        </defs>
      </svg>
      {/* 1. Technology Background Layer (breathing ambient opacity, thin gold outline strokes) - sits behind canvas */}
      <div
        className="absolute inset-0 z-0 text-gold-vintage mix-blend-screen select-none pointer-events-none tech-bg-layer"
        style={{ animation: "tech-ambient-light 16s ease-in-out infinite" }}
      >

        {/* Top Left Cluster - Adjusted to clear Jyothy logo safe zone */}
        <div
          className="absolute left-[3vw] top-[18vh] max-md:left-[2vw] max-md:top-[14vh] max-md:scale-[0.55] max-md:origin-top-left"
          style={{
            opacity: isExplore ? 0.78 * 0.95 : 0.95,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechController />
        </div>
        <div
          className="absolute left-[15vw] top-[19vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.55 * 0.85 : 0.85,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechBinary className="text-gold-vintage" />
        </div>

        {/* Middle Left Cluster */}
        <div
          className="absolute left-[2vw] top-[38vh] max-md:left-[1vw] max-md:top-[32vh] max-md:scale-[0.5] max-md:origin-top-left"
          style={{
            opacity: isExplore ? 0.78 * 0.90 : 0.90,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechMicrochip />
        </div>

        {/* Left background additions */}
        <div
          className="absolute left-[13vw] top-[46vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.55 * 0.35 : 0.35,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechTerminal />
        </div>

        {/* Bottom Left Cluster */}
        <div
          className="absolute left-[14vw] bottom-[14vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.78 * 0.90 : 0.90,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechPcb />
        </div>
        <div
          className="absolute left-[2vw] bottom-[15vh] max-md:left-[1vw] max-md:bottom-[12vh] max-md:scale-[0.5] max-md:origin-bottom-left"
          style={{
            opacity: isExplore ? 0.68 * 0.95 : 0.95,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechRoboticArm />
        </div>
        <div
          className="absolute left-[14vw] bottom-[4vh] text-gold-vintage max-md:hidden"
          style={{
            opacity: isExplore ? 0.55 * 0.35 : 0.35,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechWaveform />
        </div>
        <div
          className="absolute left-[2vw] bottom-[3vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.55 * 0.70 : 0.70,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechCode className="text-gold-vintage" />
        </div>

        {/* Top Right Cluster - Framing the Vedanta Bharati logo */}
        <div
          className="absolute right-[12vw] top-[18vh] max-md:right-[1vw] max-md:top-[14vh] max-md:scale-[0.5] max-md:origin-top-right"
          style={{
            opacity: isExplore ? 0.68 * 1.00 : 1.00,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechDrone />
        </div>

        {/* Middle Right Cluster */}
        <div
          className="absolute right-[2vw] top-[22vh] max-md:right-[1vw] max-md:top-[30vh] max-md:scale-[0.45] max-md:origin-top-right"
          style={{
            opacity: isExplore ? 0.78 * 0.95 : 0.95,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechNeural />
        </div>
        <div
          className="absolute right-[20vw] top-[32vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.78 * 0.90 : 0.90,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechCamera />
        </div>

        {/* Right background additions */}
        <div
          className="absolute right-[12vw] top-[42vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.55 * 0.35 : 0.35,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechCloudApi />
        </div>
        <div
          className="absolute right-[2vw] top-[48vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.55 * 0.35 : 0.35,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechDatabase />
        </div>

        <div
          className="absolute right-[17vw] top-[44vh] font-mono text-[11px] leading-relaxed text-gold-vintage max-md:hidden"
          style={{
            opacity: isExplore ? 0.55 * 0.80 : 0.80,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <div style={{ animation: "tech-binary-1 6s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>0101</div>
          <div style={{ animation: "tech-binary-3 6s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>0001</div>
          <div style={{ animation: "tech-binary-5 6s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>0101</div>
        </div>

        {/* Bottom Right Cluster - Moved AI Head slightly up to clear Tat Tvam Asi text */}
        <div
          className="absolute right-[20vw] bottom-[16vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.68 * 0.95 : 0.95,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechGpu />
        </div>
        <div
          className="absolute right-[2vw] bottom-[12vh] max-md:right-[1vw] max-md:bottom-[10vh] max-md:scale-[0.5] max-md:origin-bottom-right"
          style={{
            opacity: isExplore ? 0.68 * 1.00 : 1.00,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechAiHead />
        </div>
        <div
          className="absolute right-[19vw] bottom-[3vh] max-md:hidden"
          style={{
            opacity: isExplore ? 0.55 * 0.80 : 0.80,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechEquation className="text-gold-vintage" />
        </div>

        {/* Bottom Center Cluster */}
        <div
          className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 max-md:bottom-[3vh] max-md:scale-[0.6]"
          style={{
            opacity: isExplore ? 0.78 * 1.00 : 1.00,
            transition: "opacity 700ms ease-in-out"
          }}
        >
          <TechLotus />
        </div>

      </div>

      {/* 2. Star Layer + Galaxy Canvas (Three.js Canvas, screens over background) */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block transform-gpu z-10 relative"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}

// Static memoized technology background sub-components
const TechController = memo(() => (
  <svg
    className="tech-controller w-32 h-22 transition-opacity duration-1000"
    viewBox="0 0 200 140"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* Glow Bloom (behind) - breathing glow */}
    <path d="M40 30 h120 c20 0, 32 12, 22 45 l-12 35 c-6 18, -22 18, -32 0 l-12 -18 h-32 l-12 18 c-10 18, -26 18, -32 0 l-12 -35 c-10 -33, 2 -45, 22 -45 Z" stroke="#d4af37" strokeWidth="4" opacity="0.4" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 7.3s ease-in-out infinite" }} />

    {/* Main Engraved Outline */}
    <path d="M40 30 h120 c20 0, 32 12, 22 45 l-12 35 c-6 18, -22 18, -32 0 l-12 -18 h-32 l-12 18 c-10 18, -26 18, -32 0 l-12 -35 c-10 -33, 2 -45, 22 -45 Z" stroke="#d4af37" strokeWidth="1.2" />

    {/* Inner Contour Offset */}
    <path d="M43 33 h114 c17 0, 27 10, 19 38 l-11 32 c-5 15, -18 15, -27 0 l-12 -18 h-32 l-12 18 c-9 15, -22 15, -27 0 l-11 -32 c-8 -28, 2 -38, 19 -38 Z" stroke="#fbbf24" strokeWidth="0.6" opacity="0.7" />

    {/* Technical Crosshairs and Grid Marks */}
    <circle cx="100" cy="70" r="62" stroke="#d4af37" strokeWidth="0.3" strokeDasharray="2 6" opacity="0.3" />
    <path d="M100 5 V135 M5 70 H195" stroke="#d4af37" strokeWidth="0.25" strokeDasharray="3 9" opacity="0.25" />

    {/* Grip Texturing / Parallel Engraving Lines */}
    <path d="M22 68 l-6 6 M24 72 l-6 6 M26 76 l-6 6 M28 80 l-6 6 M30 84 l-6 6" strokeWidth="0.4" opacity="0.5" />
    <path d="M178 68 l6 6 M176 72 l6 6 M174 76 l6 6 M172 80 l6 6 M170 84 l6 6" strokeWidth="0.4" opacity="0.5" />

    {/* D-Pad (Left side) */}
    <g transform="translate(55, 65)">
      <circle cx="0" cy="0" r="18" stroke="#d4af37" strokeWidth="0.5" opacity="0.6" />
      {/* Detailed Cross */}
      <path d="M-5 -15 h10 v10 h10 v10 h-10 v10 h-10 v-10 h-10 v-10 h10 z" stroke="#fbbf24" strokeWidth="0.9" />
      <path d="M-2 -12 h4 v6 h-4 z M12 -2 v4 h-6 v-4 z M-2 6 h4 v6 h-4 z M-12 -2 v4 h6 v-4 z" stroke="#d4af37" strokeWidth="0.5" opacity="0.8" />
    </g>

    {/* Action Buttons (Right side) */}
    <g transform="translate(145, 65)">
      <circle cx="0" cy="0" r="18" stroke="#d4af37" strokeWidth="0.5" opacity="0.6" />
      {/* Triangle Button */}
      <circle cx="0" cy="-10" r="3.5" stroke="#fbbf24" strokeWidth="0.8" />
      <path d="M-2 -8.5 l2 -3.5 l2 3.5 z" stroke="#d4af37" strokeWidth="0.5" />
      {/* Circle Button */}
      <circle cx="10" cy="0" r="3.5" stroke="#fbbf24" strokeWidth="0.8" />
      <circle cx="10" cy="0" r="1.5" stroke="#d4af37" strokeWidth="0.5" />
      {/* Cross Button */}
      <circle cx="0" cy="10" r="3.5" stroke="#fbbf24" strokeWidth="0.8" />
      <path d="M-1.5 8.5 l3 3 M1.5 8.5 l-3 3" stroke="#d4af37" strokeWidth="0.5" />
      {/* Square Button */}
      <circle cx="-10" cy="0" r="3.5" stroke="#fbbf24" strokeWidth="0.8" />
      <rect x="-11.5" y="-1.5" width="3" height="3" stroke="#d4af37" strokeWidth="0.5" />
    </g>

    {/* Touchpad (Center) */}
    <rect x="72" y="34" width="56" height="30" rx="3" stroke="#d4af37" strokeWidth="0.85" opacity="0.8" />
    <rect x="75" y="37" width="50" height="24" rx="1.5" stroke="#fbbf24" strokeWidth="0.4" opacity="0.5" strokeDasharray="4 2" />

    {/* Analog Sticks (Dual) */}
    <g transform="translate(82, 88)">
      <circle cx="0" cy="0" r="16" stroke="#d4af37" strokeWidth="0.7" />
      <circle cx="0" cy="0" r="13" stroke="#fbbf24" strokeWidth="0.4" opacity="0.6" />
      <circle cx="0" cy="0" r="6" stroke="#fbbf24" strokeWidth="0.8" />
      {/* Crosshairs inside stick */}
      <path d="M-4 0 h8 M0 -4 v8" stroke="#d4af37" strokeWidth="0.4" />
    </g>
    <g transform="translate(118, 88)">
      <circle cx="0" cy="0" r="16" stroke="#d4af37" strokeWidth="0.7" />
      <circle cx="0" cy="0" r="13" stroke="#fbbf24" strokeWidth="0.4" opacity="0.6" />
      <circle cx="0" cy="0" r="6" stroke="#fbbf24" strokeWidth="0.8" />
      {/* Crosshairs inside stick */}
      <path d="M-4 0 h8 M0 -4 v8" stroke="#d4af37" strokeWidth="0.4" />
    </g>

    {/* Metallic Shimmer Highlight (animated gradient) */}
    <path d="M40 30 h120 c20 0, 32 12, 22 45 l-12 35 c-6 18, -22 18, -32 0 l-12 -18 h-32 l-12 18" stroke="url(#controller-shimmer)" strokeWidth="1.2" opacity="0.9" />
  </svg>
));
TechController.displayName = "TechController";

const TechMicrochip = memo(() => (
  <svg
    className="tech-microchip w-28 h-28 transition-opacity duration-1000"
    viewBox="0 0 100 100"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* Outer Silicon Base Glow - breathing glow */}
    <rect x="20" y="20" width="60" height="60" rx="3" stroke="#d4af37" strokeWidth="4" opacity="0.35" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 5.7s ease-in-out infinite" }} />

    {/* Base Outline */}
    <rect x="20" y="20" width="60" height="60" rx="3" stroke="#d4af37" strokeWidth="1.2" />

    {/* Inner Concentric Heat Spreader */}
    <rect x="26" y="26" width="48" height="48" rx="1.5" stroke="#fbbf24" strokeWidth="0.75" />
    <rect x="32" y="32" width="36" height="36" stroke="#d4af37" strokeWidth="0.5" opacity="0.6" strokeDasharray="3 1" />

    {/* Silicon Die in Center */}
    <rect x="40" y="40" width="20" height="20" stroke="#fbbf24" strokeWidth="0.9" />
    {/* Tiny circuit details inside die */}
    <path d="M43 43 h14 v14 h-14 z M47 43 v14 M53 43 v14 M43 47 h14 M43 53 h14" stroke="#d4af37" strokeWidth="0.3" opacity="0.8" />

    {/* Leadframe Wire Bonds (Die to Package pins) */}
    <path d="M40 42 L26 35 M40 50 L26 50 M40 58 L26 65 M60 42 L74 35 M60 50 L74 50 M60 58 L74 65 M42 40 L35 26 M50 40 L50 26 M58 40 L65 26 M42 60 L35 74 M50 60 L50 74 M58 60 L65 74" stroke="#d4af37" strokeWidth="0.4" opacity="0.7" />

    {/* Output Pins */}
    <path d="M15 28 h5 M15 34 h5 M15 40 h5 M15 46 h5 M15 54 h5 M15 60 h5 M15 66 h5 M15 72 h5 M80 28 h5 M80 34 h5 M80 40 h5 M80 46 h5 M80 54 h5 M80 60 h5 M80 66 h5 M80 72 h5 M28 15 v5 M34 15 v5 M40 15 v5 M46 15 v5 M54 15 v5 M60 15 v5 M66 15 v5 M72 15 v5 M28 80 v5 M34 80 v5 M40 80 v5 M46 80 v5 M54 80 v5 M60 80 v5 M66 80 v5 M72 80 v5" stroke="#fbbf24" strokeWidth="0.85" />

    {/* Radiating PCB Tracks */}
    <path d="M15 28 H8 L3 23 M15 40 H5 V12 H2 M15 60 H5 V88 H2 M15 72 H8 L3 77 M85 28 H92 L97 23 M85 40 H95 V12 H98 M85 60 H95 V88 H98 M85 72 H92 L97 77 M40 15 V5 H12 M60 15 V5 H88 M40 85 V95 H12 M60 85 V95 H88" stroke="#d4af37" strokeWidth="0.65" opacity="0.55" />

    {/* Animated Pulses on traces - drifted flow */}
    <path d="M15 28 H8 L3 23 M15 40 H5 V12 H2 M85 72 H92 L97 77 M60 85 V95 H88" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="8 60" style={{ animation: "tech-pcb-flow 5.7s linear infinite" }} opacity="0.8" filter="url(#engraved-bloom)" />
  </svg>
));
TechMicrochip.displayName = "TechMicrochip";

const TechPcb = memo(() => (
  <svg
    className="tech-pcb w-44 h-32 transition-opacity duration-1000"
    viewBox="0 0 160 120"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* Motherboard Base Plate Glow - breathing glow */}
    <polygon points="15,65 85,25 150,62 80,102" stroke="#d4af37" strokeWidth="4" opacity="0.3" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 4.9s ease-in-out infinite" }} />

    {/* Base Plate Outlines */}
    <polygon points="15,65 85,25 150,62 80,102" stroke="#d4af37" strokeWidth="1.2" />
    <polygon points="17,64 85,27 146,62 80,100" stroke="#fbbf24" strokeWidth="0.5" opacity="0.75" />

    {/* Thickness side board edge */}
    <path d="M15 65 v4 L80 106 v-4 M150 62 v4 L80 106" stroke="#d4af37" strokeWidth="0.85" opacity="0.7" />

    {/* CPU Socket */}
    <polygon points="60,50 85,36 105,48 80,62" stroke="#fbbf24" strokeWidth="1.0" />
    <polygon points="63,50 85,38 101,48 80,60" stroke="#d4af37" strokeWidth="0.5" opacity="0.6" />
    {/* Pin grid array markings inside socket */}
    <path d="M68 49 L88 60 M73 46 L93 57 M78 43 L98 54" stroke="#d4af37" strokeWidth="0.3" strokeDasharray="1 2" opacity="0.7" />

    {/* Heatsink with Cooling Fins */}
    <polygon points="35,53 50,44 62,51 47,60" stroke="#d4af37" strokeWidth="0.7" />
    {/* Fins lines */}
    <path d="M38 52 L50 61 M41 50 L53 59 M44 48 L56 57 M47 46 L59 55" stroke="#fbbf24" strokeWidth="0.55" />

    {/* RAM DIMM Slots */}
    <path d="M95 34 L130 54 M97 33 L132 53 M93 37 L128 57 M95 36 L130 56" stroke="#fbbf24" strokeWidth="0.7" />
    {/* Latch detail at ends */}
    <path d="M95 34 v-2 h-1 v2 M130 54 v-2 h1 v2 M93 37 v-2 h-1 v2 M128 57 v-2 h1 v2" stroke="#d4af37" strokeWidth="0.5" />

    {/* 3D Capacitors (Cylindrical) */}
    {/* Cap 1 */}
    <path d="M52 75 c-1.5 -0.8 1.5 -2.5 3 -2.5 s4.5 1.7 3 2.5 M52 75 v6 c0 1.5 6 1.5 6 0 v-6" stroke="#fbbf24" strokeWidth="0.85" />
    <ellipse cx="55" cy="75" rx="3" ry="1.2" stroke="#d4af37" strokeWidth="0.45" />
    {/* Cap 2 */}
    <path d="M62 81 c-1.5 -0.8 1.5 -2.5 3 -2.5 s4.5 1.7 3 2.5 M62 81 v6 c0 1.5 6 1.5 6 0 v-6" stroke="#fbbf24" strokeWidth="0.85" />
    <ellipse cx="65" cy="81" rx="3" ry="1.2" stroke="#d4af37" strokeWidth="0.45" />
    {/* Cap 3 */}
    <path d="M42 69 c-1.5 -0.8 1.5 -2.5 3 -2.5 s4.5 1.7 3 2.5 M42 69 v6 c0 1.5 6 1.5 6 0 v-6" stroke="#fbbf24" strokeWidth="0.85" />
    <ellipse cx="45" cy="69" rx="3" ry="1.2" stroke="#d4af37" strokeWidth="0.45" />

    {/* PCIe Slots */}
    <polygon points="50,90 110,55 114,57 54,92" stroke="#d4af37" strokeWidth="0.7" />
    <path d="M52 90 L112 55" stroke="#fbbf24" strokeWidth="0.55" strokeDasharray="3 1" />

    {/* Circuit board traces */}
    <path d="M30 63 L45 72 M47 38 L30 48 H22 M80 65 L95 74 M75 33 L68 29 H55 M112 65 L125 72 L135 67 M140 60 L145 63" stroke="#d4af37" strokeWidth="0.5" opacity="0.6" />
    {/* Trace flow - drifted speed */}
    <path d="M30 63 L45 72 M112 65 L125 72 L135 67" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="6 35" style={{ animation: "tech-pcb-flow 5.1s linear infinite" }} opacity="0.85" />

    {/* Small testpoints/vias */}
    <circle cx="28" cy="48" r="1" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="135" cy="67" r="1" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="120" cy="80" r="1.2" stroke="#d4af37" strokeWidth="0.4" />
  </svg>
));
TechPcb.displayName = "TechPcb";

const TechRoboticArm = memo(() => (
  <motion.div
    animate={{ y: [0, -10, -10, 0, 10, 10, 0] }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: ["easeInOut", "linear", "easeInOut", "easeInOut", "linear", "easeInOut"]
    }}
  >
    <svg
      className="tech-robotic-arm w-44 h-48 transition-opacity duration-1000"
      viewBox="0 0 150 200"
      stroke="#d4af37"
      strokeWidth="0.8"
      fill="none"
    >
      {/* Base Stand Glow - breathing glow */}
      <rect x="35" y="175" width="80" height="15" rx="3" stroke="#d4af37" strokeWidth="3.5" opacity="0.3" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 6.3s ease-in-out infinite" }} />

      {/* Base Stand */}
      <rect x="35" y="175" width="80" height="15" rx="3" stroke="#d4af37" strokeWidth="1.2" />
      <path d="M45 175 V165 H105 V175" stroke="#fbbf24" strokeWidth="0.75" />
      {/* Bolt details on base */}
      <circle cx="43" cy="182.5" r="1.5" stroke="#fbbf24" strokeWidth="0.5" />
      <circle cx="107" cy="182.5" r="1.5" stroke="#fbbf24" strokeWidth="0.5" />
      <circle cx="75" cy="182.5" r="1.5" stroke="#fbbf24" strokeWidth="0.5" />

      {/* Joint 1 - Shoulder */}
      <circle cx="75" cy="155" r="14" stroke="#d4af37" strokeWidth="1.1" />
      <circle cx="75" cy="155" r="9" stroke="#fbbf24" strokeWidth="0.7" strokeDasharray="3 2" />
      <circle cx="75" cy="155" r="4" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-joint-base 8.7s ease-in-out infinite" }} />
      <path d="M61 155 H89" stroke="#d4af37" strokeWidth="0.5" opacity="0.5" />

      {/* Lower Arm Structural Frame */}
      <path d="M70 142 L48 85 H58 L80 142" stroke="#d4af37" strokeWidth="1.0" />
      <path d="M74 142 L52 85" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
      {/* Truss cross-bracing inside arm */}
      <path d="M72 130 L55 120 M54 110 L76 100 M78 95 L56 90" stroke="#d4af37" strokeWidth="0.45" opacity="0.6" />

      {/* Hydraulic Piston Cylinders (Shoulder-Elbow) */}
      <path d="M85 155 L65 92" stroke="#d4af37" strokeWidth="2.0" opacity="0.8" />
      <path d="M85 155 L65 92" stroke="#fffbe6" strokeWidth="0.7" />
      <circle cx="85" cy="155" r="2.5" stroke="#d4af37" strokeWidth="0.6" />
      <circle cx="65" cy="92" r="2.5" stroke="#d4af37" strokeWidth="0.6" />

      {/* Joint 2 - Elbow */}
      <circle cx="50" cy="80" r="12" stroke="#d4af37" strokeWidth="1.1" />
      <circle cx="50" cy="80" r="7" stroke="#fbbf24" strokeWidth="0.7" />
      <circle cx="50" cy="80" r="3" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-joint-elbow 8.7s ease-in-out infinite" }} />

      {/* Upper Arm Structural Frame (tapered) */}
      <path d="M50 80 L102 42 L107 48 L56 86 Z" stroke="#d4af37" strokeWidth="1.0" />
      {/* Internal design details (cutouts) */}
      <circle cx="68" cy="67" r="4" stroke="#fbbf24" strokeWidth="0.6" opacity="0.7" />
      <circle cx="88" cy="53" r="3" stroke="#fbbf24" strokeWidth="0.6" opacity="0.7" />
      {/* Cable/hose routing along upper arm */}
      <path d="M53 74 C65 65, 80 55, 98 48" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.8" />

      {/* Joint 3 - Wrist */}
      <circle cx="106" cy="43" r="8" stroke="#d4af37" strokeWidth="1.0" />
      <circle cx="106" cy="43" r="2.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-joint-wrist 8.7s ease-in-out infinite" }} />

      {/* Gripper/Effector mechanism */}
      <path d="M106 43 L118 32 H124 M106 43 L122 47 H128" stroke="#fbbf24" strokeWidth="1.0" />
      {/* Articulated Claw 1 */}
      <path d="M124 32 L132 20 M132 20 H140 M132 20 L136 28" stroke="#d4af37" strokeWidth="0.9" />
      {/* Articulated Claw 2 */}
      <path d="M128 47 L138 56 M138 56 H146 M138 56 L134 48" stroke="#d4af37" strokeWidth="0.9" />

      {/* Tiny travelling highlight across joints - drifted speed */}
      <path d="M75 155 L50 80 L106 43" stroke="#fffbe6" strokeWidth="1.5" strokeDasharray="15 150" style={{ animation: "tech-pcb-flow 7.3s linear infinite", animationDelay: "1s" }} opacity="0.8" />
    </svg>
  </motion.div>
));
TechRoboticArm.displayName = "TechRoboticArm";

const TechDrone = memo(() => (
  <svg
    className="tech-drone w-48 h-36 transition-opacity duration-1000"
    viewBox="0 0 180 120"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* Main Body Glow - breathing glow */}
    <rect x="75" y="45" width="30" height="24" rx="5" stroke="#d4af37" strokeWidth="4.5" opacity="0.3" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 6.9s ease-in-out infinite" }} />

    {/* Fuselage (Central Body) */}
    <rect x="75" y="45" width="30" height="24" rx="5" stroke="#d4af37" strokeWidth="1.2" />
    <rect x="79" y="49" width="22" height="16" rx="2.5" stroke="#fbbf24" strokeWidth="0.65" />
    <path d="M90 45 V38 H96 V45" stroke="#d4af37" strokeWidth="0.5" opacity="0.75" />
    {/* Grid detail on fuselage */}
    <path d="M84 57 h12 M84 61 h12" stroke="#d4af37" strokeWidth="0.4" opacity="0.6" />

    {/* Gimbal Camera underneath */}
    <path d="M85 69 L88 77 H92 L95 69" stroke="#d4af37" strokeWidth="0.8" />
    <circle cx="90" cy="81" r="5" stroke="#fbbf24" strokeWidth="0.85" />
    <circle cx="90" cy="81" r="2" fill="#fbbf24" stroke="none" />
    {/* Lens flare line */}
    <path d="M87 79 a3.5 3.5 0 0 1 6 0" stroke="#fffbe6" strokeWidth="0.65" opacity="0.9" />

    {/* Rotor Arms (Lattice truss structures) */}
    {/* Top Left Arm */}
    <path d="M75 49 L38 23 M75 53 L41 26" stroke="#fbbf24" strokeWidth="0.95" />
    <path d="M38 23 L41 26" stroke="#fbbf24" strokeWidth="0.7" />
    <path d="M68 44 L48 29 M60 38 L43 26" stroke="#d4af37" strokeWidth="0.45" opacity="0.6" />
    {/* Top Right Arm */}
    <path d="M105 49 L142 23 M105 53 L139 26" stroke="#fbbf24" strokeWidth="0.95" />
    <path d="M142 23 L139 26" stroke="#fbbf24" strokeWidth="0.7" />
    <path d="M112 44 L132 29 M120 38 L137 26" stroke="#d4af37" strokeWidth="0.45" opacity="0.6" />
    {/* Bottom Left Arm */}
    <path d="M75 61 L38 87 M75 65 L41 84" stroke="#fbbf24" strokeWidth="0.95" />
    <path d="M38 87 L41 84" stroke="#fbbf24" strokeWidth="0.7" />
    <path d="M68 66 L48 81 M60 72 L43 84" stroke="#d4af37" strokeWidth="0.45" opacity="0.6" />
    {/* Bottom Right Arm */}
    <path d="M105 61 L142 87 M105 65 L139 84" stroke="#fbbf24" strokeWidth="0.95" />
    <path d="M142 87 L139 84" stroke="#fbbf24" strokeWidth="0.7" />
    <path d="M112 66 L132 81 M120 72 L137 84" stroke="#d4af37" strokeWidth="0.45" opacity="0.6" />

    {/* Motor Pods */}
    <g transform="translate(38, 23)">
      <ellipse cx="0" cy="0" rx="4" ry="2" stroke="#d4af37" strokeWidth="0.8" />
      <path d="M-4 0 v4 c0 1.5 8 1.5 8 0 v-4" stroke="#d4af37" strokeWidth="0.6" />
    </g>
    <g transform="translate(142, 23)">
      <ellipse cx="0" cy="0" rx="4" ry="2" stroke="#d4af37" strokeWidth="0.8" />
      <path d="M-4 0 v4 c0 1.5 8 1.5 8 0 v-4" stroke="#d4af37" strokeWidth="0.6" />
    </g>
    <g transform="translate(38, 87)">
      <ellipse cx="0" cy="0" rx="4" ry="2" stroke="#d4af37" strokeWidth="0.8" />
      <path d="M-4 0 v4 c0 1.5 8 1.5 8 0 v-4" stroke="#d4af37" strokeWidth="0.6" />
    </g>
    <g transform="translate(142, 87)">
      <ellipse cx="0" cy="0" rx="4" ry="2" stroke="#d4af37" strokeWidth="0.8" />
      <path d="M-4 0 v4 c0 1.5 8 1.5 8 0 v-4" stroke="#d4af37" strokeWidth="0.6" />
    </g>

    {/* Propellers (swept ellipses and blade paths) */}
    {/* TL Prop */}
    <motion.g
      style={{ transformOrigin: "38px 20px" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.37, repeat: Infinity, ease: "linear" }}
    >
      <ellipse cx="38" cy="20" rx="24" ry="4" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3 1" opacity="0.7" />
      {/* Main Blade */}
      <path d="M20 20 C28 17, 48 23, 56 20" stroke="#d4af37" strokeWidth="0.75" filter="url(#propeller-blur)" />
      {/* Motion trail blade offset by 15 degrees */}
      <path d="M20 20 C28 17, 48 23, 56 20" stroke="#fbbf24" strokeWidth="0.55" transform="rotate(15, 38, 20)" opacity="0.4" filter="url(#propeller-blur)" />
      <path d="M20 20 C28 17, 48 23, 56 20" stroke="#fbbf24" strokeWidth="0.55" transform="rotate(-15, 38, 20)" opacity="0.4" filter="url(#propeller-blur)" />
    </motion.g>
    {/* TR Prop */}
    <motion.g
      style={{ transformOrigin: "142px 20px" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.37, repeat: Infinity, ease: "linear" }}
    >
      <ellipse cx="142" cy="20" rx="24" ry="4" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3 1" opacity="0.7" />
      {/* Main Blade */}
      <path d="M124 20 C132 17, 152 23, 160 20" stroke="#d4af37" strokeWidth="0.75" filter="url(#propeller-blur)" />
      {/* Motion trail blade offset by 15 degrees */}
      <path d="M124 20 C132 17, 152 23, 160 20" stroke="#fbbf24" strokeWidth="0.55" transform="rotate(15, 142, 20)" opacity="0.4" filter="url(#propeller-blur)" />
      <path d="M124 20 C132 17, 152 23, 160 20" stroke="#fbbf24" strokeWidth="0.55" transform="rotate(-15, 142, 20)" opacity="0.4" filter="url(#propeller-blur)" />
    </motion.g>
    {/* BL Prop */}
    <motion.g
      style={{ transformOrigin: "38px 84px" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.37, repeat: Infinity, ease: "linear" }}
    >
      <ellipse cx="38" cy="84" rx="24" ry="4" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3 1" opacity="0.7" />
      {/* Main Blade */}
      <path d="M20 84 C28 81, 48 87, 56 84" stroke="#d4af37" strokeWidth="0.75" filter="url(#propeller-blur)" />
      {/* Motion trail blade offset by 15 degrees */}
      <path d="M20 84 C28 81, 48 87, 56 84" stroke="#fbbf24" strokeWidth="0.55" transform="rotate(15, 38, 84)" opacity="0.4" filter="url(#propeller-blur)" />
      <path d="M20 84 C28 81, 48 87, 56 84" stroke="#fbbf24" strokeWidth="0.55" transform="rotate(-15, 38, 84)" opacity="0.4" filter="url(#propeller-blur)" />
    </motion.g>
    {/* BR Prop */}
    <motion.g
      style={{ transformOrigin: "142px 84px" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.37, repeat: Infinity, ease: "linear" }}
    >
      <ellipse cx="142" cy="84" rx="24" ry="4" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3 1" opacity="0.7" />
      {/* Main Blade */}
      <path d="M124 84 C132 81, 152 87, 160 84" stroke="#d4af37" strokeWidth="0.75" filter="url(#propeller-blur)" />
      {/* Motion trail blade offset by 15 degrees */}
      <path d="M124 84 C132 81, 152 87, 160 84" stroke="#fbbf24" strokeWidth="0.55" transform="rotate(15, 142, 84)" opacity="0.4" filter="url(#propeller-blur)" />
      <path d="M124 84 C132 81, 152 87, 160 84" stroke="#fbbf24" strokeWidth="0.55" transform="rotate(-15, 142, 84)" opacity="0.4" filter="url(#propeller-blur)" />
    </motion.g>

    {/* Landing Skids */}
    <path d="M78 69 L65 92 H52 M102 69 L115 92 H128" stroke="#fbbf24" strokeWidth="0.9" />
    <path d="M50 92 h84" stroke="#d4af37" strokeWidth="0.6" strokeDasharray="5 2" opacity="0.6" />

    {/* Navigation LEDs (pulsing) - drifted timing */}
    <circle cx="38" cy="23" r="2.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-1 3.7s ease-in-out infinite" }} />
    <circle cx="142" cy="23" r="2.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-3 4.1s ease-in-out infinite" }} />
    <circle cx="38" cy="87" r="2.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-5 4.3s ease-in-out infinite" }} />
    <circle cx="142" cy="87" r="2.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-7 4.7s ease-in-out infinite" }} />

    {/* Metallic Shimmer Sweep */}
    <rect x="75" y="45" width="30" height="24" rx="5" stroke="url(#drone-shimmer)" strokeWidth="1.2" />
  </svg>
));
TechDrone.displayName = "TechDrone";

const TechNeural = memo(() => (
  <svg
    className="tech-neural w-48 h-40 transition-opacity duration-1000"
    viewBox="0 0 180 150"
    stroke="#d4af37"
    strokeWidth="0.6"
    fill="none"
  >
    {/* Symmetrical central glow for visual weight */}
    <circle cx="95" cy="75" r="40" stroke="#d4af37" strokeWidth="3" opacity="0.15" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 8.1s ease-in-out infinite" }} />

    {/* Neural Network Nodes & Links */}
    {/* Base Network Connections */}
    <g opacity="0.45" stroke="#d4af37">
      <path d="M25 45 L65 25 M25 45 L50 85 M65 25 L115 30 M65 25 L95 75 M65 25 L50 85 M115 30 L155 45 M115 30 L95 75 M50 85 L95 75 M50 85 L35 125 M50 85 L85 130 M95 75 L155 45 M95 75 L135 95 M95 75 L85 130 M155 45 L135 95 M135 95 L145 130 M135 95 L85 130 M85 130 L145 130 M85 130 L35 125" />
      <path d="M25 45 L10 75 L35 125 M65 25 L90 10 M115 30 L140 10 L155 45" strokeDasharray="2 3" />
    </g>

    {/* Secondary Layer Connections (Foreground) */}
    <g opacity="0.8" stroke="#fbbf24">
      <path d="M25 45 L65 25 M65 25 L95 75 M95 75 L135 95 M135 95 L85 130 M50 85 L95 75" strokeWidth="0.8" />
    </g>

    {/* Signal Pulses Travelling along Paths - drifted speed */}
    <path
      d="M25 45 L65 25 L95 75 L135 95 L85 130 M50 85 L95 75 L155 45"
      strokeWidth="2.0"
      stroke="#fffbe6"
      strokeDasharray="15 130"
      filter="url(#engraved-bloom)"
      opacity="0.8"
      style={{ animation: "tech-pcb-flow 9.1s linear infinite" }}
    />

    {/* Nodes (with varying sizes and halos) - drifted sequence */}
    {/* Node 1 - Input 1 */}
    <g transform="translate(25, 45)">
      <circle cx="0" cy="0" r="4.5" stroke="#fbbf24" strokeWidth="1.0" />
      <circle cx="0" cy="0" r="1.5" fill="#fbbf24" stroke="none" />
    </g>
    {/* Node 2 - Input 2 */}
    <g transform="translate(50, 85)">
      <circle cx="0" cy="0" r="5.5" stroke="#fbbf24" strokeWidth="1.2" />
      <circle cx="0" cy="0" r="2.0" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-2 6.7s ease-in-out infinite" }} />
    </g>
    {/* Node 3 - Input 3 */}
    <g transform="translate(35, 125)">
      <circle cx="0" cy="0" r="3.5" stroke="#d4af37" strokeWidth="0.85" />
    </g>

    {/* Node 4 - Hidden 1 */}
    <g transform="translate(65, 25)">
      <circle cx="0" cy="0" r="4.0" stroke="#fbbf24" strokeWidth="1.0" />
      <circle cx="0" cy="0" r="1.5" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-4 6.7s ease-in-out infinite" }} />
    </g>
    {/* Node 5 - Hidden 2 */}
    <g transform="translate(95, 75)">
      <circle cx="0" cy="0" r="6.0" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="2.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-1 6.7s ease-in-out infinite" }} />
    </g>
    {/* Node 6 - Hidden 3 */}
    <g transform="translate(85, 130)">
      <circle cx="0" cy="0" r="5.0" stroke="#fbbf24" strokeWidth="1.1" />
      <circle cx="0" cy="0" r="2.0" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-6 6.7s ease-in-out infinite" }} />
    </g>

    {/* Node 7 - Hidden 4 */}
    <g transform="translate(115, 30)">
      <circle cx="0" cy="0" r="4.0" stroke="#fbbf24" strokeWidth="1.0" />
    </g>
    {/* Node 8 - Hidden 5 */}
    <g transform="translate(135, 95)">
      <circle cx="0" cy="0" r="5.5" stroke="#fbbf24" strokeWidth="1.2" />
      <circle cx="0" cy="0" r="2.0" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-3 6.7s ease-in-out infinite" }} />
    </g>

    {/* Node 9 - Output 1 */}
    <g transform="translate(155, 45)">
      <circle cx="0" cy="0" r="5.0" stroke="#fbbf24" strokeWidth="1.1" />
      <circle cx="0" cy="0" r="2.0" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-5 6.7s ease-in-out infinite" }} />
    </g>
    {/* Node 10 - Output 2 */}
    <g transform="translate(145, 130)">
      <circle cx="0" cy="0" r="3.5" stroke="#d4af37" strokeWidth="0.85" />
    </g>

    {/* Peripheral decorative nodes */}
    <circle cx="10" cy="75" r="2.0" stroke="#d4af37" strokeWidth="0.5" />
    <circle cx="90" cy="10" r="2.0" stroke="#d4af37" strokeWidth="0.5" />
    <circle cx="140" cy="10" r="2.5" stroke="#d4af37" strokeWidth="0.5" />
  </svg>
));
TechNeural.displayName = "TechNeural";

const TechCamera = memo(() => (
  <svg
    className="tech-camera w-24 h-18 transition-opacity duration-1000"
    viewBox="0 0 100 80"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* Camera Body Glow - breathing glow */}
    <rect x="10" y="20" width="80" height="50" rx="6" stroke="#d4af37" strokeWidth="4.2" opacity="0.3" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 7.9s ease-in-out infinite" }} />

    {/* Camera Body */}
    <rect x="10" y="20" width="80" height="50" rx="6" stroke="#d4af37" strokeWidth="1.2" />
    <rect x="13" y="23" width="74" height="44" rx="3.5" stroke="#fbbf24" strokeWidth="0.55" opacity="0.75" />

    {/* Grip Panel Engraving */}
    <path d="M22 23 V67 M25 23 V67" stroke="#d4af37" strokeWidth="0.45" opacity="0.5" />
    <path d="M13 32 H22 M13 38 H22 M13 44 H22 M13 50 H22" stroke="#d4af37" strokeWidth="0.4" opacity="0.5" />

    {/* Top Dials & Shutter Button */}
    {/* Hot Shoe */}
    <path d="M43 20 V16 H57 V20" stroke="#d4af37" strokeWidth="0.9" />
    <path d="M45 16 h10" stroke="#fbbf24" strokeWidth="0.5" />
    {/* Mode Dial */}
    <path d="M23 20 V15 H35 V20" stroke="#d4af37" strokeWidth="0.85" />
    <path d="M26 15 v5 M29 15 v5 M32 15 v5" stroke="#fbbf24" strokeWidth="0.55" />
    {/* Shutter Button */}
    <path d="M72 20 V17 H80 V20" stroke="#d4af37" strokeWidth="0.85" />
    <circle cx="76" cy="15" r="2.5" stroke="#fbbf24" strokeWidth="0.6" />

    {/* Lens Barrel (Concentric rings) */}
    <circle cx="50" cy="45" r="21" stroke="#d4af37" strokeWidth="1.0" />
    <circle cx="50" cy="45" r="18" stroke="#fbbf24" strokeWidth="0.75" />
    {/* Focus Ring Ridges */}
    <circle cx="50" cy="45" r="16" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.7" />
    <circle cx="50" cy="45" r="13" stroke="#fbbf24" strokeWidth="0.85" />
    <circle cx="50" cy="45" r="8" stroke="#d4af37" strokeWidth="0.55" />

    {/* Lens Reflection (Glass glint) */}
    <path d="M42 38 a10 10 0 0 1 14 0" stroke="url(#lens-shimmer-grad)" strokeWidth="1.5" opacity="0.9" />
    <path d="M45 52 a10 10 0 0 0 10 0" stroke="#fffbe6" strokeWidth="0.5" opacity="0.75" />

    {/* Autofocus Assist LED - drifted pulse */}
    <circle cx="74" cy="30" r="2.5" stroke="#fbbf24" strokeWidth="0.6" />
    <circle cx="74" cy="30" r="1.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-1 5.3s ease-in-out infinite" }} />
  </svg>
));
TechCamera.displayName = "TechCamera";

const TechGpu = memo(() => (
  <svg
    className="tech-gpu w-48 h-28 transition-opacity duration-1000"
    viewBox="0 0 180 100"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* GPU Outer Casing Glow - breathing glow */}
    <polygon points="15,60 75,25 165,52 105,87" stroke="#d4af37" strokeWidth="4.5" opacity="0.3" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 6.1s ease-in-out infinite" }} />

    {/* Card Outer Shroud */}
    <polygon points="15,60 75,25 165,52 105,87" stroke="#d4af37" strokeWidth="1.2" />
    <polygon points="17,59 75,27 161,52 105,84" stroke="#fbbf24" strokeWidth="0.55" opacity="0.75" />

    {/* Thickness Edges */}
    <path d="M15 60 v10 L105 97 v-10 M165 52 v10 L105 97" stroke="#d4af37" strokeWidth="0.9" opacity="0.75" />

    {/* Exposed PCB & PCIe Connector Fingers */}
    <path d="M22 72 L95 93" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2 1" />
    <path d="M22 70 L95 91" stroke="#d4af37" strokeWidth="0.5" opacity="0.6" />

    {/* Heatsink Fin Array (Behind shroud vents) */}
    <path d="M24 45 L74 21 M24 49 L74 25" stroke="#d4af37" strokeWidth="0.5" opacity="0.5" />
    {/* Fine Vertical Fins lines */}
    <path d="M28 41 v8 M32 39 v8 M36 37 v8 M40 35 v8 M44 33 v8 M48 31 v8 M52 29 v8 M56 27 v8 M60 25 v8 M64 23 v8" stroke="#d4af37" strokeWidth="0.4" opacity="0.7" />

    {/* Tri-Fan Assembly */}
    {/* Fan 1 */}
    <g transform="translate(55, 52)">
      <ellipse cx="0" cy="0" rx="16" ry="9.5" stroke="#fbbf24" strokeWidth="1.0" />
      <ellipse cx="0" cy="0" rx="5" ry="3" stroke="#d4af37" strokeWidth="0.65" />
      {/* Blades */}
      <path d="M-5 -2 C-10 -5, -12 -1, -14 1 M5 2 C10 5, 12 1, 14 -1 M-8 6 C-12 7, -13 4, -13 2 M8 -6 C12 -7, 13 -4, 13 -2" stroke="#d4af37" strokeWidth="0.5" opacity="0.85" />
    </g>
    {/* Fan 2 */}
    <g transform="translate(95, 64)">
      <ellipse cx="0" cy="0" rx="16" ry="9.5" stroke="#fbbf24" strokeWidth="1.0" />
      <ellipse cx="0" cy="0" rx="5" ry="3" stroke="#d4af37" strokeWidth="0.65" />
      {/* Blades */}
      <path d="M-5 -2 C-10 -5, -12 -1, -14 1 M5 2 C10 5, 12 1, 14 -1 M-8 6 C-12 7, -13 4, -13 2 M8 -6 C12 -7, 13 -4, 13 -2" stroke="#d4af37" strokeWidth="0.5" opacity="0.85" />
    </g>
    {/* Fan 3 */}
    <g transform="translate(135, 76)">
      <ellipse cx="0" cy="0" rx="16" ry="9.5" stroke="#fbbf24" strokeWidth="1.0" />
      <ellipse cx="0" cy="0" rx="5" ry="3" stroke="#d4af37" strokeWidth="0.65" />
      {/* Blades */}
      <path d="M-5 -2 C-10 -5, -12 -1, -14 1 M5 2 C10 5, 12 1, 14 -1 M-8 6 C-12 7, -13 4, -13 2 M8 -6 C12 -7, 13 -4, 13 -2" stroke="#d4af37" strokeWidth="0.5" opacity="0.85" />
    </g>

    {/* Shroud Geometric Detail Panels */}
    <path d="M20 38 L150 78 M25 35 L145 71" stroke="#d4af37" strokeWidth="0.55" opacity="0.6" />

    {/* Specular Edge Shimmer */}
    <polygon points="15,60 75,25 165,52 105,87" stroke="url(#gpu-shimmer)" strokeWidth="1.2" />
  </svg>
));
TechGpu.displayName = "TechGpu";

const TechAiHead = memo(() => (
  <svg
    className="tech-ai-head w-40 h-56 transition-opacity duration-1000"
    viewBox="0 0 160 220"
    stroke="#d4af37"
    strokeWidth="0.85"
    fill="none"
  >
    {/* Head Outline Glow - breathing glow */}
    <path d="M125 210 L105 210 C85 210, 80 190, 80 175 C80 165, 65 160, 60 150 C55 140, 65 135, 65 125 C65 115, 53 110, 53 100 C53 90, 63 85, 67 75 C71 65, 67 55, 80 35 C93 15, 125 15, 135 35 C145 55, 150 100, 135 190 Z" stroke="#d4af37" strokeWidth="4.2" opacity="0.3" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 5.3s ease-in-out infinite" }} />

    {/* Head Outline */}
    <path d="M125 210 L105 210 C85 210, 80 190, 80 175 C80 165, 65 160, 60 150 C55 140, 65 135, 65 125 C65 115, 53 110, 53 100 C53 90, 63 85, 67 75 C71 65, 67 55, 80 35 C93 15, 125 15, 135 35 C145 55, 150 100, 135 190 Z" stroke="#d4af37" strokeWidth="1.2" />
    <path d="M122 206 L106 206 C88 206, 83 188, 83 174 C83 162, 67 157, 63 147 C58 138, 68 133, 68 123 C68 113, 56 108, 56 99 C56 90, 66 85, 70 75 C74 66, 70 57, 83 38 C95 19, 122 19, 132 38 C141 57, 146 99, 132 186 Z" stroke="#fbbf24" strokeWidth="0.6" opacity="0.75" />

    {/* Mechanical Panel Lines on Face */}
    <path d="M67 75 H80 M60 150 H80 M80 175 H105" stroke="#d4af37" strokeWidth="0.55" opacity="0.6" />
    <path d="M68 123 H85 L95 130" stroke="#d4af37" strokeWidth="0.5" opacity="0.5" />
    {/* Eye Socket detail */}
    <path d="M72 88 H82 L86 94 H76 Z" stroke="#fbbf24" strokeWidth="0.7" />
    <circle cx="79" cy="91" r="1.5" fill="#fbbf24" stroke="none" />

    {/* Cervical Spine (Vertebrae blocks in neck) */}
    <g transform="translate(100, 168)" stroke="#fbbf24" strokeWidth="0.8">
      <rect x="0" y="0" width="16" height="6" rx="1" />
      <rect x="-2" y="8" width="18" height="6" rx="1" />
      <rect x="-4" y="16" width="20" height="6" rx="1" />
      <rect x="-6" y="24" width="22" height="6" rx="1" />
      {/* Spinal Chord wire */}
      <path d="M8 -10 V38" stroke="#d4af37" strokeWidth="1.2" opacity="0.7" />
    </g>

    {/* Brain Cavity (Cerebral Cortex lobes outline) */}
    <path d="M92 48 C90 35, 125 35, 128 50 C130 65, 110 70, 105 85 C100 88, 90 85, 92 48 Z" stroke="#d4af37" strokeWidth="0.8" opacity="0.65" strokeDasharray="4 2" />

    {/* Brain Synapses / Neural Paths */}
    <g stroke="#d4af37" strokeWidth="0.6" opacity="0.75">
      <path d="M96 52 L110 46 L122 62 L106 74 Z M96 52 L122 62 M110 46 L106 74" />
      {/* Flowing signals - drifted speed */}
      <path d="M96 52 L110 46 L122 62 L106 74 Z" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="8 40" style={{ animation: "tech-pcb-flow 5.3s linear infinite" }} />
    </g>

    {/* Glowing Brain Nodes (Pulsing) - drifted sequence */}
    <circle cx="96" cy="52" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-1 5.3s ease-in-out infinite" }} />
    <circle cx="110" cy="46" r="2.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-3 5.3s ease-in-out infinite" }} />
    <circle cx="122" cy="62" r="3.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-5 5.3s ease-in-out infinite" }} />
    <circle cx="106" cy="74" r="2.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-7 5.3s ease-in-out infinite" }} />
  </svg>
));
TechAiHead.displayName = "TechAiHead";

const TechLotus = memo(() => (
  <svg
    className="tech-lotus w-[460px] h-24 transition-opacity duration-1000"
    viewBox="0 0 400 100"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* Central Core Microchip Glow - breathing glow */}
    <rect x="188" y="45" width="24" height="24" rx="2" stroke="#d4af37" strokeWidth="4.5" opacity="0.35" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 8.9s ease-in-out infinite" }} />

    {/* Central Core Microchip */}
    <rect x="188" y="45" width="24" height="24" rx="2" stroke="#d4af37" strokeWidth="1.2" />
    <rect x="192" y="49" width="16" height="16" stroke="#fbbf24" strokeWidth="0.65" />
    <circle cx="200" cy="57" r="4" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />

    {/* Detailed Symmetrical Petals */}
    {/* Center Top Petal */}
    <path d="M200 45 C205 30, 205 15, 200 5 C195 15, 195 30, 200 45 Z" stroke="#fbbf24" strokeWidth="1.15" />
    <path d="M200 40 C202 28, 202 18, 200 10 C198 18, 198 28, 200 40 Z" stroke="#d4af37" strokeWidth="0.5" opacity="0.75" />

    {/* Inner Left Petal */}
    <path d="M188 50 C175 42, 168 28, 168 15 C180 22, 185 38, 188 50 Z" stroke="#fbbf24" strokeWidth="1.0" />
    <path d="M188 47 C178 39, 173 29, 173 20 C182 25, 186 38, 188 47 Z" stroke="#d4af37" strokeWidth="0.5" opacity="0.75" />

    {/* Inner Right Petal */}
    <path d="M212 50 C225 42, 232 28, 232 15 C220 22, 215 38, 212 50 Z" stroke="#fbbf24" strokeWidth="1.0" />
    <path d="M212 47 C222 39, 227 29, 227 20 C218 25, 214 38, 212 47 Z" stroke="#d4af37" strokeWidth="0.5" opacity="0.75" />

    {/* Middle Left Petal */}
    <path d="M188 57 C165 52, 145 42, 145 28 C162 38, 178 48, 188 57 Z" stroke="#d4af37" strokeWidth="0.95" />
    <path d="M188 57 C170 54, 155 45, 155 35 C168 42, 180 50, 188 57 Z" stroke="#fbbf24" strokeWidth="0.5" opacity="0.75" />

    {/* Middle Right Petal */}
    <path d="M212 57 C235 52, 255 42, 255 28 C238 38, 222 48, 212 57 Z" stroke="#d4af37" strokeWidth="0.95" />
    <path d="M212 57 C230 54, 245 45, 245 35 C232 42, 220 50, 212 57 Z" stroke="#fbbf24" strokeWidth="0.5" opacity="0.75" />

    {/* Outer Bottom Left Petal */}
    <path d="M188 65 C155 68, 125 65, 125 50 C145 56, 172 61, 188 65 Z" stroke="#d4af37" strokeWidth="0.95" />
    {/* Outer Bottom Right Petal */}
    <path d="M212 65 C245 68, 275 65, 275 50 C255 56, 228 61, 212 65 Z" stroke="#d4af37" strokeWidth="0.95" />

    {/* Symmetrical Wings Circuit Board Traces */}
    {/* Left Trace */}
    <path d="M188 57 H125 L105 67 H15 M152 57 V47 H85" stroke="#d4af37" strokeWidth="0.8" opacity="0.5" />
    {/* Right Trace */}
    <path d="M212 57 H275 L295 67 H385 M248 57 V47 H315" stroke="#d4af37" strokeWidth="0.8" opacity="0.5" />

    {/* Glowing energy flow travelling outward - drifted speed */}
    <path
      d="M188 57 H125 L105 67 H15 M152 57 V47 H85"
      strokeWidth="2.0"
      stroke="#fbbf24"
      strokeDasharray="25 150"
      filter="url(#engraved-bloom)"
      opacity="0.8"
      style={{ animation: "tech-pcb-flow 8.9s linear infinite", animationDelay: "2s" }}
    />
    <path
      d="M212 57 H275 L295 67 H385 M248 57 V47 H315"
      strokeWidth="2.0"
      stroke="#fbbf24"
      strokeDasharray="25 150"
      filter="url(#engraved-bloom)"
      opacity="0.8"
      style={{ animation: "tech-pcb-flow 8.9s linear infinite", animationDelay: "2s" }}
    />

    {/* Node terminals */}
    <circle cx="15" cy="67" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="385" cy="67" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="85" cy="47" r="2.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="315" cy="47" r="2.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
  </svg>
));
TechLotus.displayName = "TechLotus";

const TechBinary = memo(({ className }: { className?: string }) => (
  <div className={`font-mono text-[10px] leading-relaxed select-none tracking-widest px-3 py-1 border-l border-r border-gold-vintage/30 ${className}`}>
    {/* Small horizontal ticks on left and right */}
    <div className="absolute left-0 top-0 bottom-0 w-1 border-t border-b border-gold-vintage/40"></div>
    <div className="absolute right-0 top-0 bottom-0 w-1 border-t border-b border-gold-vintage/40"></div>

    {/* Drifted binary flickers */}
    <div style={{ animation: "tech-binary-1 6.1s ease-in-out infinite", filter: "drop-shadow(0 0 1.5px rgba(212,175,55,0.6))" }}>0101</div>
    <div style={{ animation: "tech-binary-2 6.3s ease-in-out infinite", filter: "drop-shadow(0 0 1.5px rgba(212,175,55,0.6))" }}>1010</div>
    <div style={{ animation: "tech-binary-3 6.7s ease-in-out infinite", filter: "drop-shadow(0 0 1.5px rgba(212,175,55,0.6))" }}>01011</div>
    <div className="text-amber-500/50" style={{ animation: "tech-binary-4 7.1s ease-in-out infinite", filter: "drop-shadow(0 0 1.2px rgba(245,158,11,0.45))" }}>000980</div>
    <div style={{ animation: "tech-binary-5 7.3s ease-in-out infinite", filter: "drop-shadow(0 0 1.5px rgba(212,175,55,0.6))" }}>10101</div>
  </div>
));
TechBinary.displayName = "TechBinary";

const TechEquation = memo(({ className }: { className?: string }) => (
  <div
    className={`font-serif text-[11px] italic leading-relaxed select-none space-y-1 pl-4 border-l border-gold-vintage/20 ${className}`}
    style={{
      backgroundImage: "linear-gradient(90deg, #d4af37 0%, #d4af37 35%, #fffbe6 50%, #d4af37 65%, #d4af37 100%)",
      backgroundSize: "200px 100%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "tech-text-shimmer 7.9s linear infinite",
      filter: "drop-shadow(0 0 2.0px rgba(212,175,55,0.75))"
    }}
  >
    {/* Fine brackets or markings */}
    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold-vintage/40 to-transparent"></div>
    <div>E = mc²</div>
    <div>∇ · E = ρ/ε₀</div>
  </div>
));
TechEquation.displayName = "TechEquation";

const TechCode = memo(({ className }: { className?: string }) => (
  <div
    className={`font-mono text-[9px] leading-normal text-left select-none pl-3 border-l border-gold-vintage/20 ${className}`}
    style={{
      backgroundImage: "linear-gradient(90deg, #d4af37 0%, #d4af37 35%, #fffbe6 50%, #d4af37 65%, #d4af37 100%)",
      backgroundSize: "180px 100%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "tech-text-shimmer 8.3s linear infinite",
      filter: "drop-shadow(0 0 1.8px rgba(212,175,55,0.65))"
    }}
  >
    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold-vintage/30 to-transparent"></div>
    <div>int main() &#123;</div>
    <div className="pl-3">consciousness = true;</div>
    <div className="pl-3">while (ignorance) &#123;</div>
    <div className="pl-6">awaken();</div>
    <div className="pl-3">&#125;</div>
    <div className="pl-3">return liberation;</div>
    <div>&#125;</div>
  </div>
));
TechCode.displayName = "TechCode";

const TechTerminal = memo(() => (
  <svg
    className="tech-terminal w-32 h-24 transition-opacity duration-1000"
    viewBox="0 0 120 90"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* Frame Base Glow - breathing glow */}
    <rect x="5" y="5" width="110" height="80" rx="3" stroke="#d4af37" strokeWidth="3" opacity="0.25" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 8.3s ease-in-out infinite" }} />

    {/* Outer Shell Window */}
    <rect x="5" y="5" width="110" height="80" rx="3" stroke="#d4af37" strokeWidth="1.0" />
    <path d="M5 18 H115" stroke="#fbbf24" strokeWidth="0.6" opacity="0.8" />

    {/* Window Controls */}
    <circle cx="12" cy="11" r="2.0" stroke="#fbbf24" strokeWidth="0.65" />
    <circle cx="20" cy="11" r="2.0" stroke="#fbbf24" strokeWidth="0.65" opacity="0.7" />
    <circle cx="28" cy="11" r="2.0" stroke="#fbbf24" strokeWidth="0.65" opacity="0.7" />

    {/* Terminal text traces */}
    <g transform="translate(10, 24)" fontFamily="monospace" fontSize="6" fill="#fbbf24" stroke="none">
      <text x="0" y="8" fillOpacity="0.95">&gt; npm run dev</text>
      <text x="0" y="18" fillOpacity="0.8">vite v6.4.3</text>
      <text x="0" y="28" fillOpacity="0.8">Local: http://localhost:5173</text>
      <text x="0" y="38" fillOpacity="0.95">ready in 320ms</text>
      <text x="0" y="48" fillOpacity="0.95">&gt; _</text>
    </g>

    {/* Blinking cursor simulation - drifted rate */}
    <rect x="18" y="70" width="4" height="6" fill="#fbbf24" stroke="none" style={{ animation: "terminal-cursor 1.3s infinite" }} />
  </svg>
));
TechTerminal.displayName = "TechTerminal";

const TechCloudApi = memo(() => (
  <svg
    className="tech-cloud-api w-28 h-24 transition-opacity duration-1000"
    viewBox="0 0 100 80"
    stroke="#d4af37"
    strokeWidth="0.8"
    fill="none"
  >
    {/* Cloud silhouette - breathing glow */}
    <path d="M25 55 A15 15 0 0 1 25 25 A20 20 0 0 1 65 20 A18 18 0 0 1 80 35 A15 15 0 0 1 75 55 Z" stroke="#d4af37" strokeWidth="3.5" opacity="0.25" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 7.1s ease-in-out infinite" }} />
    <path d="M25 55 A15 15 0 0 1 25 25 A20 20 0 0 1 65 20 A18 18 0 0 1 80 35 A15 15 0 0 1 75 55 Z" stroke="#d4af37" strokeWidth="1.2" />
    <path d="M28 52 A12 12 0 0 1 28 28 A17 17 0 0 1 62 24 A15 15 0 0 1 74 37 A12 12 0 0 1 71 52 Z" stroke="#fbbf24" strokeWidth="0.5" opacity="0.65" />

    {/* CPU Core - drifted pulse */}
    <rect x="42" y="32" width="16" height="16" rx="1.5" stroke="#fbbf24" strokeWidth="0.9" style={{ animation: "tech-lotus-pulse 5.9s ease-in-out infinite" }} />
    <circle cx="50" cy="40" r="3.5" stroke="#d4af37" strokeWidth="0.6" />

    {/* API text label */}
    <g transform="translate(50, 42)" fontFamily="monospace" fontSize="5" fill="#fbbf24" fontWeight="bold" stroke="none" textAnchor="middle">
      <text y="14" fillOpacity="0.9">API</text>
    </g>

    {/* Circuit lines */}
    <path d="M42 40 H20 V65 M58 40 H80 V65 M50 32 V12 M50 48 V65" stroke="#d4af37" strokeWidth="0.6" opacity="0.7" />
    <circle cx="20" cy="65" r="1.5" fill="#fbbf24" stroke="none" />
    <circle cx="80" cy="65" r="1.5" fill="#fbbf24" stroke="none" />
    <circle cx="50" cy="12" r="1.5" fill="#fbbf24" stroke="none" />
  </svg>
));
TechCloudApi.displayName = "TechCloudApi";

const TechDatabase = memo(() => (
  <svg
    className="tech-database w-20 h-28 transition-opacity duration-1000"
    viewBox="0 0 80 110"
    stroke="#d4af37"
    strokeWidth="0.85"
    fill="none"
  >
    {/* Cylinder 1 (Top) - drifted LEDs */}
    <g transform="translate(0, 10)">
      <ellipse cx="40" cy="15" rx="25" ry="7" stroke="#fbbf24" strokeWidth="1.0" />
      <path d="M15 15 v16 c0 4 50 4 50 0 v-16" stroke="#d4af37" strokeWidth="1.2" />
      <ellipse cx="40" cy="31" rx="25" ry="7" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
      <path d="M30 19 v10 M50 19 v10" stroke="#d4af37" strokeWidth="0.4" opacity="0.6" />
      <circle cx="25" cy="23" r="1.2" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-1 3.3s ease-in-out infinite" }} />
      <circle cx="32" cy="25" r="1.2" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-3 3.7s ease-in-out infinite" }} />
    </g>

    {/* Cylinder 2 (Middle) - drifted LEDs */}
    <g transform="translate(0, 36)">
      <ellipse cx="40" cy="15" rx="25" ry="7" stroke="#fbbf24" strokeWidth="1.0" />
      <path d="M15 15 v16 c0 4 50 4 50 0 v-16" stroke="#d4af37" strokeWidth="1.2" />
      <ellipse cx="40" cy="31" rx="25" ry="7" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
      <path d="M30 19 v10 M50 19 v10" stroke="#d4af37" strokeWidth="0.4" opacity="0.6" />
      <circle cx="25" cy="23" r="1.2" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-2 4.1s ease-in-out infinite" }} />
      <circle cx="32" cy="25" r="1.2" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-4 4.3s ease-in-out infinite" }} />
    </g>

    {/* Cylinder 3 (Bottom) - drifted LEDs */}
    <g transform="translate(0, 62)">
      <ellipse cx="40" cy="15" rx="25" ry="7" stroke="#fbbf24" strokeWidth="1.0" />
      <path d="M15 15 v16 c0 4 50 4 50 0 v-16" stroke="#d4af37" strokeWidth="1.2" />
      <ellipse cx="40" cy="31" rx="25" ry="7" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
      <path d="M30 19 v10 M50 19 v10" stroke="#d4af37" strokeWidth="0.4" opacity="0.6" />
      <circle cx="25" cy="23" r="1.2" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-5 4.7s ease-in-out infinite" }} />
      <circle cx="32" cy="25" r="1.2" fill="#fbbf24" stroke="none" style={{ animation: "tech-node-7 5.1s ease-in-out infinite" }} />
    </g>
  </svg>
));
TechDatabase.displayName = "TechDatabase";

const TechWaveform = memo(() => (
  <svg
    className="tech-waveform w-32 h-20 transition-opacity duration-1000"
    viewBox="0 0 120 70"
    stroke="#d4af37"
    strokeWidth="0.85"
    fill="none"
  >
    {/* Grid coordinates */}
    <path d="M10 35 H115 M15 10 V60" stroke="#d4af37" strokeWidth="0.45" strokeDasharray="2 3" opacity="0.6" />
    <path d="M110 33 L115 35 L110 37 M13 15 L15 10 L17 15" stroke="#d4af37" strokeWidth="0.65" />

    {/* Calibration ticks */}
    <path d="M35 32 v6 M55 32 v6 M75 32 v6 M95 32 v6 M12 15 h6 M12 25 h6 M12 45 h6 M12 55 h6" stroke="#fbbf24" strokeWidth="0.5" />

    {/* Mathematical Sine Wave */}
    <path
      d="M15 35 Q 30 10, 45 35 T 75 35 T 105 35 H115"
      stroke="#d4af37"
      strokeWidth="1.15"
    />
    {/* Wave flow with breathing bloom */}
    <path
      d="M15 35 Q 30 10, 45 35 T 75 35 T 105 35 H115"
      stroke="#fbbf24"
      strokeWidth="2.0"
      strokeDasharray="12 48"
      filter="url(#engraved-bloom)"
      opacity="0.85"
      style={{ animation: "tech-wave-flow 6.3s linear infinite, tech-bloom-breathe 6.7s ease-in-out infinite" }}
    />
    <path
      d="M15 35 Q 30 10, 45 35 T 75 35 T 105 35 H115"
      stroke="#fffbe6"
      strokeWidth="0.8"
      strokeDasharray="12 48"
      opacity="1.0"
      style={{ animation: "tech-wave-flow 6.3s linear infinite" }}
    />

    {/* Formula Label */}
    <g transform="translate(85, 18)" fontFamily="serif" fontSize="5.5" fontStyle="italic" fill="#fbbf24" stroke="none">
      <text>Ψ(x,t) = Ae^(iφ)</text>
    </g>
  </svg>
));
TechWaveform.displayName = "TechWaveform";
