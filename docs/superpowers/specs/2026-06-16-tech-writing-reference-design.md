# Tech Writing Reference Files — Design Spec

**Date:** 2026-06-16  
**Status:** Approved

## Goal

Create a set of `.md` reference files distilling the Google Tech Writing course series into dense, Claude-readable notes. These files will be consulted when writing documentation for the Harbor Design System.

## File Structure

```
docs/
  writing-guides/
    tech-writing-overview.md
    tech-writing-one.md
    tech-writing-two.md
    tech-writing-accessibility.md
    tech-writing-error-messages.md
```

## Source URLs

| File | URL |
|---|---|
| `tech-writing-overview.md` | https://developers.google.com/tech-writing/overview |
| `tech-writing-one.md` | https://developers.google.com/tech-writing/one |
| `tech-writing-two.md` | https://developers.google.com/tech-writing/two |
| `tech-writing-accessibility.md` | https://developers.google.com/tech-writing/accessibility |
| `tech-writing-error-messages.md` | https://developers.google.com/tech-writing/error-messages |

## File Format (per file)

Each file follows this structure, optimized for Claude-as-reader:

1. **Kluczowe zasady** — bullet list of the most important rules from the course module
2. **Wzorce do stosowania** — concrete techniques with before/after examples
3. **Wzorce do unikania** — common mistakes described in the course
4. **Zastosowanie w DS** — how these principles apply specifically to design system documentation (components, tokens, APIs)

## Audience & Use

- **Reader:** Claude (not humans)
- **Use case:** Consulted before and during writing design system documentation
- **Tone:** Dense, no fluff — rules and patterns, not narrative
- **Scope:** Extract only what is directly applicable to DS documentation; skip purely academic or irrelevant sections

## Implementation Steps

1. Fetch each URL using WebFetch
2. Extract key principles, patterns, anti-patterns
3. Add a DS-specific application section for each
4. Write to `docs/writing-guides/<filename>.md`
5. Commit all files together
