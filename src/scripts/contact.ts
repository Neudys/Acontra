export function setupContactForm() {
  const form = document.getElementById(
    "contact-form"
  ) as HTMLFormElement | null;
  const statusEl = document.getElementById(
    "contact-status"
  ) as HTMLParagraphElement | null;

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement | null;
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = "Enviando...";

    try {
      const fd = new FormData(form);

      const payload = {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        service: String(fd.get("service") || ""),
        message: String(fd.get("message") || ""),
        company: String(fd.get("company") || ""), // honeypot si lo añades
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        if (statusEl)
          statusEl.textContent =
            data?.error || "No se pudo enviar. Intenta de nuevo.";
        return;
      }

      if (statusEl)
        statusEl.textContent = "Listo. Te responderemos en menos de 48 horas.";
      form.reset();
    } catch {
      if (statusEl) statusEl.textContent = "Error de red. Intenta de nuevo.";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
