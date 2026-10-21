import type { Announcement } from "@/content/announcements";
import { isAuthenticated } from "@/lib/admin-auth";
import { validateAnnouncement } from "@/lib/announcement-validate";
import { readAnnouncements, storeMode, updateAnnouncements } from "@/lib/article-store";

const unauthorized = () => Response.json({ error: "unauthorized" }, { status: 401 });
const failure = (err: unknown) => {
  console.error("[admin] save failed", err);
  const readonly = String(err).includes("readonly");
  return Response.json({ error: readonly ? "readonly" : "save_failed" }, { status: readonly ? 503 : 502 });
};

export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();
  return Response.json({ announcements: await readAnnouncements(), mode: storeMode() });
}

/** Create or update (matched by id). */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();
  const body = (await request.json().catch(() => null)) as { announcement?: unknown } | null;
  const result = validateAnnouncement(body?.announcement);
  if ("error" in result) return Response.json(result, { status: 422 });
  const { announcement } = result;

  try {
    const announcements = await updateAnnouncements((list) => {
      const index = list.findIndex((a) => a.id === announcement.id);
      const next: Announcement[] = [...list];
      if (index >= 0) next[index] = announcement;
      else next.unshift(announcement);
      return next;
    }, `Admin: save announcement "${announcement.title.el}"`);
    return Response.json({ ok: true, announcements, mode: storeMode() });
  } catch (err) {
    return failure(err);
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();
  const id = new URL(request.url).searchParams.get("id") ?? "";
  try {
    const announcements = await updateAnnouncements((list) => list.filter((a) => a.id !== id), `Admin: delete announcement ${id}`);
    return Response.json({ ok: true, announcements, mode: storeMode() });
  } catch (err) {
    return failure(err);
  }
}
