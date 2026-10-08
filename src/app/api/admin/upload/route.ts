import { randomBytes } from "node:crypto";
import { isAuthenticated } from "@/lib/admin-auth";
import { saveImage } from "@/lib/article-store";

const MAX_BYTES = 3 * 1024 * 1024;

/** Accepts a JPEG already resized in the browser, sent as base64. */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { data, name } = (await request.json().catch(() => ({}))) as { data?: unknown; name?: unknown };
  if (typeof data !== "string") return Response.json({ error: "no_file" }, { status: 400 });

  const buffer = Buffer.from(data.replace(/^data:image\/jpeg;base64,/, ""), "base64");
  const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (!isJpeg) return Response.json({ error: "not_jpeg" }, { status: 415 });
  if (buffer.length > MAX_BYTES) return Response.json({ error: "too_large" }, { status: 413 });

  const base = (typeof name === "string" ? name : "photo").toLowerCase().replace(/\.[a-z]+$/, "").replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "photo";
  const fileName = `${base}-${randomBytes(3).toString("hex")}.jpg`;
  try {
    return Response.json({ url: await saveImage(fileName, buffer) });
  } catch (err) {
    console.error("[admin] upload failed", err);
    return Response.json({ error: String(err).includes("readonly") ? "readonly" : "upload_failed" }, { status: 502 });
  }
}
