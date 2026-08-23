# 0002 — PDFs resolve through import.meta.glob, not a literal-path map

- Status: accepted
- Date: 2026-08-23

## Context

`books.json` stores a PDF as `link: "../assets/books/pdf/Foo.pdf"`. The old code declared a
`bookPdfMap` keyed on that exact literal string, mapping it to a Vite-imported module. Renaming a
PDF, or moving the file that held the map, broke the lookup **silently** — `resolveBookPdf` fell
through and returned the raw, unservable path.

Two alternatives were considered:

- **Move the PDFs to `public/`**, so every asset in the app is public-root-relative and the one
  normalisation rule covers all of them.
- **Keep the map**, but in one place instead of two.

## Decision

Resolve PDFs with `import.meta.glob("../assets/books/pdf/*.pdf", { eager: true, query: "?url" })`
and match on **basename**.

## Consequences

The fragile literal key is gone rather than centralised: Vite enumerates the directory at build
time, so adding or renaming a PDF needs no code change. Content-hashed filenames are preserved,
which moving to `public/` would have given up — these are the largest files in the repo and the
ones most worth caching.

The relative path in the JSON's `link` field is now decorative: only its basename is read. That is
recorded here so a future reader does not "fix" the paths and expect anything to change.

The `src/Assets` / `src/assets` casing hazard was settled in the same change, because it had to be:
git tracked both PDFs under `src/Assets/books/pdf/`, so on a case-sensitive filesystem this glob
would have matched nothing. They are now tracked lowercase, and the two dead trees that carried the
rest of the uppercase paths — `src/Assets/images/` (unused OpenSeadragon sprites) and
`src/assets/newspaper/` (~2,700 tiles duplicating `public/NewspaperDeepZoom/`) — were deleted.

`src/assets/` now holds only what is genuinely bundled: two JSON files and two PDFs. Anything the
app merely displays belongs in `public/`.
