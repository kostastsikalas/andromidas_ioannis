import "server-only";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Article } from "@/content/articles";

/**
 * Where admin changes are saved:
 *  - "github": commits to the GitHub repo (production on Vercel — the commit triggers a redeploy)
 *  - "fs":     writes files in this folder (local development)
 */
export type StoreMode = "github" | "fs" | "readonly";

const ARTICLES_PATH = "src/content/articles.json";
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

async function githubRead(): Promise<{ list: Article[]; sha: string }> {
  const res = await gh(`${ARTICLES_PATH}?ref=${branch()}`);
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const json = (await res.json()) as { content: string; sha: string };
  return { list: JSON.parse(Buffer.from(json.content, "base64").toString("utf8")), sha: json.sha };
}

async function githubPut(filePath: string, content: Buffer, message: string, sha?: string) {
  const res = await gh(filePath, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: content.toString("base64"), branch: branch(), ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`);
}

export async function readArticles(): Promise<Article[]> {
  if (storeMode() === "github") return (await githubRead()).list;
  return JSON.parse(await readFile(path.join(process.cwd(), ARTICLES_PATH), "utf8"));
}

/** Applies `change` to the latest list and saves it. Retries once if someone saved in between. */
export async function updateArticles(change: (list: Article[]) => Article[], message: string) {
  const mode = storeMode();
  if (mode === "readonly") throw new Error("readonly");
  const serialize = (list: Article[]) => Buffer.from(JSON.stringify(list, null, 2) + "\n");

  if (mode === "fs") {
    const next = change(await readArticles());
    await writeFile(path.join(process.cwd(), ARTICLES_PATH), serialize(next));
    return next;
  }
  for (let attempt = 0; ; attempt++) {
    const { list, sha } = await githubRead();
    const next = change(list);
    try {
      await githubPut(ARTICLES_PATH, serialize(next), message, sha);
      return next;
    } catch (err) {
      if (attempt >= 1 || !String(err).includes("409")) throw err;
    }
  }
}

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
