# Coding Conventions — tera-fantastica-react

## Naming Conventions

- Component and page files use PascalCase, for example `Books.tsx`, `Carousel.tsx`, `Viewer.tsx`
- Shared interfaces and types live in `src/types/` and use PascalCase names
- Functions, helpers, and local variables use camelCase
- Existing content metadata fields from source JSON such as `Format`, `Pages`, and `Year` are preserved as-is when mapped into UI objects

## File Structure Rules

- App source code lives under `src/`
- Reusable presentation components belong in `src/components/`
- Route wrappers belong in `src/pages/`
- Shared data contracts belong in `src/types/`
- Static metadata for archive content lives under `src/assets/`

## React / UI Rules

- Prefer functional components only
- Reuse `Carousel` and `Viewer` before adding one-off browsing components
- Keep routing in `src/App.tsx`; treat `src/Router.jsx` as legacy unless intentionally revived
- Type component props explicitly; do not use `any`
- Prefer early returns over deep nesting

## Styling Rules

- The current UI mixes MUI `sx` styling with local CSS/SCSS files; keep changes consistent with the file you are editing
- Do not introduce Tailwind-specific guidance or utility-class assumptions into this repo
- Avoid adding `process.env.PUBLIC_URL`; this is a Vite app and current assets are referenced with absolute `/` paths

## Data / Asset Rules

- Books and magazines are driven by local JSON imports, not remote fetch calls
- Normalize raw JSON data in page-level mapping code before passing it to shared components
- Preserve current asset path behavior unless you are intentionally refactoring asset handling across the app

## Code Style

- Use async/await over `.then()` chains
- No commented-out code in commits
- No secrets or credentials in source code
