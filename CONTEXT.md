# Domain glossary

Terms this codebase uses with a specific meaning. Add a term when a decision names one; keep the
entries short and point at where the concept lives.

## Archive

The published output of Тера Фантастика — books, magazines and the newspaper — as browsed by this
app. In code, `src/archive/` owns **books and magazines only**; the newspaper is deliberately
outside it (see [ADR 0001](docs/adr/0001-newspaper-outside-the-archive.md)).

## Archive item

One book or one magazine, in the shape the app consumes: `ArchiveItem` in `src/types/index.ts`.
Produced only by `src/archive/`. Its field names are the domain's, not the source JSON's — the
JSON's capitalised `Year`/`Pages`/`Format` never leave the module.

## Uid

An archive item's identity across the whole archive, formed as `<kind>-<id>` (`book-3`).
Necessary because the raw `id` is unique only *within* a kind: books and magazines both use
`1..7`. Use `uid` for React keys and for anything that outlives a single collection — routes,
deep links, selection.

## Kind

Which collection an archive item belongs to: `book` or `magazine`. Part of its identity, not a
display detail.

## Issue

One page of the newspaper, as `NewspaperIssue`. Confusingly singular-sounding: `Viewer`'s
`issues` prop is a list of *pages*, and spread mode pairs page *n* with *n+1*. Not an archive item.

## Pane

One OpenSeadragon viewport inside the newspaper viewer. There are two in spread mode.
