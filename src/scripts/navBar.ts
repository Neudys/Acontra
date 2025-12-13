let scrollTimeout: number | undefined;

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconMenu = document.getElementById("icon-menu");
  const iconClose = document.getElementById("icon-close");
  const closeMenuElements =
    document.querySelectorAll<HTMLElement>("[data-close-menu]");

  if (!navbar || !menuToggle || !mobileMenu || !iconMenu || !iconClose) return;

  const hideNavbar = () => {
    navbar.classList.remove("translate-y-0");
    navbar.classList.add("-translate-y-full");
  };

  const showNavbar = () => {
    navbar.classList.remove("-translate-y-full");
    navbar.classList.add("translate-y-0");
  };

  const updateNavbarOnScroll = () => {
    const currentScrollY = window.scrollY;

    // Fondo y blur al hacer scroll
    const isScrolled = currentScrollY > 20;

    if (isScrolled) {
      navbar.classList.add(
        "bg-background/80",
        "backdrop-blur-md",
        "border-b",
        "border-border/50",
        "py-3",
        "shadow-sm"
      );
      navbar.classList.remove("bg-transparent", "py-5");
    } else {
      navbar.classList.add("bg-transparent", "py-5");
      navbar.classList.remove(
        "bg-background/80",
        "backdrop-blur-md",
        "border-b",
        "border-border/50",
        "py-3",
        "shadow-sm"
      );
    }

    // Mientras se mueve → oculto
    hideNavbar();

    // Cuando deja de moverse → lo mostramos después de un pequeño delay
    if (scrollTimeout !== undefined) {
      window.clearTimeout(scrollTimeout);
    }

    scrollTimeout = window.setTimeout(() => {
      showNavbar();
    }, 150); // puedes ajustar este delay (ms) si quieres que aparezca antes/después
  };

  window.addEventListener("scroll", updateNavbarOnScroll, { passive: true });

  const openMenu = () => {
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("flex");
    iconMenu.classList.add("hidden");
    iconClose.classList.remove("hidden");
  };

  const closeMenu = () => {
    mobileMenu.classList.add("hidden");
    mobileMenu.classList.remove("flex");
    iconMenu.classList.remove("hidden");
    iconClose.classList.add("hidden");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeMenuElements.forEach((el) => {
    el.addEventListener("click", () => {
      closeMenu();
    });
  });
});
