"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Article } from "@/content/articles";
import { sortArticles } from "@/content/articles";
import { slugify } from "@/lib/article-text";
import { runtimeConfig } from "@/lib/runtime-config";
import { ArticleBody } from "../ArticleBody";
import { LogoMark } from "../Logo";

type Mode = "github" | "fs" | "static" | "readonly";

const api = runtimeConfig.adminApi;

const errors: Record<string, string> = {
  wrong_password: "Λάθος κωδικός.",
  rate_limited: "Πολλές προσπάθειες. Δοκιμάστε ξανά σε λίγα λεπτά.",
  unauthorized: "Η σύνδεση έληξε. Συνδεθείτε ξανά.",
  invalid_slug: "Η διεύθυνση (URL) του άρθρου δεν είναι έγκυρη.",
  slug_taken: "Υπάρχει ήδη άρθρο με αυτή τη διεύθυνση (URL). Αλλάξτε τον τίτλο ή τη διεύθυνση.",
  missing_title: "Συμπληρώστε τίτλο.",
  missing_body: "Συμπληρώστε το κείμενο του άρθρου.",
  missing_image: "Ανεβάστε μια φωτογραφία.",
  invalid_date: "Μη έγκυρη ημερομηνία.",
  too_large: "Η φωτογραφία είναι πολύ μεγάλη.",
  not_jpeg: "Μη έγκυρο αρχείο εικόνας.",
  readonly: "Η αποθήκευση δεν έχει ρυθμιστεί στον server (δείτε τον οδηγό παράδοσης).",
  save_failed: "Η αποθήκευση απέτυχε. Δοκιμάστε ξανά.",
  upload_failed: "Το ανέβασμα της φωτογραφίας απέτυχε.",
  network: "Πρόβλημα σύνδεσης. Ελέγξτε το internet και δοκιμάστε ξανά.",
};
const errorText = (code: string) => errors[code] ?? `Σφάλμα (${code}).`;

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "same-origin",
      cache: "no-store",
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("network");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? String(res.status));
  return data as T;
}

const today = () => new Date().toISOString().slice(0, 10);

const emptyArticle = (): Article => ({
  slug: "",
  date: today(),
  title: { el: "", en: "" },
  excerpt: { el: "", en: "" },
  body: { el: "", en: "" },
  image: "",
  imageWidth: 1600,
  imageHeight: 1200,
  credit: "",
});

/** Resizes a photo in the browser so uploads stay small and fast on mobile data. */
async function resizePhoto(file: File, max = 1600) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return { data: canvas.toDataURL("image/jpeg", 0.82), width: canvas.width, height: canvas.height };
}

const input =
  "mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";
const label = "block text-sm font-semibold text-ink";
const btn = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition disabled:opacity-50";

