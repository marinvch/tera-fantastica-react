# `src/components/` — scoped brief

Scoped brief. Read the root [`/AGENTS.md`](../../AGENTS.md) first for stack and conventions; this
adds depth for `src/components/`.

Three components — `Viewer` (deep-zoom newspaper), `Carousel` (books/magazines browser) and
`GlobalSearch` (app-bar search). Pages hand them fully-formed data from `src/archive/`; the
components own all interaction state and never read JSON themselves.

## Viewer.tsx + useDeepZoomPane.ts + paneOptions.ts

An "issue" in `ViewerProps` is really **one page** of the newspaper (the buttons say
"Предишна/Следваща страница"). Spread mode pairs index `n` with `n+1` and steps by 2.

- **`useDeepZoomPane` owns the OpenSeadragon lifecycle — all of it.** Create, handler wiring,
  `goHome`, failure, and `destroy()` in the effect cleanup. The effect re-runs on every page turn,
  so a missed `destroy()` leaks a canvas and a live tile-fetch loop each time. This used to be a
  discipline repeated across two near-identical effects in the component; keep it in one place.
- **An inactive pane is switched off by passing `undefined` as its tile source**, not by a boolean.
  That is what "not in spread mode" means: the second pane reports `idle` and mounts nothing.
- **Each pane reports its own status**; the component derives `isLoading`/`hasError` from both.
  There is no shared flag that two effects race to clear — that coupling was the old bug.
- **The tile source is `issue.tileSourceUrl ?? issue.imageUrl`** — a DZI `dzc_output.xml` when
  present, otherwise the flat PNG. Both must exist under `public/`.
- **`paneOptions.ts` uses `import type` for OpenSeadragon on purpose.** OSD touches `document` at
  module load, so a real import would make the options untestable outside a browser. That file is
  the only part of the viewer with tests; do not merge it back into the hook.
- **Mouse wheel is deliberately not zoom.** `gestureSettingsMouse.scrollToZoom` is `false` and the
  component's `onWheel` turns pages instead, guarded by a 360 ms lock. Re-enabling scroll-to-zoom
  makes the page-turn gesture unusable.
- **Fullscreen is app-managed on purpose.** `handleToggleFullscreen` never calls
  `requestFullscreen()`; it toggles `isPseudoFullscreen`, which adds a CSS class so the custom
  controls stay visible. The native `fullscreenchange` listener remains only to react if the
  browser enters fullscreen another way. This looks like a bug and is not.
- All viewport buttons apply to **both** panes at once.


## Carousel.tsx — Swiper

- **`loop` is enabled only when there are more than 2 slides** (`isLoopEnabled`). Swiper's loop
  mode misbehaves below that, so do not force it on.
- Because loop clones slides, `onSlideChange` reads **`swiper.realIndex`**, not `activeIndex`.
  Using `activeIndex` desynchronizes the detail panel from the visible slide.
- Desktop uses `slidesPerView: "auto"`, which means slide width comes from `../styles/swiper.css`,
  not from props. Mobile switches to `1.15` and to **vertical** direction.
- The PDF affordance renders only when `item.link` is a non-empty string, and switches between a
  `<button>` (when `onOpenLink` is passed) and an `<a>` (when it is not).

## GlobalSearch.tsx

- Input is debounced 300 ms via `useDebouncedValue`; the search effect depends on the debounced
  value **and** `searchMode`, so switching mode re-runs the query without retyping.
- The dropdown closes via a full-screen transparent backdrop `Box` at `zIndex: 1200`, under the
  results at `1300`. Anything new that must stay clickable while results are open needs a higher
  z-index than the backdrop.
- **One dead end remains:** `handleSelect` navigates with `state: { searchQuery: result.name }`,
  which neither `pages/Books.tsx` nor `pages/Magazines.tsx` reads — picking a result lands on the
  right page but highlights nothing. Fixing it properly means routing by `uid`; that is the
  selection-seam work, not a patch here.
- Rows are built from plain `Box`/`Typography`, **not `<ListItemText>`** — MUI v7 removed
  `primaryTypographyProps`/`secondaryTypographyProps` and the row rendered blank through the slot
  API. Do not "simplify" it back.
- The mode filter is hidden below `sm`: it cost 120px of a 390px screen and left the input
  unusable. Phones search in `all` mode.
- Only the first 10 results render, with a count line when there are more.

## What is not here

`Layout/` was deleted: `Header.tsx`/`Footer.tsx` were unrouted stubs shadowed by two 0-byte
`.jsx` twins, and `Home.tsx` moved to [`src/pages/Home.tsx`](../pages/Home.tsx) where the other
routed screens live. The app bar and drawer are built in `App.tsx`; build chrome there, not in a
new Layout component.


## Verifying a change here

There are no tests. Run `npx tsc --noEmit`, then `npm run dev` and exercise the thing you touched:
`/newspaper` for the viewer (turn pages, toggle 1/2-page, fullscreen), `/books` and `/magazines`
for the carousel, and the app-bar field for search.
