// src/scrollAnimations.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export function setupScrollAnimations(
  camera: THREE.PerspectiveCamera,
  bearModel: THREE.Object3D
) {
  const initialCameraY = camera.position.y;
  const initialBearRotY = bearModel.rotation.y;

  // ======================
  // RELLENO 1
  // ======================
  const tlR1 = gsap.timeline({
    scrollTrigger: {
      trigger: "#relleno1",
      start: "top center",
      end: "bottom center",
      scrub: true,
    },
    defaults: { ease: "power1.inOut" },
  });

  tlR1.to(
    camera.position,
    {
      x: 6,
      z: 2,
      y: initialCameraY,
    },
    0
  );

  tlR1.to(
    bearModel.rotation,
    {
      y: initialBearRotY + Math.PI / 2,
    },
    0
  );

  // ======================
  // RELLENO 2
  // ======================
  const tlR2 = gsap.timeline({
    scrollTrigger: {
      trigger: "#relleno2",
      start: "top center",
      end: "bottom center",
      scrub: true,
    },
    defaults: { ease: "power1.inOut" },
  });

  tlR2.to(
    bearModel.position,
    {
      x: 4.5,
      z: -1.1,
      y: 1.2,
    },
    0
  );

  tlR2.to(
    bearModel.rotation,
    {
      y: 0.5,
      x: -0.5,
      z: 0.3,
    },
    0
  );

  // ======================
  // RELLENO 3
  // ======================
  const tlR3 = gsap.timeline({
    scrollTrigger: {
      trigger: "#relleno3",
      start: "top 55%",
      end: "bottom center",
      scrub: true,
    },
    defaults: { ease: "power1.inOut" },
  });

  tlR3.to(bearModel.position, {
    x: -3,
    z: 3,
    y: 1.2,
  });

  // ======================
  // RELLENO 4
  // ======================
  const tlR4 = gsap.timeline({
    scrollTrigger: {
      trigger: "#relleno4",
      start: "top center",
      end: "bottom center",
      scrub: true,
    },
    defaults: { ease: "power1.inOut" },
  });

  tlR4.to(
    bearModel.position,
    {
      x: 2,
      z: -0.2,
      y: 1,
    },
    0
  );

  tlR4.to(
    bearModel.rotation,
    {
      y: 1,
      x: -0.3,
      z: 0.2,
    },
    0
  );

  //   // ======================
  //   // RELLENO 5
  //   // ======================
  //   const tlR5 = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: "#relleno5",
  //       endTrigger: "#footrer",
  //       start: "top bottom", // bottom del viewport ≈ top de relleno5
  //       end: "bottom bottom", // bottom del viewport ≈ bottom de relleno5
  //       scrub: true,
  //       markers: true,
  //     },
  //     defaults: { ease: "power1.inOut" },
  //   });

  //   tlR5.to(
  //     bearModel.position,
  //     {
  //       y: "+=" + 0.7,
  //     },
  //     0
  //   );
}
