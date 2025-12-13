import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, email, service, message, company } = (req.body || {}) as {
      name?: string;
      email?: string;
      service?: string;
      message?: string;
      company?: string; // honeypot opcional
    };

    // Honeypot anti-bots (si lo agregas)
    if (String(company || "").trim()) {
      return res.status(200).json({ ok: true });
    }

    const n = String(name || "").trim();
    const e = String(email || "").trim();
    const s = String(service || "").trim();
    const m = String(message || "").trim();

    if (!n || !e || !s || !m) {
      return res.status(400).json({ ok: false, error: "Faltan campos obligatorios" });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    if (!emailOk) {
      return res.status(400).json({ ok: false, error: "Email inválido" });
    }

    // Importante: ideal tener dominio verificado y usar CONTACT_FROM_EMAIL
    const from = process.env.CONTACT_FROM_EMAIL || "A Contra Web <onboarding@resend.dev>";

    await resend.emails.send({
      from,
      to: "hola@acontra.es",
      subject: `Nuevo mensaje desde A Contra — ${s}`,
      replyTo: e,
      html: `
        <h2>Nuevo mensaje desde la web</h2>
        <p><b>Nombre:</b> ${n}</p>
        <p><b>Email:</b> ${e}</p>
        <p><b>Servicio:</b> ${s}</p>
        <p><b>Mensaje:</b></p>
        <p>${m.replace(/\n/g, "<br />")}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error enviando correo:", err);
    return res.status(500).json({ ok: false, error: "Error interno al enviar el mensaje" });
  }
}
