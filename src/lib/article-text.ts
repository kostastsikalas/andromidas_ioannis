/**
 * The article text format the doctor writes in the admin panel:
 *
 *   Blank line        → new paragraph
 *   ## Heading        → sub-heading
 *   - item            → bullet list (consecutive lines)
 *   **bold**          → bold text
 */
export type TextBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] };

export function parseArticleText(source: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  for (const chunk of source.replace(/\r\n?/g, "\n").split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    let para: string[] = [];
    let list: string[] = [];
    const flushPara = () => {
      if (para.length) blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    };
    const flushList = () => {
      if (list.length) blocks.push({ type: "list", items: list });
      list = [];
    };
    for (const line of lines) {
      if (/^##\s+/.test(line)) {
        flushPara();
        flushList();
        blocks.push({ type: "h", text: line.replace(/^##\s+/, "") });
      } else if (/^[-•*]\s+/.test(line)) {
        flushPara();
        list.push(line.replace(/^[-•*]\s+/, ""));
      } else {
        flushList();
        para.push(line);
      }
    }
    flushPara();
    flushList();
  }
  return blocks;
}

/** Splits "**bold**" markers into segments. */
export function inlineSegments(text: string): { text: string; bold: boolean }[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("**") && part.endsWith("**")
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false },
    );
}

const greek: Record<string, string> = {
  α: "a", ά: "a", β: "v", γ: "g", δ: "d", ε: "e", έ: "e", ζ: "z", η: "i", ή: "i", θ: "th",
  ι: "i", ί: "i", ϊ: "i", ΐ: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", ό: "o",
  π: "p", ρ: "r", σ: "s", ς: "s", τ: "t", υ: "y", ύ: "y", ϋ: "y", ΰ: "y", φ: "f", χ: "ch",
  ψ: "ps", ω: "o", ώ: "o",
};

/** URL-safe slug from a Greek or English title, e.g. "Ρινοκολπίτιδες" → "rinokolpitides". */
export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/ου/g, "ou")
    .split("")
    .map((c) => greek[c] ?? c)
    .join("")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const isValidSlug = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug !== "view";
