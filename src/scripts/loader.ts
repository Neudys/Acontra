import gsap from "gsap";
import { initGsaps } from "./gsap/gsapTextAnimations";

export let PAGE_READY_FOR_FINAL_GSAPS = false;

export function createPageLoader() {
  const overlay = document.createElement("div");
  overlay.id = "page-loader";
  overlay.setAttribute("aria-hidden", "false");

  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.background = "rgba(255, 251, 235, 0.92)";
  overlay.style.backdropFilter = "blur(10px)";
  overlay.style.opacity = "1";

  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.alignItems = "center";
  wrap.style.gap = "10px";
  wrap.style.padding = "18px 22px";
  wrap.style.borderRadius = "24px";
  wrap.style.border = "1px solid rgba(252, 211, 77, 0.6)";
  wrap.style.background = "rgba(255, 255, 255, 0.55)";
  wrap.style.boxShadow = "0 20px 55px rgba(0,0,0,0.08)";

  const counter = document.createElement("div");
  counter.id = "page-loader-counter";
  counter.textContent = "0";
  counter.style.fontFamily =
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
  counter.style.fontWeight = "800";
  counter.style.fontSize = "44px";
  counter.style.lineHeight = "1";
  counter.style.letterSpacing = "-0.02em";
  counter.style.color = "rgb(249, 115, 22)";

  const label = document.createElement("div");
  label.id = "page-loader-label";
  label.textContent = "Cargando...";
  label.style.fontFamily = counter.style.fontFamily;
  label.style.fontWeight = "700";
  label.style.fontSize = "13px";
  label.style.textTransform = "uppercase";
  label.style.letterSpacing = "0.22em";
  label.style.color = "rgba(17, 24, 39, 0.75)";

  wrap.appendChild(counter);
  wrap.appendChild(label);
  overlay.appendChild(wrap);
  document.body.appendChild(overlay);

  gsap.fromTo(
    wrap,
    { scale: 0.92, opacity: 0, y: 10 },
    { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
  );

  const loadingBouncer = gsap.to(label, {
    y: -4,
    duration: 0.55,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
  });

  let current = 0;
  let target = 0;
  let rafId: number | null = null;

  const tick = () => {
    // Suaviza (lerp) para que no pegue saltos feos
    current += (target - current) * 0.12;

    // Redondeo controlado
    const shown = Math.max(0, Math.min(100, Math.round(current)));
    counter.textContent = String(shown);

    // Mini bounce cuando sube
    // (solo si hay cambio real; evita rebotar cada frame)
    if (shown !== Number(counter.getAttribute("data-last") || "0")) {
      counter.setAttribute("data-last", String(shown));
      gsap.fromTo(
        counter,
        { y: 0 },
        { y: -6, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1 }
      );
    }

    if (shown < 100 || target < 100) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  };

  const ensureTicking = () => {
    if (rafId == null) rafId = requestAnimationFrame(tick);
  };

  const setProgress = (value: number) => {
    // Acepta 0..1 o 0..100
    const v = value <= 1 ? value * 100 : value;
    target = Math.max(target, Math.min(100, v));
    ensureTicking();
  };

  const finish = () => {
    setProgress(100);

    gsap.to(
      { t: target },
      {
        t: 100,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: function () {
          target = (this.targets()[0] as any).t;
          ensureTicking();
        },
        onComplete: () => {
          // Detiene bounce del label antes de ocultar
          loadingBouncer.kill();

          gsap.to(overlay, {
            opacity: 0,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => {
              overlay.remove();

              // ✅ Variable que “desbloquea” las últimas animaciones GSAP
              PAGE_READY_FOR_FINAL_GSAPS = true;

              // ⏱️ Delay solicitado
              setTimeout(() => {
                // 1) Habilita el contenido del sitio (sin animarlo aún)
                document.body.classList.remove("is-loading");

                // 2) Importante: deja que el navegador pinte este cambio primero
                requestAnimationFrame(() => {
                  // ✅ Aquí ya arrancan tus GSAPs y ellos “revelan” todo
                  initGsaps();
                });
              }, 800);
            },
          });
        },
      }
    );
  };

  return { setProgress, finish };
}
