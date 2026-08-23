# `src/utils/` — scoped brief

Scoped brief. Read the root [`/AGENTS.md`](../../AGENTS.md) first for stack and conventions; this
adds depth for `src/utils/`.

Two small modules. This directory used to hold the archive's path and search logic; both now live
in [`src/archive/`](../archive/AGENTS.md), and what is left is genuinely generic.

## archivePaths.ts

- **Archive assets are served from `public/`, never bundled from `src/`.** The `url` fields in the
  source JSON are root-relative *without* a leading slash (`"BooksImages/img1.png"`);
  `normalizePublicAssetPath` prefixes `/` so Vite serves them from `public/BooksImages/`. Adding an
  image means dropping the file in `public/`, not importing it.
- It passes absolute `http(s)://` URLs and already-rooted `/…` paths through untouched, and strips a
  leading `./`. It is idempotent. The pass-through branch is load-bearing: the source data is
  inconsistent — `books.json` stores `"BooksImages/img1.png"` while `magazines.json` stores
  `"/MagazineImages/img1.jpg"`.
- **Only two callers should exist**: `src/archive/` (which folds it in so no archive consumer can
  forget it) and `src/pages/Newspaper.tsx`. The newspaper is a deliberate exception — see
  [ADR 0001](../../docs/adr/0001-newspaper-outside-the-archive.md). A third caller is a smell:
  whatever it is resolving probably belongs in the archive.

## hooks.ts

- `useDebouncedValue<T>` only, used by the search field at 300 ms. Note the `<T,>` trailing comma —
  it keeps the `.ts` parser from reading the type parameter as JSX, so do not "tidy" it away.

## Verifying a change here

Run `npm test` (Vitest) and `npx tsc --noEmit`. The archive's tests cover normalisation indirectly:
`src/archive/archive.test.ts` asserts every item's `url` is public-root-relative.
