# Existing AI Context — tera-fantastica-react

## Detection Summary

- Total detected AI artifacts: **14+**
- Copilot instructions: **2**
- Copilot skills: **1**
- Prompt registries: **1**
- Agent files: **6**
- AI docs/context files: **6**
- MCP/runtime configs: **2**

## Detected Artifacts

- `.github/copilot-instructions.md`
- `.github/instructions/ai-os.instructions.md`
- `.github/instructions/frontend.instructions.md`
- `.github/copilot/prompts.json`
- `.github/copilot/skills/ai-os-react-patterns.md`
- `.github/agents/*.agent.md`
- `.github/ai-os/context/*.md`
- `.github/ai-os/memory/memory.jsonl`
- `.github/COPILOT_CONTEXT.md`
- `.vscode/mcp.json`
- `.ai-os/mcp-server/`

## Current State

AI OS is the primary active context system for this repository. The repo already contains:

- generated session context
- repo-specific instructions
- specialized agents
- repo memory
- local MCP server wiring

The main optimization need is not installing more scaffolding. It is keeping the generated context aligned with the real codebase as the app evolves.

## Recommended Maintenance Path

1. Treat `.github/ai-os/context/*.md` as editable source-of-truth documents between refreshes.
2. Refresh AI OS artifacts after architecture or workflow changes:

```bash
npx -y github:marinvch/ai-os --refresh-existing
```

1. Re-check generated files after refresh, because generic templates can reintroduce assumptions that do not match this repo.
2. Keep Copilot as the single active target for instructions, prompts, agents, and memory in this repository.

## Hardening Priorities

- Keep architecture and conventions docs repo-specific
- Keep persistent rules in sync with actual coding expectations
- Add durable repo memory when stable patterns are verified
- Remove agent guidance that assumes APIs, databases, tRPC, Next.js, or Tailwind when those are not present
