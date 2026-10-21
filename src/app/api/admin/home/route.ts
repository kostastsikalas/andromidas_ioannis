import { isAuthenticated } from "@/lib/admin-auth";
import { readHome, saveHome, storeMode } from "@/lib/article-store";
import { validateHome } from "@/lib/home-validate";

const unauthorized = () => Response.json({ error: "unauthorized" }, { status: 401 });

export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();
  return Response.json({ home: await readHome(), mode: storeMode() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();
  const body = (await request.json().catch(() => null)) as { home?: unknown } | null;
  const result = validateHome(body?.home);
  if ("error" in result) return Response.json(result, { status: 422 });
  try {
    const home = await saveHome(result.home);
    return Response.json({ ok: true, home, mode: storeMode() });
  } catch (err) {
    console.error("[admin] save failed", err);
    const readonly = String(err).includes("readonly");
    return Response.json({ error: readonly ? "readonly" : "save_failed" }, { status: readonly ? 503 : 502 });
  }
}
