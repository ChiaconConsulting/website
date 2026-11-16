import "server-only";
import nodemailer from "nodemailer";

/** Sends a notification email if SMTP is configured. Never throws: a mail failure must not lose a lead. */
export async function notify(to: string | undefined, subject: string, lines: Array<[string, string | null | undefined]>) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !to) return;
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    const text = lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
    await transport.sendMail({ from: MAIL_FROM || SMTP_USER, to, subject, text });
  } catch (err) {
    console.error("[mail] notification failed", err);
  }
}
