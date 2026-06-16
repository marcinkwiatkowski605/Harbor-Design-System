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
        │   ├── preview.ts    ← importuje bezpośrednio tokens.css + light.css (aktywne)
        │   ├── themes.scss   ← tylko na przyszłe SCSS helpery (token CSS idzie przez preview.ts)
        │   └── components/
        │       ├── tier-1-tokens/tier-1-tokens.stories.tsx          ← Colors, Typography, Spacing, Borders, Shadows
        │       ├── tier-2-tokens/tier-2-tokens.stories.tsx          ← Color, Typography, Border & Shadow
        │       ├── tier-3-tokens/tier-3-tokens.stories.tsx          ← Button, Text Input
        │       └── pages-placeholder/pages-placeholder.stories.tsx
        └── src/
            └── components/
                └── Button/   ← pierwszy komponent React (Button.tsx, .css, .stories.tsx, index.ts)
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
4. Custom formatters — prefix CSS/JSON/JS wyliczany z tieru tokenu (patrz niżej)

Output do `light/build/`:
- `css/tokens.css` — `:root {}` z 377 zmiennymi (wszystkie tiers, resolved values)
- `css/light.css` — `.light {}` z tymi samymi zmiennymi (NIE ma i nie będzie theme-switchingu — plik to relikt, do ewentualnego usunięcia)
- `json/tokens.json` — flat JSON
- `js/tokens.js` + `js/tokens.d.ts` — ES6 exports z prefixem `DsPrimitive` / `DsSemantic` / `DsComponent`

## CSS prefix convention (trzy tiery)

Nie ma i nie będzie theme-switchingu — prefix jednoznacznie oznacza tier (kolekcję Figma):

| Kolekcja Figma | tier | CSS prefix | Przykład |
|---|---|---|---|
| primitive-brand-a, primitive-global | primitive | `--ds-primitive-` | `--ds-primitive-color-neutral-white` |
| semantic-modes | semantic | `--ds-semantic-` | `--ds-semantic-color-background-default` |
| component-modes | component | `--ds-component-` | `--ds-component-button-primary-color-background-enabled` |

Mapowanie kolekcja→tier jest w `config.js` (`TIER_BY_COLLECTION`); prefix wyliczany przez `cssPrefixOf` / `jsonPrefixOf` / transform `name/tier-prefix`.

## Sidebar Storybook

Trzy sekcje w ustalonej kolejności (`storySort` w `preview.ts`):

```
FOUNDATIONS
  └── Design Tokens
       ├── Tier 1: Primitive Tokens   (Colors, Typography, Spacing, Borders, Shadows)
       ├── Tier 2: Semantic Tokens    (Color, Typography, Border & Shadow)
       └── Tier 3: Component Tokens   (Button, Text Input)
COMPONENTS
  └── Button                         (Primary, Secondary, Outline, Loading, Disabled, AllVariants, StateMatrix)
PAGES
  └── Introduction                   (placeholder)
```

## Stan wizualizacji tokenów

Wszystkie 377 tokenów z buildu jest pokazane w którejś story (zweryfikowane skryptem cross-check ze źródłem — 0 wymyślonych, 0 niepokazanych). Każda story czyta wartości z CSS variables, więc po `npm run build:tokens` zmiany z Figmy są od razu widoczne.

**Zasada krytyczna:** nazwy tokenów NIGDY nie są pisane z głowy. Tablice w story odpowiadają dokładnie nazwom z `design_tokens.json` / `build/json/tokens.json`. Przy każdej zmianie tokenów trzeba zsynchronizować tablice (lub uruchomić cross-check) — patrz pamięć `feedback_token_source_of_truth`.

## Komponenty React

Pierwszy komponent: **Button** (`src/components/Button/`), skonwertowany z Figmy (component set `129:979`).

- `Button.tsx` — propsy: `variant` (primary/secondary/outline), `loading`, `disabled`, `forwardRef`, pełne atrybuty `<button>`
- `Button.css` — w pełni sterowany tokenami; stany przez `:hover`/`:active`/`:focus-visible`/`:disabled`/`[aria-busy]`; pierścień focus z `--ds-theme-focus-*`
- Typografia etykiety: **`label/lg`** (`--ds-theme-typography-label-lg-*`) — NIE body/lg, mimo że Figma wiąże body/lg. To intencja designu (patrz pamięć `project_button_typography`). `label/lg/font-weight` jest już bold.
- Weryfikacja: 55 zmiennych CSS, 0 wymyślonych tokenów, `tsc` czysty
- 7 stories pod `Components/Button`

**Wzorzec konwersji z Figmy** (do powtórzenia dla kolejnych komponentów):
1. `figma_analyze_component_set` — osie wariantów + mapowanie stanów na pseudo-klasy
2. `figma_get_component_for_development_deep` na jednym wariancie — rozwiązuje powiązania zmiennych na NAZWY tokenów (nie zgadujemy)
3. komponent w `src/components/<Name>/`, CSS oparty wyłącznie o `--ds-theme-*`
4. cross-check zmiennych CSS z `build/json/tokens.json` (0 wymyślonych)

## Znane warningi (nie-blokujące)

- `shadow-spread-4` collision: tokeny `shadow.spread.4` i `shadow.spread.-4` generują tę samą nazwę CSS. Figma exportuje obie jako dimension. Można naprawić w Figmie lub custom namerem.
- Storybook 8.6.18 vs addon-essentials 8.6.14: drobna niezgodność wersji, nie wpływa na działanie.

## Co zostało do zrobienia (kolejność)

1. **Kolejne komponenty React** — np. Text Input (tokeny już są), wg wzorca konwersji z Figmy powyżej
2. **Deploy na GitHub Pages** (kiedy będzie co pokazać)

(Wizualizacja tokenów tier-1/2/3 — ✅ | Pierwszy komponent Button — ✅)

## Decyzje podjęte wcześniej

- React (nie Lit/Web Components jak w kursie Subatomic)
- Monorepo npm workspaces (nie Lerna, nie Turbo)
- Jeden motyw `light` na start; `dark` jako sibling folder gdy będzie potrzebny
- Tokeny importowane z Figmy przez design_tokens.json (nie ręcznie pisane JSON)
- GitHub Pages deploy — później, po pierwszych komponentach

## Ostatnie commity

```
94abc23 fix: use label/lg typography for Button label
ccfa553 feat: add Button component (from Figma) with stories
c23c6aa docs: update checkpoint — token visualizations complete
570180b style: center Focus Ring swatch under its labels
c7dffb0 style: center Tier 2 border radius/width swatches under their labels
a9aab9f fix: correct accent-presed→pressed typo; add full token coverage to stories
c545f31 fix: sync Tier 2 color contexts with actual design_tokens.json
d36bf49 fix: import token CSS directly in preview.ts instead of via SCSS
82eb3a1 feat: replace token placeholder stories with real visualizations
6270552 feat: wire design_tokens.json to Style Dictionary 4 (DTCG)
dccdfcd feat: export Figma design tokens in W3C DTCG format
```
