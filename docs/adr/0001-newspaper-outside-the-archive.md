# 0001 — The newspaper stays outside the archive module

- Status: accepted
- Date: 2026-08-23

## Context

`src/archive/` was introduced to end a four-way duplication: `pages/Books.tsx`,
`pages/Magazines.tsx`, `data/booksCatalog.ts` and `utils/search.ts` each mapped the raw JSON to the
shape components consume, and two of them carried character-identical copies of `bookPdfMap`.

The newspaper also calls `normalizePublicAssetPath`, so folding it in was considered — it would
have left a single module owning every path in the app.

## Decision

The archive owns **books and magazines only**. `pages/Newspaper.tsx` keeps calling
`normalizePublicAssetPath` directly.

## Consequences

Books and magazines share a source shape (`ArchiveSourceItem` from JSON), an output shape
(`ArchiveItem`) and a consumer (`Carousel`). The newspaper shares none of those: it has no JSON, its
pages are generated from a hardcoded `issueNumbers` array, it produces `NewspaperIssue`, and it
feeds `Viewer`. A module owning all three would be wide again — the exact property the refactor set
out to remove.

The cost is one deliberate exception: `normalizePublicAssetPath` remains reachable from outside the
archive, for exactly one caller. That is the trade we accepted; if the newspaper ever gains a JSON
source and a shared shape, reopen this.
