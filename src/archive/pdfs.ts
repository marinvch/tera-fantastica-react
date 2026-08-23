/**
 * PDF resolution for archive items.
 *
 * The source JSON stores `link` as a path relative to wherever the old mapper happened to live
 * (`"../assets/books/pdf/Foo.pdf"`). That path is relative to nothing in particular now, so we
 * match on **basename** instead: Vite globs the directory at build time and we look the file up by
 * its filename. Renaming a PDF then Just Works, where the old literal-key map failed silently.
 */
const pdfModules = import.meta.glob("../assets/books/pdf/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byBasename = new Map<string, string>(
  Object.entries(pdfModules).map(([path, url]) => [basename(path), url]),
);

function basename(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

/**
 * Resolve a source `link` to a served URL.
 *
 * Returns "" for an absent link, the bundled URL for a known PDF, and the value untouched for
 * anything else (an absolute URL, say) — a link we do not recognise is passed through rather
 * than swallowed.
 */
export function resolvePdfUrl(link?: string): string {
  if (!link || !link.trim()) {
    return "";
  }

  return byBasename.get(basename(link)) ?? link;
}
