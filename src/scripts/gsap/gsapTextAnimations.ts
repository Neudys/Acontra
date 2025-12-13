import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

(() => {
  // Si usas HMR, esto evita triggers duplicados
  ScrollTrigger.getAll().forEach((t) => t.kill());

  // =======================
  // NAVBAR (smooth)
  // =======================
  const nav = document.querySelector<HTMLElement>(".gsap-navbar");
  if (nav) {
    const logo = nav.querySelector<HTMLElement>(".gsap-navbar-logo");
    const links = Array.from(
      nav.querySelectorAll<HTMLElement>(".gsap-navbar-link")
    );
    const cta = nav.querySelector<HTMLElement>(".gsap-navbar-cta");

    gsap.set(nav, { y: -10, opacity: 0, filter: "blur(4px)" });
    if (logo) gsap.set(logo, { opacity: 0, x: -8 });
    if (links.length) gsap.set(links, { opacity: 0, y: -4 });
    if (cta) gsap.set(cta, { opacity: 0, x: 8 });

    const tlNav = gsap.timeline({ defaults: { ease: "power2.out" } });
    tlNav.to(nav, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.45 });
    if (logo) tlNav.to(logo, { opacity: 1, x: 0, duration: 0.28 }, "-=0.15");
    if (links.length)
      tlNav.to(
        links,
        { opacity: 1, y: 0, duration: 0.22, stagger: 0.05 },
        "-=0.12"
      );
    if (cta)
      tlNav.to(
        cta,
        { opacity: 1, x: 0, duration: 0.25, overwrite: "auto" },
        "-=0.12"
      );
  }

  // =======================
  // HERO (smooth on load)
  // =======================
  const hero = document.querySelector<HTMLElement>(".gsap-hero");
  if (hero) {
    const content = hero.querySelector<HTMLElement>(".gsap-hero-content");
    const pill = hero.querySelector<HTMLElement>(".gsap-hero-pill");
    const title = hero.querySelector<HTMLElement>(".gsap-hero-title");
    const subtitle = hero.querySelector<HTMLElement>(".gsap-hero-subtitle");
    const ctasWrap = hero.querySelector<HTMLElement>(".gsap-hero-ctas");

    if (content) gsap.set(content, { opacity: 0, y: 12, filter: "blur(6px)" });
    if (pill) gsap.set(pill, { opacity: 0, y: 6 });
    if (title) gsap.set(title, { opacity: 0, y: 10 });
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 8 });
    if (ctasWrap) gsap.set(ctasWrap, { opacity: 0, y: 8 });

    const tlHero = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (content)
      tlHero.to(content, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.5,
      });

    if (pill) tlHero.to(pill, { opacity: 1, y: 0, duration: 0.35 }, "-=0.45");
    if (title) tlHero.to(title, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25");
    if (subtitle)
      tlHero.to(subtitle, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25");
    if (ctasWrap)
      tlHero.to(ctasWrap, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25");
  }

  // =========================
  // CANVAS DESKTOP (SIN ScrollTrigger)
  // =========================
  const canvasDesktop = document.querySelector<HTMLElement>(
    ".gsap-canvas-desktop"
  );
  if (canvasDesktop) {
    gsap.set(canvasDesktop, { x: 320, opacity: 0 });
    gsap.to(canvasDesktop, {
      x: 0,
      opacity: 1,
      duration: 1.25,
      ease: "power2.out",
      delay: 0.1,
    });
  }

  // =========================
  // MASCOTA MOBILE (CON ScrollTrigger)
  // =========================
  const mascota = document.querySelector<HTMLElement>(".gsap-mascota");
  if (mascota) {
    const card = mascota.querySelector<HTMLElement>(".gsap-mascota-card");
    const pill = mascota.querySelector<HTMLElement>(".gsap-mascota-pill");
    const title = mascota.querySelector<HTMLElement>(".gsap-mascota-title");
    const text = mascota.querySelector<HTMLElement>(".gsap-mascota-text");
    const canvasMobile = mascota.querySelector<HTMLElement>(
      ".gsap-canvas-mobile"
    );
    const ctas = mascota.querySelector<HTMLElement>(".gsap-mascota-ctas");

    if (card) gsap.set(card, { opacity: 0, y: 12, filter: "blur(6px)" });
    if (pill) gsap.set(pill, { opacity: 0, y: 6 });
    if (title) gsap.set(title, { opacity: 0, y: 8 });
    if (text) gsap.set(text, { opacity: 0, y: 6 });
    if (canvasMobile) gsap.set(canvasMobile, { opacity: 0, x: 70 });
    if (ctas) gsap.set(ctas, { opacity: 0, y: 6 });

    const tlMascota = gsap.timeline({
      scrollTrigger: { trigger: mascota, start: "top 75%", once: true },
      defaults: { ease: "power2.out" },
    });

    if (card)
      tlMascota.to(card, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
      });

    if (pill) tlMascota.to(pill, { opacity: 1, y: 0, duration: 0.35 }, "-=0.5");
    if (title)
      tlMascota.to(title, { opacity: 1, y: 0, duration: 0.4 }, "-=0.28");
    if (text)
      tlMascota.to(text, { opacity: 1, y: 0, duration: 0.35 }, "-=0.25");
    if (canvasMobile)
      tlMascota.to(canvasMobile, { opacity: 1, x: 0, duration: 0.9 }, "-=0.18");
    if (ctas)
      tlMascota.to(ctas, { opacity: 1, y: 0, duration: 0.35 }, "-=0.35");
  }

  // =========================
  // QUE HACEMOS (CON ScrollTrigger)
  // =========================
  const services = document.querySelector<HTMLElement>(".gsap-services");
  if (services) {
    const header = services.querySelector<HTMLElement>(".gsap-services-header");
    const title = services.querySelector<HTMLElement>(".gsap-services-title");
    const subtitle = services.querySelector<HTMLElement>(
      ".gsap-services-subtitle"
    );
    const cards = Array.from(
      services.querySelectorAll<HTMLElement>(".gsap-service-card")
    );

    if (header) gsap.set(header, { opacity: 0, y: 10, filter: "blur(6px)" });
    if (title) gsap.set(title, { opacity: 0, y: 8 });
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 8 });
    if (cards.length)
      gsap.set(cards, { opacity: 0, y: 14, filter: "blur(6px)" });

    const tlServices = gsap.timeline({
      scrollTrigger: { trigger: services, start: "top 75%", once: true },
      defaults: { ease: "power2.out" },
    });

    if (header)
      tlServices.to(header, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
      });

    if (title)
      tlServices.to(title, { opacity: 1, y: 0, duration: 0.35 }, "-=0.45");
    if (subtitle)
      tlServices.to(subtitle, { opacity: 1, y: 0, duration: 0.35 }, "-=0.3");

    if (cards.length)
      tlServices.to(
        cards,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.65,
          stagger: 0.12,
        },
        "-=0.2"
      );
  }

  // =========================
  // INFO (3 BLOQUES) (CON ScrollTrigger POR BLOQUE)
  // =========================
  const info = document.querySelector<HTMLElement>(".gsap-info");
  if (info) {
    const blocks = Array.from(
      info.querySelectorAll<HTMLElement>(".gsap-info-block")
    );

    blocks.forEach((block) => {
      const card = block.querySelector<HTMLElement>(".gsap-info-card");
      const pill = block.querySelector<HTMLElement>(".gsap-info-pill");
      const title = block.querySelector<HTMLElement>(".gsap-info-title");
      const text = block.querySelector<HTMLElement>(".gsap-info-text");
      const items = Array.from(
        block.querySelectorAll<HTMLElement>(".gsap-info-item")
      );

      if (card) gsap.set(card, { opacity: 0, y: 14, filter: "blur(6px)" });
      if (pill) gsap.set(pill, { opacity: 0, y: 8 });
      if (title) gsap.set(title, { opacity: 0, y: 10 });
      if (text) gsap.set(text, { opacity: 0, y: 8 });
      if (items.length) gsap.set(items, { opacity: 0, y: 8 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: block, start: "top 78%", once: true },
        defaults: { ease: "power2.out" },
      });

      if (card)
        tl.to(card, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
        });

      if (pill) tl.to(pill, { opacity: 1, y: 0, duration: 0.3 }, "-=0.5");
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25");
      if (text) tl.to(text, { opacity: 1, y: 0, duration: 0.35 }, "-=0.25");

      if (items.length)
        tl.to(
          items,
          { opacity: 1, y: 0, duration: 0.28, stagger: 0.06 },
          "-=0.18"
        );
    });
  }

  // =========================
  // ABOUT (CON ScrollTrigger)
  // =========================
  const about = document.querySelector<HTMLElement>(".gsap-about");
  if (about) {
    const left = about.querySelector<HTMLElement>(".gsap-about-left");
    const eyebrow = about.querySelector<HTMLElement>(".gsap-about-eyebrow");
    const title = about.querySelector<HTMLElement>(".gsap-about-title");
    const copy = about.querySelector<HTMLElement>(".gsap-about-copy");
    const quote = about.querySelector<HTMLElement>(".gsap-about-quote");

    const right = about.querySelector<HTMLElement>(".gsap-about-right");
    const bg = about.querySelector<HTMLElement>(".gsap-about-bg");
    const frame = about.querySelector<HTMLElement>(".gsap-about-frame");
    const img = about.querySelector<HTMLElement>(".gsap-about-img");
    const accent = about.querySelector<HTMLElement>(".gsap-about-accent");

    if (left) gsap.set(left, { opacity: 0, y: 14, filter: "blur(6px)" });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 8 });
    if (title) gsap.set(title, { opacity: 0, y: 10 });
    if (copy) gsap.set(copy, { opacity: 0, y: 10 });
    if (quote) gsap.set(quote, { opacity: 0, y: 10 });

    if (right) gsap.set(right, { opacity: 0, x: 18, filter: "blur(6px)" });
    if (bg) gsap.set(bg, { opacity: 0, scale: 0.98 });
    if (frame) gsap.set(frame, { opacity: 0, scale: 0.98 });
    if (img) gsap.set(img, { opacity: 0 });
    if (accent) gsap.set(accent, { opacity: 0, y: 8 });

    const tlAbout = gsap.timeline({
      scrollTrigger: { trigger: about, start: "top 75%", once: true },
      defaults: { ease: "power2.out" },
    });

    if (left)
      tlAbout.to(left, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
      });

    if (eyebrow)
      tlAbout.to(eyebrow, { opacity: 1, y: 0, duration: 0.3 }, "-=0.55");
    if (title)
      tlAbout.to(title, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25");
    if (copy) tlAbout.to(copy, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25");
    if (quote)
      tlAbout.to(quote, { opacity: 1, y: 0, duration: 0.35 }, "-=0.25");

    if (right)
      tlAbout.to(
        right,
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.85 },
        "-=0.65"
      );

    if (bg) tlAbout.to(bg, { opacity: 1, scale: 1, duration: 0.45 }, "-=0.6");
    if (frame)
      tlAbout.to(frame, { opacity: 1, scale: 1, duration: 0.55 }, "-=0.35");
    if (img) tlAbout.to(img, { opacity: 1, duration: 0.45 }, "-=0.35");
    if (accent)
      tlAbout.to(accent, { opacity: 1, y: 0, duration: 0.35 }, "-=0.25");
  }

  // =========================
  // CONTACT (CON ScrollTrigger)
  // =========================
  const contact = document.querySelector<HTMLElement>(".gsap-contact");
  if (contact) {
    const card = contact.querySelector<HTMLElement>(".gsap-contact-card");
    const eyebrow = contact.querySelector<HTMLElement>(".gsap-contact-eyebrow");
    const title = contact.querySelector<HTMLElement>(".gsap-contact-title");
    const text = contact.querySelector<HTMLElement>(".gsap-contact-text");
    const form = contact.querySelector<HTMLElement>(".gsap-contact-form");
    const fields = Array.from(
      contact.querySelectorAll<HTMLElement>(".gsap-contact-field")
    );
    const actions = contact.querySelector<HTMLElement>(".gsap-contact-actions");

    if (card) gsap.set(card, { opacity: 0, y: 16, filter: "blur(6px)" });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 8 });
    if (title) gsap.set(title, { opacity: 0, y: 10 });
    if (text) gsap.set(text, { opacity: 0, y: 10 });
    if (form) gsap.set(form, { opacity: 0, y: 10 });
    if (fields.length) gsap.set(fields, { opacity: 0, y: 8 });
    if (actions) gsap.set(actions, { opacity: 0, y: 8 });

    const tlContact = gsap.timeline({
      scrollTrigger: { trigger: contact, start: "top 78%", once: true },
      defaults: { ease: "power2.out" },
    });

    if (card)
      tlContact.to(card, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
      });

    if (eyebrow)
      tlContact.to(eyebrow, { opacity: 1, y: 0, duration: 0.3 }, "-=0.55");
    if (title)
      tlContact.to(title, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25");
    if (text)
      tlContact.to(text, { opacity: 1, y: 0, duration: 0.35 }, "-=0.25");

    if (form)
      tlContact.to(form, { opacity: 1, y: 0, duration: 0.35 }, "-=0.25");

    if (fields.length)
      tlContact.to(
        fields,
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.06 },
        "-=0.2"
      );

    if (actions)
      tlContact.to(actions, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
  }
})();
