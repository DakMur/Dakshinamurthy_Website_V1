import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/examples/jsm/controls/OrbitControls.js";

/**
 * Base setup
 */
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/**
 * Parameters with real-time controls
 */
const parameters = {
  count: 180000,
  size: 0.025,
  radius: 11,
  branches: 3,
  spin: 0.9,
  randomnessPower: 1.8,
  insideColor: "#fffbe6",
  midColor: "#e07bc5",
  outsideColor: "#113cd6",
  rotationSpeed: 0.04
};

const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

/**
 * Dynamic Circle Texture Generator
 */
const createCircleTexture = () => {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d");

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  return new THREE.CanvasTexture(c);
};

const particleTexture = createCircleTexture();

/**
 * 3D Normal Cloud Distribution (Box-Muller)
 */
const randomNormal = () => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

/**
 * Generate Galaxy variables & safe cleanup
 */
let galaxyGeometry = null;
let galaxyMaterial = null;
let galaxyPoints = null;

const generateGalaxy = () => {
  // Dispose of old generation if it exists to avoid GPU leaks
  if (galaxyPoints !== null) {
    galaxyGeometry.dispose();
    galaxyMaterial.dispose();
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

    // 1. DENSITY: Using Math.pow forces stars to clump heavily towards the core (0)
    const radius_i =
      Math.pow(Math.random(), parameters.randomnessPower) * parameters.radius;
    const spinAngle = radius_i * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const armX = Math.cos(branchAngle + spinAngle) * radius_i;
    const armZ = Math.sin(branchAngle + spinAngle) * radius_i;

    // 2. THE BULGE: Exponential decay based on distance from the center.
    const centralBulge = Math.exp(-radius_i * 1.2) * 1.5;

    // Normal scattering for the sweeping arms
    const scatterSpread = 0.4 * (radius_i * 0.15 + 0.2);

    // Combine them to calculate the final 3D offsets
    const randomX = randomNormal() * (scatterSpread + centralBulge);
    const randomY =
      randomNormal() * (scatterSpread * 0.25 + centralBulge * 1.2);
    const randomZ = randomNormal() * (scatterSpread + centralBulge);

    positions[i3] = armX + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = armZ + randomZ;

    // Color gradient setup
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

  galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  galaxyMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    map: particleTexture,
    alphaTest: 0.001
  });

  galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
  galaxyGroup.add(galaxyPoints);
};

/**
 * Background Environment Stars
 */
const generateAmbientStars = () => {
  const count = 3500;
  const radius = 45;

  const starsGeometry = new THREE.BufferGeometry();
  const starsPositions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starsPositions[i3 + 2] = radius * Math.cos(phi);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starsPositions, 3)
  );

  const starsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: "#ffffff",
    transparent: true,
    opacity: 0.45,
    map: particleTexture
  });

  const ambientStars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(ambientStars);
};

/**
 * Core Density Overlay: Soft Sprite Glow & safe cleanup
 */
let coreSprite = null;

const createCoreGlow = () => {
  if (coreSprite !== null) {
    coreSprite.material.map.dispose();
    coreSprite.material.dispose();
    galaxyGroup.remove(coreSprite);
  }

  const canvasGlow = document.createElement("canvas");
  canvasGlow.width = 64;
  canvasGlow.height = 64;
  const ctx = canvasGlow.getContext("2d");

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(255, 251, 230, 0.9)");
  gradient.addColorStop(0.6, "rgba(224, 123, 197, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const glowTexture = new THREE.CanvasTexture(canvasGlow);

  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });

  coreSprite = new THREE.Sprite(glowMaterial);
  coreSprite.scale.set(3.5, 3.5, 1);

  galaxyGroup.add(coreSprite);
};

// Universe Initialization
generateGalaxy();
generateAmbientStars();
createCoreGlow();

/**
 * Size Tracker
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Immersive Camera Setup
 */
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 1.5, 7.2);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#000000");

/**
 * Orbit Controls with Inertia
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 25;
controls.minDistance = 2;
// Replicate user's initial lookAt & rotation angle securely via Target & Camera starting coordinates
controls.target.set(0, 0, 0);
camera.rotateZ(-0.3);

/**
 * Loop Ticker
 */
const clock = new THREE.Clock();

const tick = () => {
  const delta = clock.getDelta();

  // Handle continuous rotation
  galaxyGroup.rotation.y += delta * parameters.rotationSpeed;

  // Update controls for damping smoothness
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/**
 * UI Panel Collapsible and Interactive Sliders setup
 */
document.addEventListener("DOMContentLoaded", () => {
  // Clear loading overlay
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("fade-out");
      setTimeout(() => loader.remove(), 800);
    }, 500);
  }

  // Dashboard Toggle Panel
  const controlPanel = document.getElementById("controlPanel");
  const togglePanelBtn = document.getElementById("togglePanel");

  if (togglePanelBtn && controlPanel) {
    togglePanelBtn.addEventListener("click", () => {
      controlPanel.classList.toggle("collapsed");
    });
  }

  // Bind values and sliders dynamically
  const setupSlider = (sliderId, valueId, key, scale = 1) => {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(valueId);

    if (slider && display) {
      slider.addEventListener("input", (e) => {
        let val = parseFloat(e.target.value);
        parameters[key] = val;

        // Custom value formatting
        if (key === 'count') {
          display.textContent = val.toLocaleString();
        } else if (key === 'size') {
          display.textContent = val.toFixed(3);
        } else if (key === 'spin' || key === 'rotationSpeed') {
          display.textContent = val.toFixed(2);
        } else {
          display.textContent = val;
        }

        // Smoothly regenerate on live dragging for lightweight parameters
        if (key !== 'count') {
          debouncedRegeneration();
        }
      });

      // Always regenerate high-density star count when releasing mouse
      slider.addEventListener("change", () => {
        generateGalaxy();
        createCoreGlow();
      });
    }
  };

  // Setup color picker listeners
  const setupColorPicker = (pickerId, key) => {
    const picker = document.getElementById(pickerId);
    if (picker) {
      picker.addEventListener("input", (e) => {
        parameters[key] = e.target.value;
        debouncedRegeneration();
      });
    }
  };

  // Initialize Sliders
  setupSlider("input-count", "val-count", "count");
  setupSlider("input-branches", "val-branches", "branches");
  setupSlider("input-spin", "val-spin", "spin");
  setupSlider("input-size", "val-size", "size");
  setupSlider("input-rotationSpeed", "val-rotationSpeed", "rotationSpeed");

  // Initialize Color Pickers
  setupColorPicker("input-insideColor", "insideColor");
  setupColorPicker("input-midColor", "midColor");
  setupColorPicker("input-outsideColor", "outsideColor");

  // Reset Camera action button
  const resetBtn = document.getElementById("btn-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // Animate camera back to start position
      camera.position.set(0, 1.5, 7.2);
      controls.target.set(0, 0, 0);
      controls.update();
    });
  }

  // Force Regenerate action button
  const regenerateBtn = document.getElementById("btn-regenerate");
  if (regenerateBtn) {
    regenerateBtn.addEventListener("click", () => {
      generateGalaxy();
      createCoreGlow();
    });
  }

  // Debounce helper to prevent heavy rendering lag during dragging
  let debounceTimeout;
  const debouncedRegeneration = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      generateGalaxy();
      createCoreGlow();
    }, 80);
  };
});
