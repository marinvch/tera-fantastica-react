# `src/archive/` — scoped brief

Scoped brief. Read the root [`/AGENTS.md`](../../AGENTS.md) first for stack and conventions; this
adds depth for `src/archive/`.

The module that owns the archive: books and magazines, from raw JSON to the shape the app renders.
It exists because that mapping was previously written by hand in four places and had already
drifted. Domain terms are defined in [`/CONTEXT.md`](../../CONTEXT.md).

## The one rule

**Nothing outside this module may know the source JSON's shape.** `ArchiveSourceItem` — with its
capitalised `Year`/`Pages`/`Format` and its `text` nesting — is named here and nowhere else.
Consumers receive `ArchiveItem` with lowercase domain fields. A page that imports `books.json`
directly has reintroduced the exact duplication this module removed.

## Invariants

- **`uid` is the identity, not `id`.** Books and magazines both use ids `1..7`, so a raw `id` is
  ambiguous across the archive. `uid` is `<kind>-<id>`. Use it for React keys and anything that
  outlives one collection. `archive.test.ts` asserts uniqueness — that test is the guard.
- **Mapping is eager, access is functional.** `books`/`magazines` are built once at module load
  (the JSON is static and bundled) but exposed only through `getBooks()`/`getMagazines()`, so the
  backing store can change without touching a call site. Do not export the arrays directly.
- **Every `url` leaves here public-root-relative.** `normalizePublicAssetPath` is applied on the way
  out; there is no un-normalised value for a consumer to hold.
- **PDFs resolve by basename**, not by the literal path in the JSON's `link` field — see
  [ADR 0002](../../docs/adr/0002-pdf-resolution-via-import-meta-glob.md). The relative path stored
  in the JSON is decorative; only its filename is read. Do not "fix" those paths expecting an
  effect.
- **`search()` returns everything it matches**, unranked and uncapped; the caller slices. Matching
  is `toLowerCase().includes()` and is **not** accent- or Cyrillic-fold aware, so a query must match
  the stored spelling.

## Gotchas

- Only 2 of 7 books have a PDF; **no** magazine has one. Code that assumes `link` is populated will
  look correct against the wrong half of the data.
- The newspaper is not here and should not be added — [ADR 0001](../../docs/adr/0001-newspaper-outside-the-archive.md).

## Verifying a change here

`npm test` runs `src/archive/archive.test.ts` — nine cases covering both collections, uid
uniqueness, public-root urls, domain field mapping, PDF resolution and all four search modes. This
is the repo's only test surface; keep it that way by keeping logic in the module rather than in the
components that call it.
