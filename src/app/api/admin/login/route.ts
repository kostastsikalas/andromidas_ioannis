import { checkCredentials, loginRateLimited, startSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (loginRateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });
  const { email, password } = (await request.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  if (typeof email !== "string" || typeof password !== "string" || !checkCredentials(email, password)) {
    return Response.json({ error: "wrong_password" }, { status: 401 });
  }
  await startSession();
  return Response.json({ ok: true });
}
