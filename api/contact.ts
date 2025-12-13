import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Esto te confirma al instante si el 500 es por ENV faltante
      return res.status(500).json({
        ok: false,
        error: "RESEND_API_KEY no está configurada en Vercel",
      });
    }

    const resend = new Resend(apiKey);

    const body = (req.body || {}) as {
      name?: string;
      email?: string;
      service?: string;
      message?: string;
      company?: string;
    };

    const company = String(body.company || "").trim();
    if (company) return res.status(200).json({ ok: true }); // honeypot

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const service = String(body.service || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !service || !message) {
      return res
        .status(400)
        .json({ ok: false, error: "Faltan campos obligatorios" });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ ok: false, error: "Email inválido" });
    }

    const from =
      process.env.CONTACT_FROM_EMAIL || "A Contra Web <onboarding@resend.dev>";

    const result = await resend.emails.send({
      from,
      to: "hola@acontra.es",
      subject: `Nuevo mensaje desde A Contra — ${service}`,
      replyTo: email,
      html: `
        <h2>Nuevo mensaje desde la web</h2>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Servicio:</b> ${service}</p>
        <p><b>Mensaje:</b></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return res.status(200).json({ ok: true, id: result.data?.id });
  } catch (err: any) {
    console.error("Error enviando correo:", err);
    return res.status(500).json({
      ok: false,
      error: "Error interno al enviar el mensaje",
      detail: err?.message || String(err),
    });
  }
}
