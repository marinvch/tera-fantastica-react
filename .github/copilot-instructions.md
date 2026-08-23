# AI Coding Assistant — Project Instructions

> **Persona:** Act as a Senior React (Vite) developer with deep expertise in TypeScript and the full React (Vite) ecosystem.

## Project: tera-fantastica-react

**Primary Language:** TypeScript  
**Framework(s):** React (Vite)  
**Package Manager:** npm  
**TypeScript:** Yes

---

## Tech Stack

- **TypeScript** (42% of codebase, 13 files)
- **JSON** (23% of codebase, 7 files)
- **CSS** (13% of codebase, 4 files)
- **JavaScript** (10% of codebase, 3 files)
- **HTML** (6% of codebase, 2 files)

---

## Build Commands

- **Build:** `npm run build`
- **Dev:** `npm run dev`
- **Start:** `npm run start`

---

## Detected Conventions

- **Naming:** PascalCase for files and identifiers
- **Linter:** none detected
- **Formatter:** none detected
- **Test Framework:** none detected
- **Test Directory:** none detected

---

## Key Files

- `README.md`
- `package.json`

---

## Architecture

See `.github/ai-os/context/architecture.md` for the full architecture overview.  
See `.github/ai-os/context/conventions.md` for detailed coding conventions.  
See `.github/ai-os/context/stack.md` for the complete dependency inventory.

---

## General Rules

- Prefer **early returns** (guard clauses) over deep nesting
- Keep business logic out of UI components — delegate to services/utilities
- Use async/await over .then() chains
- Never commit secrets or credentials
- Only comment code that genuinely needs clarification

---

## Session Restart Protocol & MCP Tools

Both live in `.github/instructions/ai-os.instructions.md` (applyTo: `**`, so it is already
loaded alongside this file). It carries the same restart sequence and a superset of the tool
table — 15 tools rather than 12. Do not copy either back here.

---

## Memory Workflow

- MUST before implementation, retrieve relevant memory with `get_repo_memory`
- Follow `.github/ai-os/context/memory.md` for memory safety and quality rules
- MUST after completing a substantial task, store only verified durable findings with `remember_repo_fact`
- Prefer memory-backed decisions over assumptions to reduce drift in long sessions
- Never store speculative, duplicate, or transient status notes in repo memory

---

## Strict Behavior Guardrails

- MUST ask clarifying questions first when the request is ambiguous, underspecified, or conflicts with existing instructions
- MUST NOT improvise requirements, API contracts, or migration scope beyond what is explicitly requested
- If a requested change is outside the described scope, pause and confirm the boundary before editing code

### Allowed Actions

- Read relevant project context and memory before implementation
- Make the smallest in-scope change that satisfies the request
- Run non-destructive validation commands (build/test/lint) to verify correctness

### Forbidden Actions

- Silent fallback that hides core runtime failures
- Destructive operations (hard reset, force delete, irreversible rewrites) without explicit approval
- Broad refactors, dependency swaps, or architecture changes without user confirmation

### Escalation Flow (When Ambiguous)

1. State what is unclear and list assumptions that would change behavior.
2. Ask focused clarifying question(s) and propose bounded options.
3. Continue only after clarification; if unavailable, take the safest minimal action and document limits.

---

## React (Vite) Conventions

### Component Rules
- Functional components only (no class components)
- One component per file, filename matches component name (PascalCase)
- Type all component props explicitly
- Reuse existing browsing components in `src/components/` before creating new ones

### State Management
- Local UI state: `useState` / `useReducer`
- Keep derived state computed rather than duplicated when possible

### Data and Asset Handling
- The current app is asset-driven and imports local JSON for books and magazines
- Normalize source metadata in route/page files before passing it into shared components
- Preserve the current absolute `/` asset path pattern unless a task explicitly refactors asset handling

### Styling
- The current repo uses MUI `sx` styling plus local CSS/SCSS files
- Follow the styling approach already used in the file you are editing
- No inline styles except for dynamic values

### Performance
- `React.memo` for pure presentational components with expensive renders
- `useMemo` / `useCallback` only when profiling shows a need (don't pre-optimize)
- Lazy load routes with `React.lazy` + `Suspense` only if the app actually benefits from it

### Repo Notes
- `src/App.tsx` is the active router shell
- `src/Router.jsx` is legacy and should not be treated as the main entry point unless a task explicitly targets it
- There is currently no backend, auth layer, tRPC layer, or database access in this repo


## Persistent Rules

> These rules survive context window resets. They are enforced on every request.

- ALWAYS check `src/components` for existing components before creating new ones
- ALWAYS define shared types and interfaces in `src/types/` — do not redeclare them inline
- NEVER use `any` as a type — use proper TypeScript types or `unknown`