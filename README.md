# Harbor Design System

A design system for Harbor.

## Getting started

```bash
npm install          # Install all workspace dependencies
npm start            # Start Storybook at http://localhost:6006
npm run build:tokens # Build design tokens with Style Dictionary
```

## Project structure

```
packages/
  harbor-tokens/        # Style Dictionary token build
    core/               # Theme-agnostic (tier-1 primitives)
    light/              # Light theme tokens
      tier-1-definitions/
      tier-2-usage/
      tier-3-components/
      build/            # Generated — run npm run build:tokens
    config.js           # Style Dictionary config
  harbor-storybook/     # React + Storybook
    .storybook/
      components/       # Token visualization stories
    src/components/     # React components (added when ready)
docs/
  writing-guides/       # Writing reference files for documentation
reference/              # External reference materials
CLAUDE.md               # Instructions for Claude Code
```

## Writing guides

Before writing documentation, consult the relevant file in `docs/writing-guides/`:

| Situation | File |
|---|---|
| Any documentation (fundamentals) | `tech-writing-one.md` |
| Long docs / complex structure | `tech-writing-two.md` |
| Error messages / validation | `tech-writing-error-messages.md` |
| Diagrams, images, alt text | `tech-writing-accessibility.md` |
| Overview of all files | `tech-writing-overview.md` |

Based on Google's [Technical Writing Courses](https://developers.google.com/tech-writing/overview).
