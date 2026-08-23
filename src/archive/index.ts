/**
 * The archive — books and magazines, as the rest of the app sees them.
 *
 * This module is the only place that knows the shape of `books.json` / `magazines.json`, how an
 * asset URL is resolved against `public/`, how a PDF link becomes a served URL, and how an item
 * is identified. Consumers get `ArchiveItem`s and cannot reach any of that.
 *
 * The newspaper is deliberately not here — see docs/adr/0001.
 */
import booksData from "../assets/books/books.json";
import magazinesData from "../assets/magazines/magazines.json";
import { resolvePdfUrl } from "./pdfs";
import { normalizePublicAssetPath } from "../utils/archivePaths";
import type {
  ArchiveItem,
  ArchiveKind,
  ArchiveSourceItem,
  BookReaderItem,
  SearchMode,
} from "../types";

/** Identity for an item across the whole archive. Ids are unique only within a kind. */
const uidOf = (kind: ArchiveKind, id: string | number): string => `${kind}-${id}`;

function toArchiveItem(source: ArchiveSourceItem, kind: ArchiveKind): BookReaderItem {
  const pdfUrl = resolvePdfUrl(source.link);

  return {
    uid: uidOf(kind, source.id),
    id: source.id,
    kind,
    url: normalizePublicAssetPath(source.url),
    name: source.text.name,
    author: source.text.author,
    format: source.text.Format,
    pages: source.text.Pages,
    year: source.text.Year,
    link: pdfUrl,
    pdfUrl,
  };
}

// Mapped once at module load: the JSON is static and bundled, so there is nothing to defer.
// Exposed through functions rather than as consts so the backing store can change later without
// touching a single call site.
const books: BookReaderItem[] = (booksData as ArchiveSourceItem[]).map((item) =>
  toArchiveItem(item, "book"),
);

const magazines: BookReaderItem[] = (magazinesData as ArchiveSourceItem[]).map((item) =>
  toArchiveItem(item, "magazine"),
);

export const getBooks = (): ArchiveItem[] => books;

export const getMagazines = (): ArchiveItem[] => magazines;

const matches = (item: ArchiveItem, query: string, mode: SearchMode): boolean => {
  const title = item.name.toLowerCase().includes(query);
  const author = item.author.toLowerCase().includes(query);
  const year = item.year?.toString().includes(query) ?? false;

  switch (mode) {
    case "title":
      return title;
    case "author":
      return author;
    case "year":
      return year;
    case "all":
    default:
      return title || author || year;
  }
};

/**
 * Search books and magazines together.
 *
 * Matching is a case-folded substring test; it is not accent- or Cyrillic-fold aware, so a query
 * must match the stored spelling. Results are unranked and uncapped — the caller decides how many
 * to show.
 */
export const search = (query: string, mode: SearchMode = "all"): ArchiveItem[] => {
  const needle = query.toLowerCase().trim();

  if (!needle) {
    return [];
  }

  return [...books, ...magazines].filter((item) => matches(item, needle, mode));
};
