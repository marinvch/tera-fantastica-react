# Тера Фантастика — agent brief

A small React reading app for a digital archive of Bulgarian science fiction: a deep-zoom
newspaper viewer, plus browsable carousels of books and magazines. UI copy is **Bulgarian** —
keep it that way; do not "helpfully" translate strings to English.

## Stack

- **React 19** + **TypeScript 5.9** (strict), built by **Vite 5** — not Create React App, despite
  the `build/` output dir and `browserslist` left over from it.
- **MUI 7** (`@mui/material`, `sx` props) for chrome; hand-written CSS in `src/styles/` for the
  viewer and carousel internals.
- **react-router-dom 6** (`<Routes>` / `element=`), **swiper 12**, **openseadragon 6**.
- ESM throughout (`"type": "module"`).

## Commands

| Task | Command |
|---|---|
| Dev server (port 3000, opens browser) | `npm run dev` |
| Typecheck | `npx tsc --noEmit` |
| Tests | `npm test` (Vitest, single run) / `npm run test:watch` |
| Production build | `npm run build` (runs `tsc` first — a type error fails the build) |
| Preview the build | `npm run preview` |

Tests are **Vitest only** — no jsdom, no component testing. The single suite covers
`src/archive/`, which is deliberate: that module is the app's one pure surface, and logic is worth
moving there partly because it becomes testable. `@testing-library/*` and `@types/jest` remain in
`devDependencies` unused, left over from Create React App.

## Layout

```
src/
  index.tsx        entry — mounts <App/> in StrictMode
  App.tsx          router + MUI drawer/appbar shell
  archive/         books + magazines: JSON -> ArchiveItem     -> see leaf
  pages/           Home, Books, Magazines, Newspaper — one routed screen each
  components/      Viewer, Carousel, GlobalSearch             -> see leaf
  utils/           path normalization, one hook               -> see leaf
  types/           all shared interfaces, one file
  styles/          viewer.css, swiper.css
  assets/          books/ + magazines/ only — JSON and the two bundled PDFs
public/            all runtime-fetched assets (images, DZI tiles)
```

## Where to look

| Working in | Read first |
|---|---|
| `src/archive/` | [`src/archive/AGENTS.md`](src/archive/AGENTS.md) |
| `src/components/` | [`src/components/AGENTS.md`](src/components/AGENTS.md) |
| `src/utils/` | [`src/utils/AGENTS.md`](src/utils/AGENTS.md) |

Domain terms are defined in [`CONTEXT.md`](CONTEXT.md); decisions that should not be re-litigated
are in [`docs/adr/`](docs/adr/).

## Repo-wide invariants

- **`src/App.tsx` owns routing.** The nav items in `navItems` and the `<Route>` list must be kept
  in sync. A second, dead `Router.jsx` on the react-router v5 API used to sit beside it; it was
  deleted, and a new one should not appear.
- **Every routed screen lives in `src/pages/`**, one component per file, PascalCase, default
  export. Shared pieces go in `src/components/`.
- **`src/assets/` holds only what is bundled**: `books.json`, `magazines.json` and two PDFs.
  Everything else the app displays is served from `public/`. A `src/assets/newspaper/` tree of
  ~2,700 tiles duplicating `public/NewspaperDeepZoom/` was deleted along with unused OpenSeadragon
  sprites — do not re-add images under `src/`.
- **Newspaper issue 6 does not exist.** `issueNumbers` in `src/pages/Newspaper.tsx` is
  `[1,2,3,4,5,7,8]` and that matches `public/NewspaperDeepZoom/` and `public/NewspaperImages/`.
  It is deliberate, not an off-by-one.
- **Everything shared is typed in `src/types/index.ts`.** Add to that file rather than declaring
  local duplicates. The capitalised `Year`/`Pages`/`Format` survive only on `ArchiveSourceItem`,
  the raw JSON shape — which no module outside `src/archive/` may name.
- **No page reads the archive JSON directly.** Pages call `getBooks()` / `getMagazines()` and render
  one component; anything else reintroduces the duplication `src/archive/` was built to remove.
- **The AppBar offset is computed in JS, not with breakpoint objects.** `App.tsx` derives
  `contentWidth`/`contentOffset` from the same `isMobile` that picks the drawer variant. An earlier
  `calc(100% - ${drawerWidth})` interpolated a bare number, produced invalid CSS, and let the AppBar
  run under the drawer — which silently hid the left half of the search results.

## Conventions

- Function components typed `React.FC<Props>`, default export at the bottom of the file.
- `strict`, `noUnusedLocals` and `noUnusedParameters` are all on — dead variables fail the build.
- New code is `.tsx`/`.ts`. The remaining `.jsx` files are legacy or empty placeholders.
- Colors are hard-coded hex in `sx` props (`#f7f4ed` paper, `#171512` ink, `#ddd4c5` rule). There
  is no MUI theme override; match the existing values rather than introducing a palette.
