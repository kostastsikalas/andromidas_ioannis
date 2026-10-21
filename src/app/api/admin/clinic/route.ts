import { isAuthenticated } from "@/lib/admin-auth";
import { readClinic, saveClinic, storeMode } from "@/lib/article-store";
import { validateClinic } from "@/lib/clinic-validate";

const unauthorized = () => Response.json({ error: "unauthorized" }, { status: 401 });

export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();
  return Response.json({ clinic: await readClinic(), mode: storeMode() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();
  const body = (await request.json().catch(() => null)) as { clinic?: unknown } | null;
  const result = validateClinic(body?.clinic);
  if ("error" in result) return Response.json(result, { status: 422 });
  try {
    const clinic = await saveClinic(result.clinic);
    return Response.json({ ok: true, clinic, mode: storeMode() });
  } catch (err) {
    console.error("[admin] save failed", err);
    const readonly = String(err).includes("readonly");
    return Response.json({ error: readonly ? "readonly" : "save_failed" }, { status: readonly ? 503 : 502 });
  }
}
