import "./scripts/leni.js";
import "./scripts/mode.ts";
import "./scripts/navBar.ts";
import { setupContactForm } from "./scripts/contact";


setupContactForm();

window.addEventListener("load", () => {
  const alreadyForced = sessionStorage.getItem("forced-full-reload");

  if (!alreadyForced) {
    sessionStorage.setItem("forced-full-reload", "true");
    window.location.replace(window.location.href);
  }
});
