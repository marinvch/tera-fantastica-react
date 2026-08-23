# Copilot Context — Quick Start

> **If starting a new conversation**: call `get_session_context` before any task to reload all critical context.

## MUST-ALWAYS Rules

- Use React (Vite) conventions for all new code
- Primary language: TypeScript with TypeScript
- Package manager: npm — do not mix with others
- Call get_repo_memory before starting any non-trivial task
- Call get_conventions before writing new code
- Call get_impact_of_change before editing any shared file
- Treat `src/App.tsx` as the active router shell
- Reuse `src/components/Carousel.tsx` and `src/components/Viewer.tsx` before creating new archive browsing components
- Keep shared types in `src/types/`

## Build & Test

```bash
npm run build   # build
npm run dev     # dev server
npm run preview # preview production build
```

No dedicated `npm test` script is currently defined in `package.json`.

## Key Files

| File | Role |
| ------ | ------ |
| `README.md` | key file |
| `package.json` | key file |
| `src/App.tsx` | active app shell and route entry |
| `src/types/index.ts` | shared UI data types |

## Session Restart Protocol

1. Call `get_session_context` → reloads this card
2. Call `get_repo_memory` → reloads durable decisions
3. Call `get_conventions` → reloads coding rules
