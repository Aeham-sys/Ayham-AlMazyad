let threeState = null;

function getAccentColor() {
  const styles = getComputedStyle(document.documentElement);
  return styles.getPropertyValue('--accent-cyan').trim() || '#00F0FF';
}

function createCanvas() {
  const existingCanvas = document.getElementById('three-canvas');
  if (existingCanvas) {
    return existingCanvas;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'three-canvas';
  document.body.appendChild(canvas);
  return canvas;
}

export function destroyThreeBackground() {
  if (!threeState) {
    return;
  }

  cancelAnimationFrame(threeState.rafId);
  window.removeEventListener('resize', threeState.handleResize);
  window.removeEventListener('themechange', threeState.handleThemeChange);
  window.removeEventListener('threefx:disable', threeState.handleDisable);

  if (threeState.points) {
    threeState.scene.remove(threeState.points);
    threeState.points.geometry.dispose();
    threeState.points.material.dispose();
  }

  if (threeState.pointsSecondary) {
    threeState.scene.remove(threeState.pointsSecondary);
    threeState.pointsSecondary.geometry.dispose();
    threeState.pointsSecondary.material.dispose();
  }

  threeState.renderer.dispose();

  if (threeState.canvas && threeState.canvas.parentNode) {
    threeState.canvas.parentNode.removeChild(threeState.canvas);
  }

  threeState = null;
  window.__threeFxInitialized = false;
}

export async function initThreeBackground() {
  if (window.__threeFxInitialized) {
    return;
  }

  if (window.innerWidth < 768) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
  const canvas = createCanvas();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 11;

  const particleCount = window.innerWidth < 1024 ? 450 : 900;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const radius = 5 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi) * 0.6;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: getAccentColor(),
    size: window.innerWidth < 1024 ? 0.045 : 0.055,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const secondaryGeometry = geometry.clone();
  const secondaryMaterial = new THREE.PointsMaterial({
    color: '#3B82F6',
    size: window.innerWidth < 1024 ? 0.02 : 0.028,
    transparent: true,
    opacity: 0.24,
    depthWrite: false
  });

  const pointsSecondary = new THREE.Points(secondaryGeometry, secondaryMaterial);
  pointsSecondary.scale.setScalar(1.15);
  scene.add(pointsSecondary);

  const clock = new THREE.Clock();
  let rafId = 0;

  const animate = () => {
    const elapsed = clock.getElapsedTime();
    points.rotation.y = elapsed * 0.045;
    points.rotation.x = Math.sin(elapsed * 0.2) * 0.06;

    pointsSecondary.rotation.y = -elapsed * 0.03;
    pointsSecondary.rotation.z = Math.cos(elapsed * 0.15) * 0.04;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
    if (threeState) {
      threeState.rafId = rafId;
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      destroyThreeBackground();
      return;
    }

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  };

  const handleThemeChange = () => {
    material.color.set(getAccentColor());
  };

  const handleDisable = () => {
    destroyThreeBackground();
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('themechange', handleThemeChange);
  window.addEventListener('threefx:disable', handleDisable);

  threeState = {
    renderer,
    scene,
    camera,
    canvas,
    points,
    pointsSecondary,
    rafId,
    handleResize,
    handleThemeChange,
    handleDisable
  };

  window.__threeFxInitialized = true;
  animate();
}
