import Lenis from "@studio-freight/lenis";

const lenis = new Lenis({
  duration: 1.2, // velocidad del scroll
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // función de easing
  smoothWheel: true, // wheel del ratón suave
});

function raf(time: any) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener("DOMContentLoaded", () => {
  const anchorLinks =
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      event.preventDefault();

      // Ajusta el offset si tienes un navbar fijo arriba (por ejemplo 80px)
      lenis.scrollTo(targetEl, {
        offset: -80, // cambia este valor según la altura de tu navbar
        duration: 1.2,
      });
    });
  });
});
