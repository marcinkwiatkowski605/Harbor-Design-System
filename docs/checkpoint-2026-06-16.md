# Checkpoint — 2026-06-16

## Co zrobiliśmy

Zbudowaliśmy kompletny scaffold monorepo dla Harbor Design System. Storybook startuje, tokeny z Figmy są zbuildowane i załadowane do Storybooka.

## Obecna struktura projektu

```
Harbor Design System/
├── package.json              ← npm workspaces root
├── package-lock.json
├── CLAUDE.md                 ← instrukcje dla Claude Code
├── README.md
├── design_tokens.json        ← W3C DTCG export z Figmy (385 tokenów, 4 kolekcje)
├── docs/
│   ├── writing-guides/       ← 5 plików referencyjnych (Google Tech Writing)
│   └── checkpoint-2026-06-16.md  ← ten plik
├── reference/                ← materiały źródłowe (kurs Subatomic)
└── packages/
    ├── harbor-tokens/
    │   ├── package.json      ← @harbor/tokens, devDeps: style-dictionary, minimist
    │   ├── config.js         ← Style Dictionary 4 config (transforms, formatters, DTCG)
    │   ├── index.ts          ← placeholder
    │   ├── core/
    │   │   └── tier-1-definitions/   ← puste
    │   └── light/
    │       ├── tier-1-definitions/   ← puste (tokeny czytane z design_tokens.json)
    │       ├── tier-2-usage/         ← puste (j.w.)
    │       ├── tier-3-components/    ← puste (j.w.)
    │       ├── scss/                 ← puste
    │       └── build/                ← gitignored, generowany przez build:tokens
    │           ├── css/tokens.css    ← :root {} z 377 tokenami primitives
    │           ├── css/light.css     ← .light {} z tokenami semantic + component
    │           ├── json/tokens.json  ← flat JSON 377 kluczy
    │           └── js/tokens.js      ← ES6 exports
    └── harbor-storybook/
        ├── package.json      ← @harbor/storybook, React 18 + Storybook 8
        ├── tsconfig.json
        ├── vite.config.ts
        ├── .storybook/
        │   ├── main.ts       ← konfiguracja Storybook, globs na stories
        │   ├── preview.ts    ← import './themes.scss' (aktywny)
        │   ├── themes.scss   ← importuje tokens.css + light.css (aktywny)
        │   └── components/
        │       ├── tier-1-tokens/tier-1-tokens.stories.tsx          ← placeholder
        │       ├── tier-2-tokens/tier-2-tokens.stories.tsx          ← placeholder
        │       ├── tier-3-tokens/tier-3-tokens.stories.tsx          ← placeholder
        │       ├── components-placeholder/components-placeholder.stories.tsx
        │       └── pages-placeholder/pages-placeholder.stories.tsx
        └── src/
            └── components/   ← puste
```

## Jak uruchomić

```bash
npm install          # (już zrobione — node_modules istnieje)
npm run build:tokens # Buduje tokeny: design_tokens.json → light/build/{css,json,js}
npm start            # Storybook na http://localhost:6006
```

## Architektura tokenów (jak działa build)

Źródło: `design_tokens.json` — export W3C DTCG z Figmy (4 kolekcje):
- `primitive-brand-a` — kolory marki, border-radius, typography, shadow
- `primitive-global` — kolory neutralne, spacing
- `semantic-modes` — tokeny semantyczne (color-background-default, itp.)
- `component-modes` — tokeny per-komponent (button-*, text-input-*)

`config.js` (Style Dictionary 4):
1. `buildTokens()` — czyta DTCG JSON, stripuje klucze kolekcji (deep merge!), taguje tier w `$extensions['harbor-tier']`
2. `usesDtcgTokens: true` — SD4 DTCG mode (wartości w `token.$value`, typy w `token.$type`)
3. Custom transform `size/px-to-rem` — Figma exports wymiary jako liczby (np. `4`), konwertuje na `0.25rem`
4. Custom formatters — oddzielają primitives (`--ds-`) od semantic/component (`--ds-theme-`)

Output do `light/build/`:
- `css/tokens.css` — `:root {}` z 377 zmiennymi (wszystkie tiers, resolved values)
- `css/light.css` — `.light {}` z tokenami semantic + component (do theme-switchingu)
- `json/tokens.json` — flat JSON
- `js/tokens.js` + `js/tokens.d.ts` — ES6 exports z prefixem `Ds` / `DsTheme`

## CSS prefix convention

| Kolekcja Figma | CSS prefix | Przykład |
|---|---|---|
| primitive-brand-a, primitive-global | `--ds-` | `--ds-color-neutral-white` |
| semantic-modes, component-modes | `--ds-theme-` | `--ds-theme-color-background-default` |

## Sidebar Storybook

Trzy sekcje w ustalonej kolejności (`storySort` w `preview.ts`):

```
FOUNDATIONS
  └── Design Tokens
       ├── Tier 1: Primitive Tokens   (placeholder)
       ├── Tier 2: Semantic Tokens    (placeholder)
       └── Tier 3: Component Tokens   (placeholder)
COMPONENTS
  └── Introduction                   (placeholder)
PAGES
  └── Introduction                   (placeholder)
```

## Znane warningi (nie-blokujące)

- `shadow-spread-4` collision: tokeny `shadow.spread.4` i `shadow.spread.-4` generują tę samą nazwę CSS. Figma exportuje obie jako dimension. Można naprawić w Figmie lub custom namerem.
- Storybook 8.6.18 vs addon-essentials 8.6.14: drobna niezgodność wersji, nie wpływa na działanie.

## Co zostało do zrobienia (kolejność)

1. **Wizualizacja tokenów w Storybook** — zastąpić placeholdery w story (tier-1, tier-2, tier-3) prawdziwymi siatkami kolorów, typografii, spacing itp. CSS zmienne są już załadowane.
2. **Dodać pierwsze komponenty React** do `src/components/`; usunąć `components-placeholder` story
3. **Deploy na GitHub Pages** (kiedy będzie co pokazać)

## Decyzje podjęte wcześniej

- React (nie Lit/Web Components jak w kursie Subatomic)
- Monorepo npm workspaces (nie Lerna, nie Turbo)
- Jeden motyw `light` na start; `dark` jako sibling folder gdy będzie potrzebny
- Tokeny importowane z Figmy przez design_tokens.json (nie ręcznie pisane JSON)
- GitHub Pages deploy — później, po pierwszych komponentach

## Ostatnie commity

```
(do dodania po commitcie z dzisiejszą sesją)
```
