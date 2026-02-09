# LEARNINGS.md

Learning log for continuous improvement. Format: [LRN-YYYYMMDD-XXX] category.

## Process
1. Log immediately after learning (context is freshest)
2. Be specific with reproduction steps and file references
3. Link related entries with "See Also"
4. Promote broadly applicable learnings to MEMORY.md, AGENTS.md, SOUL.md, or TOOLS.md
5. Review before major tasks

## Categories
- `correction` — User corrected me
- `knowledge_gap` — Discovered outdated knowledge
- `best_practice` — Found better approach
- `integration_gotcha` — Tool/API behavior differs from expectation
- `workflow` — Process improvement

---

## [LRN-20260209-001] correction

**Logged**: 2026-02-09T23:05:00Z
**Priority**: high
**Status**: pending
**Area**: config

### Summary
Thought cisco-ai-skill-scanner needed installation from npm. Actually already installed globally at `/opt/homebrew/bin/skill-scanner` via Homebrew.

### Details
During bootstrap, I assumed tool wasn't present and tried npm install. Turned out it was already available system-wide from Homebrew installation. Created unnecessary confusion.

### Suggested Action
Always check PATH before attempting npm/pip installs. Use `which` or `command -v` first.

### Metadata
- Source: self-discovery
- Related Files: MEMORY.md (bootstrap section)
- Tags: automation, tooling
- See Also: None yet

---
