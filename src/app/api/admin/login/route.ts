import { checkPassword, loginRateLimited, startSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (loginRateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });
  const { password } = (await request.json().catch(() => ({}))) as { password?: unknown };
  if (typeof password !== "string" || !checkPassword(password)) {
    return Response.json({ error: "wrong_password" }, { status: 401 });
  }
  await startSession();
  return Response.json({ ok: true });
}
