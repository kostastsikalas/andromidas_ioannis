import type { Article } from "@/content/articles";
import { isAuthenticated } from "@/lib/admin-auth";
import { readArticles, storeMode, updateArticles } from "@/lib/article-store";
import { validateArticle } from "@/lib/article-validate";

const unauthorized = () => Response.json({ error: "unauthorized" }, { status: 401 });
const failure = (err: unknown) => {
  console.error("[admin] save failed", err);
  const readonly = String(err).includes("readonly");
  return Response.json({ error: readonly ? "readonly" : "save_failed" }, { status: readonly ? 503 : 502 });
};

export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();
  return Response.json({ articles: await readArticles(), mode: storeMode() });
}

/** Create or update. `originalSlug` lets an article be renamed. */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();
  const body = (await request.json().catch(() => null)) as { article?: unknown; originalSlug?: unknown } | null;
  const result = validateArticle(body?.article);
  if ("error" in result) return Response.json(result, { status: 422 });
  const { article } = result;
  const original = typeof body?.originalSlug === "string" ? body.originalSlug : "";

  try {
    let conflict = false;
    const articles = await updateArticles((list) => {
      if (list.some((a) => a.slug === article.slug && a.slug !== original)) {
        conflict = true;
        return list;
      }
      const index = list.findIndex((a) => a.slug === (original || article.slug));
      const next: Article[] = [...list];
      if (index >= 0) next[index] = article;
      else next.unshift(article);
      return next;
    }, `Admin: ${original ? "update" : "add"} article "${article.title.el}"`);
    if (conflict) return Response.json({ error: "slug_taken" }, { status: 409 });
    return Response.json({ ok: true, articles, mode: storeMode() });
  } catch (err) {
    return failure(err);
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  try {
    const articles = await updateArticles((list) => list.filter((a) => a.slug !== slug), `Admin: delete article ${slug}`);
    return Response.json({ ok: true, articles, mode: storeMode() });
  } catch (err) {
    return failure(err);
  }
}
