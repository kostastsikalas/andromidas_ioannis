import nodemailer from "nodemailer";
import { site } from "@/content/site";

type Payload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  date?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
  lang?: unknown;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Best-effort, per-instance rate limit: 5 requests / 10 minutes per IP.
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they don't retry.
  if (str(body.website, 200)) return Response.json({ ok: true });

  const name = str(body.name, 100);
  const phone = str(body.phone, 20);
  const email = str(body.email, 120);
  const date = str(body.date, 10);
  const message = str(body.message, 1500);
  const lang = body.lang === "en" ? "en" : "el";

  if (!name || !/^[0-9+\s()-]{8,20}$/.test(phone) || !body.consent) {
    return Response.json({ error: "invalid_fields" }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "invalid_email" }, { status: 422 });
  }
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "invalid_date" }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const rows: [string, string][] = [
    ["Όνομα / Name", name],
    ["Τηλέφωνο / Phone", phone],
    ["Email", email || "—"],
    ["Προτιμώμενη ημέρα / Preferred day", date || "—"],
    ["Γλώσσα / Language", lang.toUpperCase()],
    ["Μήνυμα / Message", message || "—"],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6">${rows
    .map(([k, v]) => `<tr><th align="left" valign="top">${k}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[appointment] SMTP not configured — request received:\n" + text);
      return Response.json({ ok: true, delivered: false });
    }
    console.error("[appointment] SMTP not configured");
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 465),
      secure: Number(SMTP_PORT ?? 465) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to: MAIL_TO || site.email,
      replyTo: email || undefined,
      subject: `Αίτημα ραντεβού: ${name} (${phone})`,
      text,
      html,
    });
    return Response.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[appointment] send failed", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
}
