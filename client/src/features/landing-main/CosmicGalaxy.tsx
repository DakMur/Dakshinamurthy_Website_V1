import { useEffect, useRef, memo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface GalaxyProps {
  isWarping: boolean;
}

export default function CosmicGalaxy({ isWarping }: GalaxyProps) {
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
            vec4 texColor = texture2D(uTexture, gl_PointCoord);
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
            vec4 texColor = texture2D(uTexture, gl_PointCoord);
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
            vec4 texColor = texture2D(uTexture, gl_PointCoord);
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
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 2;

    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (starsMaterial) starsMaterial.uniforms.uTime.value = elapsedTime;
      if (dustMaterial) dustMaterial.uniforms.uTime.value = elapsedTime;
      if (sparklesMaterial) sparklesMaterial.uniforms.uTime.value = elapsedTime;

      if (galaxyMaterial) {
        galaxyMaterial.opacity = 0.6 + 0.16 * Math.sin(elapsedTime * (Math.PI * 2 / 14));
        galaxyMaterial.size = parameters.size * (0.92 + 0.08 * Math.sin(elapsedTime * (Math.PI * 2 / 14)));
      }

      const currentSpeed = isWarping ? parameters.rotationSpeed * 12 : parameters.rotationSpeed;
      galaxyGroup.rotation.y += delta * currentSpeed;
      
      if (ambientStars) {
        ambientStars.rotation.y += delta * currentSpeed * 0.35;
      }
      if (cosmicDust) {
        cosmicDust.rotation.y -= delta * currentSpeed * 0.2;
      }

      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();

    // Cleanup System
    return () => {
      window.removeEventListener("resize", handleResize);
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* CSS Keyframes for travelling light and sequential ambient animations */}
      <style dangerouslySetInnerHTML={{ __html: `
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
            <stop offset="0%" stop-color="#d4af37">
              <animate attributeName="offset" values="-1; 2" dur="7s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stop-color="#fffbe6" stop-opacity="0.8">
              <animate attributeName="offset" values="-0.5; 2.5" dur="7s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="#d4af37">
              <animate attributeName="offset" values="0; 3" dur="7s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Drone Casing Shimmer Gradient */}
          <linearGradient id="drone-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#d4af37" />
            <stop offset="50%" stop-color="#fffbe6" stop-opacity="0.75">
              <animate attributeName="offset" values="-0.5; 1.5" dur="6.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="#d4af37" />
          </linearGradient>

          {/* Camera Lens Reflection Shimmer */}
          <linearGradient id="lens-shimmer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.3" />
            <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95">
              <animate attributeName="offset" values="-0.5; 1.5" dur="7.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.3" />
          </linearGradient>

          {/* GPU Casing Shimmer Gradient */}
          <linearGradient id="gpu-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#d4af37" />
            <stop offset="50%" stop-color="#fffbe6" stop-opacity="0.8">
              <animate attributeName="offset" values="-0.5; 1.5" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="#d4af37" />
          </linearGradient>
        </defs>
      </svg>

      {/* 1. Technology Background Layer (breathing ambient opacity, thin gold outline strokes) - sits behind canvas */}
      <div 
        className="absolute inset-0 z-0 text-gold-vintage mix-blend-screen hidden md:block select-none pointer-events-none"
        style={{ animation: "tech-ambient-light 16s ease-in-out infinite" }}
      >
        
        {/* Top Left Cluster */}
        <div className="absolute left-[4vw] top-[18vh] opacity-95">
          <TechController />
        </div>
        <TechBinary className="absolute left-[16vw] top-[18vh] opacity-85 text-gold-vintage" />

        {/* Middle Left Cluster */}
        <div className="absolute left-[2vw] top-[40vh] opacity-90">
          <TechPcb />
        </div>

        {/* Bottom Left Cluster */}
        <div className="absolute left-[3vw] bottom-[15vh] opacity-95">
          <TechRoboticArm />
        </div>
        <TechCode className="absolute left-[2vw] bottom-[4vh] opacity-70 text-gold-vintage" />

        {/* Top Right Cluster */}
        <div className="absolute right-[12vw] top-[18vh] opacity-100">
          <TechDrone />
        </div>

        {/* Middle Right Cluster */}
        <div className="absolute right-[2vw] top-[22vh] opacity-95">
          <TechNeural />
        </div>
        <div className="absolute right-[21vw] top-[32vh] opacity-90">
          <TechCamera />
        </div>
        <div className="absolute right-[17vw] top-[37vh] font-mono text-[11px] leading-relaxed opacity-80 text-gold-vintage">
          <div style={{ animation: "tech-binary-1 6s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>0101</div>
          <div style={{ animation: "tech-binary-3 6s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>0001</div>
          <div style={{ animation: "tech-binary-5 6s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>0101</div>
        </div>

        {/* Bottom Right Cluster */}
        <div className="absolute right-[19vw] bottom-[12vh] opacity-95">
          <TechGpu />
        </div>
        <div className="absolute right-[2vw] bottom-[4vh] opacity-100">
          <TechAiHead />
        </div>
        <TechEquation className="absolute right-[19vw] bottom-[4vh] opacity-80 text-gold-vintage" />

        {/* Bottom Center Cluster */}
        <div className="absolute bottom-[0vh] left-1/2 -translate-x-1/2 opacity-100">
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
    className="tech-controller w-36 h-24 transition-opacity duration-1000" 
    viewBox="0 0 160 100" 
    stroke="#d4af37" 
    strokeWidth="0.85" 
    fill="none"
  >
    {/* Layered outline: Bloom Layer + Base Stroke + Specular Highlight */}
    <path d="M30 20 h100 c20 0, 30 10, 20 40 l-10 30 c-5 15, -20 15, -30 0 l-10 -15 h-20 l-10 15 c-10 15, -25 15, -30 0 l-10 -30 c-10 -30, 0 -40, 20 -40 Z" stroke="#d4af37" strokeWidth="4.2" opacity="0.85" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 7s ease-in-out infinite" }} />
    <path d="M30 20 h100 c20 0, 30 10, 20 40 l-10 30 c-5 15, -20 15, -30 0 l-10 -15 h-20 l-10 15 c-10 15, -25 15, -30 0 l-10 -30 c-10 -30, 0 -40, 20 -40 Z" stroke="#fbbf24" strokeWidth="1.1" />
    <path d="M30 20 h100 c20 0, 30 10, 20 40 l-10 30 c-5 15, -20 15, -30 0 l-10 -15 h-20 l-10 15 c-10 15, -25 15, -30 0 l-10 -30 c-10 -30, 0 -40, 20 -40 Z" stroke="url(#controller-shimmer)" strokeWidth="0.3" opacity="0.9" />

    {/* Grips inner detail */}
    <path d="M22 45 c2 -10, 8 -15, 18 -15 M138 45 c-2 -10, -8 -15, -18 -15" strokeWidth="0.55" opacity="0.75" />

    {/* Analog sticks */}
    <circle cx="58" cy="58" r="10" stroke="#d4af37" strokeWidth="0.7" />
    <circle cx="58" cy="58" r="4" fill="#fbbf24" fillOpacity="0.85" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="102" cy="58" r="10" stroke="#d4af37" strokeWidth="0.7" />
    <circle cx="102" cy="58" r="4" fill="#fbbf24" fillOpacity="0.85" filter="url(#engraved-bloom)" stroke="none" />

    {/* D-Pad */}
    <path d="M36 44 h14 M43 37 v14" stroke="#fbbf24" strokeWidth="1.5" filter="url(#engraved-bloom)" />
    <circle cx="43" cy="44" r="9" strokeWidth="0.6" opacity="0.85" />

    {/* Action buttons */}
    <circle cx="120" cy="36" r="3" fill="#d4af37" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="0.6" filter="url(#engraved-bloom)" />
    <circle cx="110" cy="44" r="3" fill="#d4af37" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="0.6" filter="url(#engraved-bloom)" />
    <circle cx="130" cy="44" r="3" fill="#d4af37" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="0.6" filter="url(#engraved-bloom)" />
    <circle cx="120" cy="52" r="3" fill="#d4af37" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="0.6" filter="url(#engraved-bloom)" />

    {/* Select / Start */}
    <path d="M70 44 l8 -4 M82 44 l8 -4" strokeWidth="1.15" />
    {/* Triggers */}
    <path d="M42 19 V13 C42 10, 52 10, 52 13 V19 M108 19 V13 C108 10, 118 10, 118 13 V19" strokeWidth="0.9" opacity="0.9" />
  </svg>
));
TechController.displayName = "TechController";

const TechPcb = memo(() => (
  <svg className="tech-pcb w-40 h-40 transition-opacity duration-1000" viewBox="0 0 120 120" stroke="#d4af37" strokeWidth="0.8" fill="none">
    {/* Central Chip Board (outer border) - layered bloom */}
    <rect x="35" y="35" width="50" height="50" rx="4" ry="4" stroke="#d4af37" strokeWidth="4.5" opacity="0.85" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 7.5s ease-in-out infinite" }} />
    <rect x="35" y="35" width="50" height="50" rx="4" ry="4" stroke="#fbbf24" strokeWidth="1.2" />
    <rect x="39" y="39" width="42" height="42" rx="2" strokeWidth="0.55" opacity="0.75" />
    <circle cx="60" cy="60" r="14" strokeWidth="1.0" />
    <circle cx="60" cy="60" r="7" fill="#fbbf24" fillOpacity="0.85" filter="url(#engraved-bloom)" stroke="none" />
    
    {/* Detailed chip pins */}
    <path d="M45 35 V30 M55 35 V30 M65 35 V30 M75 35 V30 M45 85 V90 M55 85 V90 M65 85 V90 M75 85 V90 M35 45 H30 M35 55 H30 M35 65 H30 M35 75 H30 M85 45 H90 M85 55 H90 M85 65 H90 M85 75 H90" strokeWidth="0.9" />
    
    {/* Complex routing traces (Base static track) */}
    <path d="M25 20 H5 V70 M30 30 L10 30 V50 M35 45 H15 M35 55 L18 55 L8 65 V85 M35 65 L18 65 L8 75 V100 M35 75 H3 M85 45 H108 L116 53 V80 M85 75 H115 M60 35 V12 H10 M60 85 V110 H105 L115 100" strokeWidth="0.7" opacity="0.45" />
    
    {/* Energy flow trace (2.0x brighter, thicker traveling highlight) */}
    <path 
      d="M25 20 H5 V70 M30 30 L10 30 V50 M35 45 H15 M35 55 L18 55 L8 65 V85 M35 65 L18 65 L8 75 V100 M35 75 H3 M85 45 H108 L116 53 V80 M85 75 H115 M60 35 V12 H10 M60 85 V110 H105 L115 100" 
      strokeWidth="2.8" 
      stroke="#fbbf24"
      strokeDasharray="22 170" 
      filter="url(#engraved-bloom)"
      opacity="0.75"
      style={{ animation: "tech-pcb-flow 8s linear infinite" }}
    />
    <path 
      d="M25 20 H5 V70 M30 30 L10 30 V50 M35 45 H15 M35 55 L18 55 L8 65 V85 M35 65 L18 65 L8 75 V100 M35 75 H3 M85 45 H108 L116 53 V80 M85 75 H115 M60 35 V12 H10 M60 85 V110 H105 L115 100" 
      strokeWidth="1.35" 
      stroke="#fffbe6"
      strokeDasharray="22 170" 
      opacity="1.0"
      style={{ animation: "tech-pcb-flow 8s linear infinite" }}
    />
    
    {/* Connection nodes */}
    <circle cx="15" cy="45" r="1.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="3" cy="75" r="1.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="116" cy="80" r="1.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="10" cy="12" r="1.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="105" cy="110" r="1.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
  </svg>
));
TechPcb.displayName = "TechPcb";

const TechRoboticArm = memo(() => (
  <svg className="tech-robotic-arm w-36 h-48 transition-opacity duration-1000" viewBox="0 0 150 200" stroke="#d4af37" strokeWidth="0.8" fill="none">
    {/* Base platform */}
    <rect x="40" y="180" width="70" height="12" rx="2" strokeWidth="1.15" />
    <path d="M55 180 L65 160 H85 L95 180" strokeWidth="0.7" />

    {/* Joint 1 (Base pivot, sequential breathing) */}
    <circle cx="75" cy="160" r="9" stroke="#d4af37" strokeWidth="1.3" />
    <circle cx="75" cy="160" r="4.0" fill="#fbbf24" filter="url(#engraved-bloom)" style={{ animation: "tech-joint-base 7s ease-in-out infinite" }} stroke="none" />
    
    {/* Lower Arm */}
    <path d="M70 160 L45 105 M80 160 L55 105" stroke="#d4af37" strokeWidth="0.9" opacity="0.95" />
    <path d="M68 150 L53 115" strokeWidth="0.65" opacity="0.7" strokeDasharray="3 2" />
    
    {/* Joint 2 (Elbow, sequential breathing) */}
    <circle cx="50" cy="105" r="8" stroke="#d4af37" strokeWidth="1.3" />
    <circle cx="50" cy="105" r="3.5" fill="#fbbf24" filter="url(#engraved-bloom)" style={{ animation: "tech-joint-elbow 7s ease-in-out infinite" }} stroke="none" />
    
    {/* Upper Arm - layered bloom */}
    <path d="M50 105 L95 65" stroke="#d4af37" strokeWidth="4.2" opacity="0.85" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 8s ease-in-out infinite" }} />
    <path d="M50 105 L95 65" stroke="#fbbf24" strokeWidth="1.1" />
    <path d="M56 109 L86 82" strokeWidth="0.7" opacity="0.85" />
    
    {/* Joint 3 (Wrist, sequential breathing) */}
    <circle cx="95" cy="65" r="6" stroke="#d4af37" strokeWidth="1.15" />
    <circle cx="95" cy="65" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-joint-wrist 7s ease-in-out infinite" }} />
    
    {/* Gripper/Effector mechanism */}
    <path d="M95 65 L112 50 M92 68 L108 53" strokeWidth="0.9" />
    <path d="M112 50 h12 M112 50 L118 40 M118 40 h10" strokeWidth="0.9" />
    <path d="M108 53 v12 M108 53 L114 63 M114 63 h10" strokeWidth="0.9" />
  </svg>
));
TechRoboticArm.displayName = "TechRoboticArm";

const TechDrone = memo(() => (
  <svg className="tech-drone w-44 h-28 transition-opacity duration-1000" viewBox="0 0 180 120" stroke="#d4af37" strokeWidth="0.8" fill="none">
    {/* Detailed quadcopter body - layered bloom */}
    <rect x="72" y="48" width="36" height="24" rx="6" stroke="#d4af37" strokeWidth="4.5" opacity="0.85" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 6.8s ease-in-out infinite" }} />
    <rect x="72" y="48" width="36" height="24" rx="6" stroke="url(#drone-shimmer)" strokeWidth="1.2" />
    <circle cx="90" cy="60" r="5" />
    <path d="M85 48 H95 M85 72 H95" strokeWidth="0.7" />
    
    {/* Carbon fiber arm structures */}
    <path d="M75 52 L35 25 M105 52 L145 25 M75 68 L35 95 M105 68 L145 95" strokeWidth="1.6" />
    
    {/* Motor Pods */}
    <circle cx="35" cy="25" r="4.5" fill="#fbbf24" fillOpacity="0.85" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="145" cy="25" r="4.5" fill="#fbbf24" fillOpacity="0.85" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="35" cy="95" r="4.5" fill="#fbbf24" fillOpacity="0.85" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="145" cy="95" r="4.5" fill="#fbbf24" fillOpacity="0.85" filter="url(#engraved-bloom)" stroke="none" />
    
    {/* Propellers */}
    <ellipse cx="35" cy="25" rx="20" ry="3.5" opacity="0.8" />
    <ellipse cx="145" cy="25" rx="20" ry="3.5" opacity="0.8" />
    <ellipse cx="35" cy="95" rx="20" ry="3.5" opacity="0.8" />
    <ellipse cx="145" cy="95" rx="20" ry="3.5" opacity="0.8" />
    
    {/* Navigation LED lights (glowing highlights) */}
    <circle cx="35" cy="25" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="145" cy="25" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
  </svg>
));
TechDrone.displayName = "TechDrone";

const TechNeural = memo(() => (
  <svg className="tech-neural w-44 h-36 transition-opacity duration-1000" viewBox="0 0 180 150" stroke="#d4af37" strokeWidth="0.5" fill="none">
    {/* Constellation lines */}
    <path d="M30 40 L80 20 M30 40 L60 80 M80 20 L140 30 M80 20 L110 70 M80 20 L60 80 M140 30 L150 90 M140 30 L110 70 M60 80 L110 70 M60 80 L40 120 M60 80 L90 130 M110 70 L150 90 M110 70 L90 130 M150 90 L90 130 M90 130 L40 120" strokeOpacity="0.8" />
    
    {/* Staggered traveling highlight (2.0x brighter, thicker, delay 2.6s) */}
    <path 
      d="M30 40 L80 20 M80 20 L110 70 M110 70 L150 90 M150 90 L90 130" 
      strokeWidth="2.8" 
      stroke="#fbbf24" 
      strokeDasharray="22 170"
      filter="url(#engraved-bloom)"
      opacity="0.75"
      style={{ animation: "tech-pcb-flow 8s linear infinite", animationDelay: "2.6s" }}
    />
    <path 
      d="M30 40 L80 20 M80 20 L110 70 M110 70 L150 90 M150 90 L90 130" 
      strokeWidth="1.35" 
      stroke="#fffbe6" 
      strokeDasharray="22 170"
      opacity="1.0"
      style={{ animation: "tech-pcb-flow 8s linear infinite", animationDelay: "2.6s" }}
    />
    
    {/* Sequential node signals */}
    <circle cx="30" cy="40" r="4.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-1 6.5s ease-in-out infinite" }} />
    <circle cx="80" cy="20" r="3.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-3 6.5s ease-in-out infinite" }} />
    <circle cx="140" cy="30" r="4.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-5 6.5s ease-in-out infinite" }} />
    <circle cx="60" cy="80" r="3.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-2 6.5s ease-in-out infinite" }} />
    <circle cx="110" cy="70" r="4.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-4 6.5s ease-in-out infinite" }} />
    <circle cx="150" cy="90" r="3.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-6 6.5s ease-in-out infinite" }} />
    <circle cx="90" cy="130" r="4.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-7 6.5s ease-in-out infinite" }} />
  </svg>
));
TechNeural.displayName = "TechNeural";

const TechCamera = memo(() => (
  <svg className="tech-camera w-20 h-16 transition-opacity duration-1000" viewBox="0 0 80 60" stroke="#d4af37" strokeWidth="0.8" fill="none">
    {/* Camera body details - layered bloom */}
    <rect x="8" y="14" width="64" height="40" rx="5" stroke="#d4af37" strokeWidth="4.2" opacity="0.85" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 7.2s ease-in-out infinite" }} />
    <rect x="8" y="14" width="64" height="40" rx="5" stroke="#fbbf24" strokeWidth="1.1" />
    <path d="M26 14 L31 7 H49 L52 15" strokeWidth="1" />
    {/* Lens assembly */}
    <circle cx="40" cy="34" r="14" strokeWidth="1.3" filter="url(#engraved-bloom)" />
    <circle cx="40" cy="34" r="9" strokeWidth="0.9" />
    {/* Lens reflection / highlight crescent (Animated narrow shimmer gradient sweep) */}
    <path 
      d="M35 30 a7 7 0 0 1 10 0" 
      stroke="url(#lens-shimmer-grad)"
      strokeWidth="1.25" 
      opacity="0.95" 
    />
    {/* Flash LED */}
    <circle cx="60" cy="22" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
  </svg>
));
TechCamera.displayName = "TechCamera";

const TechGpu = memo(() => (
  <svg className="tech-gpu w-44 h-24 transition-opacity duration-1000" viewBox="0 0 180 90" stroke="#d4af37" strokeWidth="0.85" fill="none">
    {/* Casing and border lines - layered bloom */}
    <rect x="10" y="15" width="160" height="60" rx="4" stroke="#d4af37" strokeWidth="4.5" opacity="0.85" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 7.6s ease-in-out infinite" }} />
    <rect x="10" y="15" width="160" height="60" rx="4" stroke="url(#gpu-shimmer)" strokeWidth="1.2" />
    <rect x="14" y="19" width="152" height="52" rx="2" strokeWidth="0.55" opacity="0.7" />
    {/* Tri-fan layout */}
    <circle cx="45" cy="45" r="17" strokeWidth="0.9" />
    <circle cx="90" cy="45" r="17" strokeWidth="0.9" />
    <circle cx="135" cy="45" r="17" strokeWidth="0.9" />
    {/* Fan blades (completely static) */}
    <path d="M45 28 V62 M28 45 H62" strokeWidth="0.55" opacity="0.85" />
    <path d="M90 28 V62 M73 45 H107" strokeWidth="0.55" opacity="0.85" />
    <path d="M135 28 V62 M118 45 H152" strokeWidth="0.55" opacity="0.85" />
  </svg>
));
TechGpu.displayName = "TechGpu";

const TechAiHead = memo(() => (
  <svg className="tech-ai-head w-40 h-56 transition-opacity duration-1000" viewBox="0 0 160 220" stroke="#d4af37" strokeWidth="0.85" fill="none">
    {/* Face contour remains static - layered bloom */}
    <path d="M125 210 L105 210 C85 210, 80 190, 80 175 C80 165, 65 160, 60 150 C55 140, 65 135, 65 125 C65 115, 53 110, 53 100 C53 90, 63 85, 67 75 C71 65, 67 55, 80 35 C93 15, 125 15, 135 35 C145 55, 150 100, 135 190 Z" stroke="#d4af37" strokeWidth="4.2" opacity="0.85" filter="url(#engraved-bloom)" style={{ animation: "tech-bloom-breathe 7.8s ease-in-out infinite" }} />
    <path d="M125 210 L105 210 C85 210, 80 190, 80 175 C80 165, 65 160, 60 150 C55 140, 65 135, 65 125 C65 115, 53 110, 53 100 C53 90, 63 85, 67 75 C71 65, 67 55, 80 35 C93 15, 125 15, 135 35 C145 55, 150 100, 135 190 Z" stroke="#fbbf24" strokeWidth="1.1" />
    
    {/* Brain structures / neural network pathways - Flowing thought energy pulses */}
    <path 
      d="M90 60 L110 50 L120 70 L100 85 L90 60 M110 50 L100 85 M90 60 L120 70" 
      strokeWidth="0.75" 
      stroke="#fbbf24"
      strokeDasharray="10 30" 
      style={{ animation: "tech-pcb-flow 5s linear infinite" }}
    />
    
    {/* Glowing synapses (pulsing sequentially) */}
    <circle cx="90" cy="60" r="3.5" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-1 5s ease-in-out infinite" }} />
    <circle cx="110" cy="50" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-3 5s ease-in-out infinite" }} />
    <circle cx="120" cy="70" r="4.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-5 5s ease-in-out infinite" }} />
    <circle cx="100" cy="85" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" style={{ animation: "tech-node-7 5s ease-in-out infinite" }} />
  </svg>
));
TechAiHead.displayName = "TechAiHead";

const TechLotus = memo(() => (
  <svg className="tech-lotus w-96 h-20 transition-opacity duration-1000" viewBox="0 0 400 80" stroke="#d4af37" strokeWidth="0.85" fill="none">
    {/* Engraved Center Petals (Breathing/pulsing with bloom) */}
    <g filter="url(#engraved-bloom)" style={{ animation: "tech-lotus-pulse 8.5s ease-in-out infinite" }}>
      <path d="M200 15 C208 25, 208 35, 200 45 C192 35, 192 25, 200 15 Z" strokeWidth="1.38" />
      <path d="M200 25 Q190 35, 200 25 Z" />
    </g>
    {/* Outer Petals */}
    <path d="M200 30 C170 35, 165 48, 200 52 C175 46, 185 38, 200 30 Z" strokeWidth="0.7" />
    <path d="M200 30 C230 35, 235 48, 200 52 C225 46, 215 38, 200 30 Z" strokeWidth="0.7" />
    
    {/* Circuit traces extending (Base static layout) */}
    <path d="M180 48 H120 L100 58 H10 M140 48 V38 H70" strokeWidth="0.9" opacity="0.45" />
    <path d="M220 48 H280 L300 58 H390 M260 48 V38 H330" strokeWidth="0.9" opacity="0.45" />
    
    {/* Circuit traces radiating energy flow (outward flow, staggered delay 5.2s, 2.0x brighter, thicker) */}
    <path 
      d="M180 48 H120 L100 58 H10 M140 48 V38 H70" 
      strokeWidth="2.8" 
      stroke="#fbbf24"
      strokeDasharray="25 130"
      filter="url(#engraved-bloom)"
      opacity="0.75"
      style={{ animation: "tech-pcb-flow 8.5s linear infinite", animationDelay: "5.2s" }}
    />
    <path 
      d="M180 48 H120 L100 58 H10 M140 48 V38 H70" 
      strokeWidth="1.35" 
      stroke="#fffbe6"
      strokeDasharray="25 130"
      opacity="1.0"
      style={{ animation: "tech-pcb-flow 8.5s linear infinite", animationDelay: "5.2s" }}
    />
    
    <path 
      d="M220 48 H280 L300 58 H390 M260 48 V38 H330" 
      strokeWidth="2.8" 
      stroke="#fbbf24"
      strokeDasharray="25 130"
      filter="url(#engraved-bloom)"
      opacity="0.75"
      style={{ animation: "tech-pcb-flow 8.5s linear infinite", animationDelay: "5.2s" }}
    />
    <path 
      d="M220 48 H280 L300 58 H390 M260 48 V38 H330" 
      strokeWidth="1.35" 
      stroke="#fffbe6"
      strokeDasharray="25 130"
      opacity="1.0"
      style={{ animation: "tech-pcb-flow 8.5s linear infinite", animationDelay: "5.2s" }}
    />
    
    {/* Node terminals */}
    <circle cx="10" cy="58" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
    <circle cx="390" cy="58" r="3.0" fill="#fbbf24" filter="url(#engraved-bloom)" stroke="none" />
  </svg>
));
TechLotus.displayName = "TechLotus";

const TechBinary = memo(({ className }: { className?: string }) => (
  <div className={`font-mono text-[11px] leading-relaxed select-none tracking-wider ${className}`}>
    <div style={{ animation: "tech-binary-1 5.0s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>0101</div>
    <div style={{ animation: "tech-binary-2 5.0s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>1010</div>
    <div style={{ animation: "tech-binary-3 5.0s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>01011</div>
    <div className="text-amber-500/50" style={{ animation: "tech-binary-4 5.0s ease-in-out infinite", filter: "drop-shadow(0 0 1.8px rgba(245,158,11,0.55))" }}>000980</div>
    <div style={{ animation: "tech-binary-5 5.0s ease-in-out infinite", filter: "drop-shadow(0 0 2px rgba(212,175,55,0.75))" }}>10101</div>
  </div>
));
TechBinary.displayName = "TechBinary";

const TechEquation = memo(({ className }: { className?: string }) => (
  <div 
    className={`font-serif text-[11px] italic leading-relaxed select-none space-y-1 ${className}`}
    style={{ 
      backgroundImage: "linear-gradient(90deg, #d4af37 0%, #d4af37 35%, #fffbe6 50%, #d4af37 65%, #d4af37 100%)",
      backgroundSize: "200px 100%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "tech-text-shimmer 7.5s linear infinite",
      filter: "drop-shadow(0 0 2.8px rgba(212,175,55,0.85))"
    }}
  >
    <div>E = mc²</div>
    <div>∇ · E = ρ/ε₀</div>
  </div>
));
TechEquation.displayName = "TechEquation";

const TechCode = memo(({ className }: { className?: string }) => (
  <div 
    className={`font-mono text-[10px] leading-normal text-left select-none ${className}`}
    style={{ 
      backgroundImage: "linear-gradient(90deg, #d4af37 0%, #d4af37 35%, #fffbe6 50%, #d4af37 65%, #d4af37 100%)",
      backgroundSize: "180px 100%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "tech-text-shimmer 8s linear infinite",
      filter: "drop-shadow(0 0 2.5px rgba(212,175,55,0.75))"
    }}
  >
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
