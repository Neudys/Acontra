import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { setupScrollAnimations } from "./gsap/gsapNormal.js";
import { setupScrollAnimationsReduced } from "./gsap/gsapReducido.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

gsap.registerPlugin(ScrollTrigger);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let mixer: THREE.AnimationMixer | null = null;

let screenWidth = window.innerWidth;

let controls: OrbitControls | null = null;
let bearModelRef: THREE.Object3D | null = null;

let canvasEl: HTMLCanvasElement | null = null;
let ro: ResizeObserver | null = null;

const clock = new THREE.Clock();

function fitRendererToParent() {
  if (!canvasEl || !renderer || !camera) return;

  const isMobile = window.innerWidth < 1280;

  if (isMobile) {
    // === Mobile: tamaño = PADRE ===
    const parent = canvasEl.parentElement as HTMLElement | null;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    if (!w || !h) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // false => no pisa el CSS del canvas
    renderer.setSize(w, h, false);
  } else {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function updateControlsTargetAndDistance() {
  if (!controls || !bearModelRef) return;

  let pos = bearModelRef.position;
  controls.target.copy(pos);
  controls.target.y += 0.7;

  const dist = camera.position.distanceTo(controls.target);
  controls.minDistance = dist;
  controls.maxDistance = dist;

  controls.update();
}

function initializeBearModelPosition(bearModel: THREE.Object3D) {
  if (screenWidth <= 1800 && screenWidth > 1280) {
    // bearModel.position.set(1, 0.5, 0);
    bearModel.position.set(1.5, 0.7, 0);
    bearModel.rotation.y = 0;
  } else if (screenWidth > 1800) {
    bearModel.position.set(1.6, 0.5, 0);
    bearModel.rotation.y = 0;
  } else {
    // Mobile
    bearModel.position.set(0, 0, 0);
  }

  // Ref REAL
  bearModelRef = bearModel;

  // Mantén pivot si hay controls
  updateControlsTargetAndDistance();
}

function setupMobileOrbitControls() {
  const isMobile = window.innerWidth < 1280;

  // si ya no es móvil: destruir controls
  if (!isMobile && controls) {
    controls.dispose();
    controls = null;
    return;
  }

  // si es móvil y no existen: crear
  if (isMobile && !controls) {
    controls = new OrbitControls(camera, renderer.domElement);

    // Solo rotación
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Suavidad
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    // Límites laterales
    controls.minAzimuthAngle = -Math.PI / 4;
    controls.maxAzimuthAngle = Math.PI / 4;

    // Límites verticales
    controls.minPolarAngle = Math.PI * 0.35;
    controls.maxPolarAngle = Math.PI * 0.65;

    // ahora fija pivot y bloquea distancia correctamente
    updateControlsTargetAndDistance();
  }
}

function init() {
  // Selecciona por existencia real (evita bugs por screenWidth viejo)
  canvasEl = pickCanvas();

  if (!canvasEl) throw new Error("No canvas found");

  // Escena
  scene = new THREE.Scene();

  // Cámara (aspect se ajusta luego con fitRendererToParent)
  camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const isMobile = window.innerWidth < 1280;

  if (isMobile) {
    camera.position.set(0, 1, 4); // por ejemplo, hacia tu oso en móvil
  } else {
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 1, 0);
  }

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ajusta al tamaño del PADRE (NO window)
  fitRendererToParent();

  // ResizeObserver para cambios de layout (aspect-square, etc.)
  ro = new ResizeObserver(() => {
    fitRendererToParent();
  });
  ro.observe(canvasEl.parentElement as HTMLElement);

  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(3, 5, 5);
  scene.add(directional);

  // Modelo
  const loader = new GLTFLoader();
  loader.load(
    "/bear.glb",
    (gltf) => {
      const bearModel = gltf.scene;
      bearModelRef = bearModel;

      initializeBearModelPosition(bearModel);
      scene.add(bearModel);

      // Animación
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(bearModel);
        mixer.clipAction(gltf.animations[0]).play();
      }

      // Orbit solo móvil
      setupMobileOrbitControls();

      // Scroll animations solo desktop/tablet
      if (screenWidth <= 1800 && screenWidth >= 1280) {
        setupScrollAnimationsReduced(camera, bearModel);
      } else if (screenWidth > 1800) {
        setupScrollAnimations(camera, bearModel);
      }

      // asegura target correcto (por si controls se creó después)
      updateControlsTargetAndDistance();
    },
    undefined,
    (error) => {
      console.error("Error cargando /bear.glb:", error);
    }
  );

  window.addEventListener("resize", onResize);
  animate();
}

function pickCanvas(): HTMLCanvasElement {
  const isMobile = window.innerWidth < 1280;

  const el = document.getElementById(
    isMobile ? "canvas-mobile" : "canvas-desktop"
  ) as HTMLCanvasElement | null;

  if (!el) throw new Error("No canvas found for current breakpoint");

  return el;
}

function onResize() {
  screenWidth = window.innerWidth;

  fitRendererToParent();
  setupMobileOrbitControls();

  if (bearModelRef) initializeBearModelPosition(bearModelRef);

  updateControlsTargetAndDistance();
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

window.addEventListener("DOMContentLoaded", init);
