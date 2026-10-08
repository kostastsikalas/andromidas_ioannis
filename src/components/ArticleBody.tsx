import { inlineSegments, parseArticleText } from "@/lib/article-text";

function Inline({ text }: { text: string }) {
  return (
    <>
      {inlineSegments(text).map((s, i) =>
        s.bold ? (
          <strong key={i} className="font-semibold text-ink">
            {s.text}
          </strong>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

/** Renders the admin text format as React elements (never raw HTML). */
export function ArticleBody({ text }: { text: string }) {
  return (
    <div className="space-y-5 text-lg leading-relaxed text-ink/90">
      {parseArticleText(text).map((block, i) => {
        if (block.type === "h")
          return (
            <h2 key={i} className="pt-2 font-display text-xl font-extrabold text-brand-900 sm:text-2xl">
              <Inline text={block.text} />
            </h2>
          );
        if (block.type === "list")
          return (
            <ul key={i} className="space-y-2 rounded-2xl border border-line bg-white p-5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
