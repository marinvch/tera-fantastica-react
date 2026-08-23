/** What kind of thing an archive item is. Part of its identity — ids collide across kinds. */
export type ArchiveKind = "book" | "magazine";

/**
 * An item in the archive, as the rest of the app sees it.
 *
 * Produced only by `src/archive`. Field names here are the domain's, not the source JSON's —
 * the JSON's capitalised `Year`/`Pages`/`Format` never escape the module.
 */
export interface ArchiveItem {
  /** Stable across the whole archive, e.g. `book-3`. Use this for keys and routes. */
  uid: string;
  /** Raw id from the source JSON. Unique only within a kind — books and magazines are both 1..7. */
  id: string | number;
  kind: ArchiveKind;
  url: string;
  name: string;
  author: string;
  format?: string;
  pages?: number;
  year?: number;
  link?: string;
}

/** An archive item that can be opened as a PDF. */
export interface BookReaderItem extends ArchiveItem {
  pdfUrl?: string;
}

export type SearchMode = "all" | "title" | "author" | "year";

export interface CarouselProps {
  data: ArchiveItem[];
  effectMode?: "coverflow" | "flip";
  onOpenLink?: (item: ArchiveItem) => void;
  /** uid of the item to open on mount. Unknown or absent falls back to the first item. */
  initialUid?: string;
  /** Fires when the visible item changes, so the route can follow the carousel. */
  onActiveChange?: (item: ArchiveItem) => void;
}

/**
 * The raw shape of `books.json` / `magazines.json`.
 *
 * Only `src/archive` should ever name this type. It is exported so the module's tests can build
 * fixtures, not so pages can read JSON directly.
 */
export interface ArchiveItemText {
  name: string;
  author: string;
  Format?: string;
  Pages?: number;
  Year?: number;
}

export interface ArchiveSourceItem {
  id: string | number;
  url: string;
  text: ArchiveItemText;
  link?: string;
}

export interface NewspaperIssue {
  id: string;
  title: string;
  imageUrl: string;
  tileSourceUrl?: string;
}

export interface ViewerProps {
  issues: NewspaperIssue[];
  initialIssueId?: string;
}
