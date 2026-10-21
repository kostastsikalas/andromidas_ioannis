import "server-only";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Announcement } from "@/content/announcements";
import type { Article } from "@/content/articles";
import type { ClinicInfo } from "@/content/clinic";
import type { HomeContent } from "@/content/home";
import type { Locale } from "@/content/site";

/**
 * Where admin changes are saved:
 *  - "github": commits to the GitHub repo (production on Vercel — the commit triggers a redeploy)
 *  - "fs":     writes files in this folder (local development)
 */
export type StoreMode = "github" | "fs" | "readonly";

/** JSON lists in src/content/ (a fixed folder, so the build doesn't trace the whole project). */
const CONTENT_DIR = "src/content";
const ARTICLES_FILE = "articles.json";
const ANNOUNCEMENTS_FILE = "announcements.json";
const CLINIC_FILE = "clinic.json";
const HOME_FILE = "home.json";
const IMAGES_DIR = "public/images/articles";

export function storeMode(): StoreMode {
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) return "github";
  if (process.env.NODE_ENV !== "production") return "fs";
  return "readonly";
}

const gh = async (url: string, init?: RequestInit) => {
  const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${url}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
  });
  return res;
};
const branch = () => process.env.GITHUB_BRANCH || "main";

async function githubRead<T>(file: string): Promise<{ data: T; sha: string }> {
  const res = await gh(`${CONTENT_DIR}/${file}?ref=${branch()}`);
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const json = (await res.json()) as { content: string; sha: string };
  return { data: JSON.parse(Buffer.from(json.content, "base64").toString("utf8")), sha: json.sha };
}

async function githubPut(filePath: string, content: Buffer, message: string, sha?: string) {
  const res = await gh(filePath, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: content.toString("base64"), branch: branch(), ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`);
}

async function readJson<T>(file: string): Promise<T> {
  if (storeMode() === "github") return (await githubRead<T>(file)).data;
  return JSON.parse(await readFile(path.join(process.cwd(), "src/content", file), "utf8"));
}

/** Applies `change` to the latest saved value and saves it. Retries once if someone saved in between. */
async function updateJson<T>(file: string, change: (current: T) => T, message: string) {
  const mode = storeMode();
  if (mode === "readonly") throw new Error("readonly");
  const serialize = (value: T) => Buffer.from(JSON.stringify(value, null, 2) + "\n");

  if (mode === "fs") {
    const next = change(await readJson<T>(file));
    await writeFile(path.join(process.cwd(), "src/content", file), serialize(next));
    return next;
  }
  for (let attempt = 0; ; attempt++) {
    const { data, sha } = await githubRead<T>(file);
    const next = change(data);
    try {
      await githubPut(`${CONTENT_DIR}/${file}`, serialize(next), message, sha);
      return next;
    } catch (err) {
      if (attempt >= 1 || !String(err).includes("409")) throw err;
    }
  }
}

export const readArticles = () => readJson<Article[]>(ARTICLES_FILE);
export const updateArticles = (change: (list: Article[]) => Article[], message: string) =>
  updateJson(ARTICLES_FILE, change, message);

export const readAnnouncements = () => readJson<Announcement[]>(ANNOUNCEMENTS_FILE);
export const updateAnnouncements = (change: (list: Announcement[]) => Announcement[], message: string) =>
  updateJson(ANNOUNCEMENTS_FILE, change, message);

export const readClinic = () => readJson<ClinicInfo>(CLINIC_FILE);
export const saveClinic = (clinic: ClinicInfo) => updateJson<ClinicInfo>(CLINIC_FILE, () => clinic, "Admin: update clinic details");

type AllHome = Record<Locale, HomeContent>;
export const readHome = () => readJson<AllHome>(HOME_FILE);
export const saveHome = (home: AllHome) => updateJson<AllHome>(HOME_FILE, () => home, "Admin: update home page texts");

export async function saveImage(fileName: string, data: Buffer) {
  const mode = storeMode();
  if (mode === "readonly") throw new Error("readonly");
  if (mode === "github") {
    await githubPut(`${IMAGES_DIR}/${fileName}`, data, `Admin: upload image ${fileName}`);
  } else {
    const dir = path.join(process.cwd(), IMAGES_DIR);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fileName), data);
  }
  return `/images/articles/${fileName}`;
}