export function AdminApp() {
  const [state, setState] = useState<"loading" | "login" | "ready">("loading");
  const [mode, setMode] = useState<Mode>("fs");
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<{ article: Article; originalSlug: string } | null>(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const fail = useCallback((err: unknown) => {
    const code = err instanceof Error ? err.message : "network";
    if (code === "unauthorized") setState("login");
    setNotice({ kind: "error", text: errorText(code) });
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await call<{ articles: Article[]; mode: Mode }>(api("articles"));
      setArticles(sortArticles(data.articles));
      setMode(data.mode);
      setState("ready");
    } catch (err) {
      fail(err);
    }
  }, [fail]);

  useEffect(() => {
    call<{ authenticated: boolean }>(api("session"))
      .then((s) => (s.authenticated ? load() : setState("login")))
      .catch(() => setState("login"));
  }, [load]);

  if (state === "loading") return <Shell><p className="py-20 text-center text-muted">Φόρτωση…</p></Shell>;

  if (state === "login")
    return (
      <Shell>
        <Login
          notice={notice}
          onLogin={async (password) => {
            setNotice(null);
            try {
              await call(api("login"), { method: "POST", body: JSON.stringify({ password }) });
              await load();
            } catch (err) {
              fail(err);
            }
          }}
        />
      </Shell>
    );

  const savedMessage =
    mode === "github"
      ? "Αποθηκεύτηκε! Θα εμφανιστεί στο site σε 1–2 λεπτά."
      : "Αποθηκεύτηκε! Είναι ήδη διαθέσιμο στο site.";

  return (
    <Shell
      onLogout={async () => {
        await call(api("logout"), { method: "POST" }).catch(() => {});
        setState("login");
        setEditing(null);
      }}
    >
      {notice && (
        <div
          role={notice.kind === "error" ? "alert" : "status"}
          className={`mb-6 flex items-start justify-between gap-4 rounded-2xl p-4 ${notice.kind === "ok" ? "bg-emerald-50 text-emerald-900" : "bg-accent-500/10 text-accent-600"}`}
        >
          <p>{notice.text}</p>
          <button type="button" onClick={() => setNotice(null)} className="text-sm font-semibold underline">
            OK
          </button>
        </div>
      )}
      {mode === "readonly" && (
        <p className="mb-6 rounded-2xl bg-amber-50 p-4 text-amber-900">{errors.readonly}</p>
      )}

      {editing ? (
        <Editor
          key={editing.originalSlug || "new"}
          initial={editing.article}
          isNew={!editing.originalSlug}
          existingSlugs={articles.map((a) => a.slug).filter((s) => s !== editing.originalSlug)}
          onCancel={() => setEditing(null)}
          onError={fail}
          onSave={async (article) => {
            setNotice(null);
            try {
              const data = await call<{ articles: Article[] }>(api("articles"), {
                method: "POST",
                body: JSON.stringify({ article, originalSlug: editing.originalSlug }),
              });
              setArticles(sortArticles(data.articles));
              setEditing(null);
              setNotice({ kind: "ok", text: savedMessage });
              window.scrollTo({ top: 0 });
            } catch (err) {
              fail(err);
            }
          }}
        />
      ) : (
        <ArticleList
          articles={articles}
          onNew={() => {
            setNotice(null);
            setEditing({ article: emptyArticle(), originalSlug: "" });
          }}
          onEdit={(a) => {
            setNotice(null);
            setEditing({ article: structuredClone(a), originalSlug: a.slug });
          }}
          onDelete={async (a) => {
            if (!window.confirm(`Διαγραφή του άρθρου «${a.title.el}»; Η ενέργεια δεν αναιρείται.`)) return;
            try {
              const data = await call<{ articles: Article[] }>(`${api("articles")}${api("articles").includes("?") ? "&" : "?"}slug=${encodeURIComponent(a.slug)}`, { method: "DELETE" });
              setArticles(sortArticles(data.articles));
              setNotice({ kind: "ok", text: mode === "github" ? "Διαγράφηκε. Θα φύγει από το site σε 1–2 λεπτά." : "Διαγράφηκε." });
            } catch (err) {
              fail(err);
            }
          }}
        />
      )}
    </Shell>
  );
}

function Shell({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark className="h-9 w-9 shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display font-bold text-brand-900">Διαχείριση άρθρων</p>
              <a href="/el/articles" target="_blank" className="text-xs text-brand-600 hover:underline">
                Προβολή site ↗
              </a>
            </div>
          </div>
          {onLogout && (
            <button type="button" onClick={onLogout} className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-brand-50">
              Αποσύνδεση
            </button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}

function Login({ onLogin, notice }: { onLogin: (password: string) => Promise<void>; notice: { kind: string; text: string } | null }) {
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mx-auto mt-10 max-w-sm rounded-3xl border border-line bg-white p-7 shadow-sm"
      onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBusy(true);
        await onLogin(String(new FormData(e.currentTarget).get("password") ?? ""));
        setBusy(false);
      }}
    >
      <h1 className="font-display text-2xl font-extrabold text-brand-900">Είσοδος</h1>
      <p className="mt-1 text-sm text-muted">Συνδεθείτε για να προσθέσετε ή να επεξεργαστείτε άρθρα.</p>
      <label className={`${label} mt-6`}>
        Κωδικός
        <input name="password" type="password" required autoComplete="current-password" className={input} />
      </label>
      {notice && <p role="alert" className="mt-4 text-sm text-accent-600">{notice.text}</p>}
      <button type="submit" disabled={busy} className={`${btn} mt-6 w-full bg-brand-600 text-white hover:bg-brand-700`}>
        {busy ? "Σύνδεση…" : "Σύνδεση"}
      </button>
    </form>
  );
}

