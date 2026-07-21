import { useEffect, useRef } from "react";
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
      count: 140000, // Slightly reduced for optimized performance overhead
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

    // FIX 1: Explicitly verified standalone Canvas Texture Generator
    const createCircleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64; // Increased resolution for crisper edges
      c.height = 64;
      const ctx = c.getContext("2d");
      if (!ctx) return null;

      // Clear layout background explicitly
      ctx.clearRect(0, 0, 64, 64);

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(c);
      texture.needsUpdate = true; // Force WebGL pipeline compilation
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

      // FIX 2: Optimized material flags to handle custom canvas transparency pipelines properly
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

    // 3. Ambient Stars
    let ambientStars: THREE.Points | null = null;
    let starsGeometry: THREE.BufferGeometry | null = null;
    let starsMaterial: THREE.PointsMaterial | null = null;

    const generateAmbientStars = () => {
      const count = 2000;
      const radius = 45;

      starsGeometry = new THREE.BufferGeometry();
      const starsPositions = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starsPositions[i3 + 2] = radius * Math.cos(phi);
      }

      starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3));

      starsMaterial = new THREE.PointsMaterial({
        size: 0.08,
        sizeAttenuation: true,
        color: "#ffffff",
        transparent: true,
        opacity: 0.5,
        map: particleTexture || undefined,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      ambientStars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(ambientStars);
    };

    generateGalaxy();
    generateAmbientStars();

    // 4. Dimensions & Renderer Setup
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 4.0, 9.5); // Tilted down slightly for an immersive diagonal viewing profile
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true, // Let background pass-through elements process naturally
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

    // 5. Animation Loop
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();

      // Dynamic reactive state check
      const currentSpeed = isWarping ? parameters.rotationSpeed * 12 : parameters.rotationSpeed;
      galaxyGroup.rotation.y += delta * currentSpeed;

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
      particleTexture?.dispose();
      renderer.dispose();
    };
  }, [isWarping]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-0 block pointer-events-none transform-gpu"
      style={{ mixBlendMode: "screen" }} // Enforces transparent blending on top of background styles
    />
  );
}
