import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { setupScrollAnimations } from "./gsapNormal.js";
import { setupScrollAnimationsReduced } from "./gsapReducido.js";

gsap.registerPlugin(ScrollTrigger);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let mixer: THREE.AnimationMixer | null = null;
let screenWidth = window.innerWidth;

const clock = new THREE.Clock();

function initializeBearModelPosition(bearModel: THREE.Object3D) {
  if (screenWidth <= 1800) {
    bearModel.position.set(1, 0.5, 0);
  } else {
    bearModel.position.set(1.6, 0.5, 0);
  }
}

function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

  if (!canvas) {
    console.error("No se encontró el canvas con id='canvas'");
    return;
  }

  // Escena
  scene = new THREE.Scene();

  // Cámara
  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(4, 4, 4);
  camera.lookAt(0, 1, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(3, 5, 5);
  scene.add(directional);

  // Cargar modelo
  const loader = new GLTFLoader();
  loader.load(
    "/bear.glb",
    (gltf) => {
      let bearModel = gltf.scene;
      initializeBearModelPosition(bearModel);
      window.addEventListener("resize", () => {
        if (screenWidth <= 1800) {
          initializeBearModelPosition(bearModel);
        } else {
          initializeBearModelPosition(bearModel);
        }
      });

      scene.add(bearModel);

      // Animaciones GLTF
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(bearModel);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }

      if (screenWidth <= 1800) {
        setupScrollAnimationsReduced(camera, bearModel);
      } else {
        setupScrollAnimations(camera, bearModel);
      }
    },
    undefined,
    (error) => {
      console.error("Error cargando /bear.glb:", error);
    }
  );

  window.addEventListener("resize", onResize);

  animate();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  screenWidth = window.innerWidth;
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}

window.addEventListener("DOMContentLoaded", init);