function ArticleList({
  articles,
  onNew,
  onEdit,
  onDelete,
}: {
  articles: Article[];
  onNew: () => void;
  onEdit: (a: Article) => void;
  onDelete: (a: Article) => void;
}) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-900 sm:text-3xl">Άρθρα</h1>
          <p className="text-sm text-muted">{articles.length} δημοσιευμένα</p>
        </div>
        <button type="button" onClick={onNew} className={`${btn} bg-accent-500 text-white shadow-sm hover:bg-accent-600`}>
          + Νέο άρθρο
        </button>
      </div>
      <ul className="space-y-3">
        {articles.map((a) => (
          <li key={a.slug} className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-line bg-white p-3 sm:flex-nowrap sm:p-4">
            <AdminImage src={a.image} className="h-16 w-20 shrink-0 rounded-xl object-cover sm:h-20 sm:w-28" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-semibold text-ink">{a.title.el}</p>
              <p className="mt-0.5 text-xs text-muted">
                {a.date ? new Date(a.date).toLocaleDateString("el-GR") : "Από το παλιό site"}
                {a.body.en.trim() ? " · EL + EN" : " · EL"}
              </p>
            </div>
            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
              <button type="button" onClick={() => onEdit(a)} className="flex-1 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
                Επεξεργασία
              </button>
              <button type="button" onClick={() => onDelete(a)} className="flex-1 rounded-full border border-accent-500/20 px-4 py-2 text-sm font-semibold text-accent-600 hover:bg-accent-500/10">
                Διαγραφή
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function AdminImage({ src, className }: { src: string; className: string }) {
  // Plain <img>: a just-uploaded photo may not be deployed yet, and we show it as-is.
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" className={`${className} bg-brand-50`} /> : <div className={`${className} bg-brand-50`} />;
}

function Editor({
  initial,
  isNew,
  existingSlugs,
  onSave,
  onCancel,
  onError,
}: {
  initial: Article;
  isNew: boolean;
  existingSlugs: string[];
  onSave: (a: Article) => Promise<void>;
  onCancel: () => void;
  onError: (err: unknown) => void;
}) {
  const [a, setA] = useState(initial);
  const [preview, setPreview] = useState<string>(initial.image);
  const [showEnglish, setShowEnglish] = useState(Boolean(initial.body.en || initial.title.en));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const set = <K extends keyof Article>(key: K, value: Article[K]) => setA((prev) => ({ ...prev, [key]: value }));
  const setLang = (key: "title" | "excerpt" | "body", lang: "el" | "en", value: string) =>
    setA((prev) => {
      const next = { ...prev, [key]: { ...prev[key], [lang]: value } };
      if (key === "title" && lang === "el" && !slugTouched) next.slug = slugify(value);
      return next;
    });

  const slugTaken = existingSlugs.includes(a.slug);

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const resized = await resizePhoto(file);
      setPreview(resized.data);
      const { url } = await call<{ url: string }>(api("upload"), {
        method: "POST",
        body: JSON.stringify({ name: file.name, data: resized.data }),
      });
      setA((prev) => ({ ...prev, image: url, imageWidth: resized.width, imageHeight: resized.height }));
    } catch (err) {
      setPreview(a.image);
      onError(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(a);
        setSaving(false);
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-extrabold text-brand-900">{isNew ? "Νέο άρθρο" : "Επεξεργασία άρθρου"}</h1>
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-brand-600 hover:underline">
          ← Πίσω
        </button>
      </div>

      <section className="space-y-5 rounded-3xl border border-line bg-white p-5 sm:p-7">
        <label className={label}>
          Τίτλος *
          <input required value={a.title.el} onChange={(e) => setLang("title", "el", e.target.value)} className={input} placeholder="π.χ. Αλλεργική ρινίτιδα" />
        </label>

        <div>
          <p className={label}>Φωτογραφία *</p>
          <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <AdminImage src={preview} className="aspect-[16/10] w-full rounded-2xl object-cover sm:w-56" />
            <div className="space-y-2">
              <label className={`${btn} cursor-pointer border border-brand-200 bg-white text-brand-700 hover:bg-brand-50`}>
                {uploading ? "Ανέβασμα…" : preview ? "Αλλαγή φωτογραφίας" : "Επιλογή φωτογραφίας"}
                <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(e) => onPhoto(e.target.files?.[0])} />
              </label>
              <p className="text-xs text-muted">Από το κινητό ή τον υπολογιστή. Μικραίνει αυτόματα.</p>
            </div>
          </div>
          <label className={`${label} mt-4 font-medium`}>
            Πηγή φωτογραφίας (προαιρετικό)
            <input value={a.credit} onChange={(e) => set("credit", e.target.value)} className={input} placeholder="π.χ. freepik.com" />
          </label>
        </div>

        <label className={label}>
          Σύντομη περιγραφή
          <textarea rows={2} value={a.excerpt.el} onChange={(e) => setLang("excerpt", "el", e.target.value)} className={input} placeholder="1–2 προτάσεις που εμφανίζονται στη λίστα άρθρων" />
        </label>

        <div>
          <div className="flex items-end justify-between gap-3">
            <p className={label}>Κείμενο *</p>
            <div className="flex rounded-full bg-brand-50 p-1 text-sm font-semibold">
              {(["write", "preview"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 ${tab === t ? "bg-white text-brand-700 shadow-sm" : "text-muted"}`}>
                  {t === "write" ? "Γράψιμο" : "Προεπισκόπηση"}
                </button>
              ))}
            </div>
          </div>
          {tab === "write" ? (
            <>
              <textarea
                required
                rows={14}
                value={a.body.el}
                onChange={(e) => setLang("body", "el", e.target.value)}
                className={`${input} font-[inherit] leading-relaxed`}
              />
              <FormatHelp />
            </>
          ) : (
            <div className="mt-1.5 rounded-2xl border border-line bg-paper p-5">
              {a.body.el.trim() ? <ArticleBody text={a.body.el} /> : <p className="text-muted">Δεν υπάρχει κείμενο ακόμα.</p>}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-5 sm:p-7">
        <label className="flex items-center gap-3 font-semibold text-ink">
          <input type="checkbox" checked={showEnglish} onChange={(e) => setShowEnglish(e.target.checked)} className="h-5 w-5 accent-brand-600" />
          Αγγλική έκδοση (προαιρετικό)
        </label>
        <p className="mt-1 text-sm text-muted">Αν δεν συμπληρωθεί, στην αγγλική σελίδα εμφανίζεται το ελληνικό κείμενο.</p>
        {showEnglish && (
          <div className="mt-5 space-y-5">
            <label className={label}>
              Title (English)
              <input value={a.title.en} onChange={(e) => setLang("title", "en", e.target.value)} className={input} />
            </label>
            <label className={label}>
              Short description (English)
              <textarea rows={2} value={a.excerpt.en} onChange={(e) => setLang("excerpt", "en", e.target.value)} className={input} />
            </label>
            <label className={label}>
              Text (English)
              <textarea rows={10} value={a.body.en} onChange={(e) => setLang("body", "en", e.target.value)} className={input} />
            </label>
          </div>
        )}
      </section>

      <details className="rounded-3xl border border-line bg-white p-5 sm:p-7">
        <summary className="cursor-pointer font-semibold text-ink">Ρυθμίσεις</summary>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Ημερομηνία
            <input type="date" value={a.date} onChange={(e) => set("date", e.target.value)} className={input} />
          </label>
          <label className={label}>
            Διεύθυνση (URL)
            <input
              value={a.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className={input}
            />
            <span className="mt-1 block text-xs font-normal text-muted">/el/articles/{a.slug || "…"}</span>
          </label>
        </div>
      </details>

      {slugTaken && <p className="text-sm text-accent-600">{errors.slug_taken}</p>}

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-line bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button type="submit" disabled={saving || uploading || !a.image || slugTaken || !a.slug} className={`${btn} flex-1 bg-brand-600 text-white hover:bg-brand-700 sm:flex-none`}>
          {saving ? "Αποθήκευση…" : isNew ? "Δημοσίευση" : "Αποθήκευση αλλαγών"}
        </button>
        <button type="button" onClick={onCancel} className={`${btn} border border-line bg-white text-ink hover:bg-brand-50`}>
          Άκυρο
        </button>
      </div>
    </form>
  );
}

function FormatHelp() {
  return (
    <details className="mt-2 text-sm text-muted">
      <summary className="cursor-pointer font-medium text-brand-600">Πώς μορφοποιώ το κείμενο;</summary>
      <ul className="mt-2 space-y-1 rounded-xl bg-brand-50 p-4 text-ink/80">
        <li>• Κενή γραμμή ανάμεσα → νέα παράγραφος</li>
        <li>
          • <code>## Τίτλος</code> στην αρχή της γραμμής → υπότιτλος
        </li>
        <li>
          • <code>- κείμενο</code> στην αρχή της γραμμής → κουκκίδα λίστας
        </li>
        <li>
          • <code>**λέξη**</code> → <strong>έντονα</strong>
        </li>
      </ul>
    </details>
  );
}
