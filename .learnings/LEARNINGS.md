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

## [LRN-20260209-002] best_practice

**Logged**: 2026-02-09T23:10:00Z
**Priority**: high
**Status**: pending
**Area**: docs

### Summary
Analyzed dashboard-api skill. Laurenz's custom skill is exceptionally well-designed. VERY lean, practical documentation focused on CLI workflows.

### Details
Reviewed skill against Skill Creator best practices:
- **Structure:** Perfect. Single SKILL.md, no bloat, no README/CHANGELOG
- **Frontmatter:** Correct (name, description, user-invocable: false)
- **Description:** Clear triggering info ("localhost:3000", API structure)
- **Body:** Concise endpoint reference with JSON examples
- **Tone:** Imperative/action-oriented (no "should", no verbose explanations)
- **Token efficiency:** ~150 lines. Zero unnecessary context.
- **Cisco scan:** SAFE ✓

This is exactly what a skill SHOULD be:
1. Self-contained reference for a specific capability
2. No auxiliary documentation
3. Practical examples (curl commands)
4. Direct correlation to actual API implementation
5. Progressive disclosure: Endpoints + fields + workflow rules

### Suggested Action
Promote this as a template for future skills. The skill-creator recommends exactly this pattern.

### Metadata
- Source: skill-creator review
- Related Files: ~/.openclaw/workspace/skills/dashboard-api/SKILL.md, skill-creator/SKILL.md
- Tags: skills, documentation, best_practice
- See Also: None yet

---
