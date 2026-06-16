# Checkpoint — 2026-06-16

## Co zrobiliśmy

Zbudowaliśmy kompletny scaffold monorepo dla Harbor Design System. Storybook startuje, wszystko jest skonfigurowane — brakuje tylko treści (tokeny, komponenty).

## Obecna struktura projektu

```
Harbor Design System/
├── package.json              ← npm workspaces root
├── package-lock.json
├── CLAUDE.md                 ← instrukcje dla Claude Code
├── README.md
├── docs/
│   ├── writing-guides/       ← 5 plików referencyjnych (Google Tech Writing)
│   └── checkpoint-2026-06-16.md  ← ten plik
├── reference/                ← materiały źródłowe (kurs Subatomic)
└── packages/
    ├── harbor-tokens/
    │   ├── package.json      ← @harbor/tokens, devDeps: style-dictionary, minimist
    │   ├── config.js         ← Style Dictionary 4 config (transforms, formatters)
    │   ├── index.ts          ← placeholder, wypełniony po build:tokens
    │   ├── core/
    │   │   └── tier-1-definitions/   ← puste, tu trafią globalne prymitywy
    │   └── light/
    │       ├── tier-1-definitions/   ← puste, tu trafią tokeny tier-1 dla light
    │       ├── tier-2-usage/         ← puste, tu trafią tokeny tier-2
    │       ├── tier-3-components/    ← puste, tu trafią tokeny tier-3
    │       ├── scss/                 ← puste, na własnoręcznie pisane SCSS helpery
    │       └── build/                ← gitignored, generowany przez build:tokens
    └── harbor-storybook/
        ├── package.json      ← @harbor/storybook, React 18 + Storybook 8
        ├── tsconfig.json
        ├── vite.config.ts
        ├── .storybook/
        │   ├── main.ts       ← konfiguracja Storybook, globs na stories
        │   ├── preview.ts    ← import tokenów zakomentowany; storySort: Foundations → Components → Pages
        │   ├── themes.scss   ← import CSS tokenów zakomentowany
        │   └── components/
        │       ├── tier-1-tokens/tier-1-tokens.stories.tsx          ← placeholder (Foundations/Design Tokens)
        │       ├── tier-2-tokens/tier-2-tokens.stories.tsx          ← placeholder (Foundations/Design Tokens)
        │       ├── tier-3-tokens/tier-3-tokens.stories.tsx          ← placeholder (Foundations/Design Tokens)
        │       ├── components-placeholder/components-placeholder.stories.tsx  ← placeholder (Components)
        │       └── pages-placeholder/pages-placeholder.stories.tsx           ← placeholder (Pages)
        └── src/
            └── components/   ← puste, tu trafią komponenty React
```

## Jak uruchomić

```bash
npm install          # (już zrobione — node_modules istnieje)
npm start            # Storybook na http://localhost:6006
npm run build:tokens # Buduje tokeny przez Style Dictionary (na razie brak plików JSON → błąd "no source files" jest oczekiwany)
```

## Architektura tokenów

Trzy poziomy (tiers), każdy ma swój folder JSON i osobną story w Storybook:

| Tier | Folder | CSS prefix | Opis |
|---|---|---|---|
| 1 — Primitive | `light/tier-1-definitions/` | `--ds-` | Surowe wartości (kolory, spacing, typografia) |
| 2 — Semantic | `light/tier-2-usage/` | `--ds-theme-` | Znaczenie (color-background-primary, itp.) |
| 3 — Component | `light/tier-3-components/` | `--ds-theme-` | Per-komponent (button-color-background, itp.) |

Tokeny globalne (niezależne od motywu) trafiają do `core/tier-1-definitions/`.

## Jak działa build tokenów

`config.js` używa Style Dictionary 4:
- Custom transform `size/px-to-rem` → konwertuje `px` na `rem` (base 16)
- Custom transform `name/theme-prefix` → generuje nazwy JS (`DsColorBlue500`)
- Tier wykrywany przez `filePath` — jeśli ścieżka zawiera `tier-2-usage` lub `tier-3-components` → prefix `--ds-theme-`
- Output do `light/build/css/tokens.css` (`:root {}`), `light/build/css/light.css` (`.light {}`), `light/build/json/tokens.json`, `light/build/js/tokens.js`

## Sidebar Storybook

Trzy sekcje w ustalonej kolejności (wymuszane przez `storySort` w `preview.ts`):

```
FOUNDATIONS
  └── Design Tokens
       ├── Tier 1: Primitive Tokens   (placeholder)
       ├── Tier 2: Semantic Tokens    (placeholder)
       └── Tier 3: Component Tokens   (placeholder)
COMPONENTS
  └── Introduction                   (placeholder — usunąć gdy pojawi się pierwszy komponent)
PAGES
  └── Introduction                   (placeholder — usunąć gdy pojawią się pierwsze strony)
```

## Co zostało do zrobienia (kolejność)

1. **Dodać tokeny tier-1** — pliki JSON do `packages/harbor-tokens/light/tier-1-definitions/`
2. **Uruchomić `npm run build:tokens`** i sprawdzić output w `light/build/`
3. **Odblokować import CSS** w `.storybook/preview.ts` (`import './themes.scss'`) i `themes.scss`
4. **Zastąpić placeholder stories** prawdziwą wizualizacją tokenów
5. **Dodać tokeny tier-2 i tier-3**
6. **Dodać pierwsze komponenty React** do `src/components/`; usunąć `components-placeholder` story
7. **Deploy na GitHub Pages** (kiedy będzie co pokazać)

## Decyzje podjęte wcześniej

- React (nie Lit/Web Components jak w kursie Subatomic)
- Monorepo npm workspaces (nie Lerna, nie Turbo)
- Jeden motyw `light` na start; `dark` jako sibling folder gdy będzie potrzebny
- Brak przykładowego przycisku — komponenty dodawane gdy tokeny będą gotowe
- GitHub Pages deploy — później, po pierwszych tokenach

## Ostatni commit

```
616b071 feat: add storySort to enforce Foundations > Components > Pages order
```
