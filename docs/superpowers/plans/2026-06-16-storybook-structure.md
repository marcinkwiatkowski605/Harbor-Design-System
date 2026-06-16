# Storybook Project Structure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Harbor Design System monorepo with a `harbor-tokens` (Style Dictionary) package and a `harbor-storybook` (React + Storybook) package — folder structure and config files only, no token JSON or React component content yet.

**Architecture:** npm workspaces monorepo with two packages. `harbor-tokens` uses Style Dictionary to build design tokens from JSON source files into CSS/SCSS/JSON outputs. `harbor-storybook` is a React Storybook that will import the built token CSS and host token visualization stories and component stories. Adapted from the Subatomic Design Tokens course reference (`reference/subatomic-design-tokens-course-main`).

**Tech Stack:** Node.js 18+, npm workspaces, Style Dictionary 4, Storybook 8 (`@storybook/react-vite`), React 18, TypeScript, Sass, Vite.

---

### Task 1: Root monorepo setup

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "harbor-design-system",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "start": "cd ./packages/harbor-storybook && npm run storybook",
    "build:tokens": "cd ./packages/harbor-tokens && npm run build:tokens",
    "build:storybook": "cd ./packages/harbor-storybook && npm run build-storybook"
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
dist/
packages/harbor-tokens/light/build/
packages/harbor-tokens/dark/build/
.DS_Store
```

- [ ] **Step 3: Commit**

```bash
git add package.json .gitignore
git commit -m "chore: add monorepo root config"
```

---

### Task 2: harbor-tokens package

**Files:**
- Create: `packages/harbor-tokens/package.json`
- Create: `packages/harbor-tokens/config.js`
- Create: `packages/harbor-tokens/index.ts`
- Create: `packages/harbor-tokens/core/tier-1-definitions/.gitkeep`
- Create: `packages/harbor-tokens/light/scss/.gitkeep`
- Create: `packages/harbor-tokens/light/tier-1-definitions/.gitkeep`
- Create: `packages/harbor-tokens/light/tier-2-usage/.gitkeep`
- Create: `packages/harbor-tokens/light/tier-3-components/.gitkeep`

Note: `light/build/` is gitignored — no `.gitkeep` needed.

- [ ] **Step 1: Create `packages/harbor-tokens/package.json`**

```json
{
  "name": "@harbor/tokens",
  "version": "0.1.0",
  "description": "Harbor Design System tokens package",
  "type": "module",
  "scripts": {
    "build:tokens": "node config.js"
  },
  "devDependencies": {
    "minimist": "^1.2.8",
    "style-dictionary": "^4.3.3"
  }
}
```

- [ ] **Step 2: Create `packages/harbor-tokens/config.js`**

Adapted from reference — single theme (`light`), same custom transforms and formatters:

```js
import StyleDictionary from 'style-dictionary';
import minimist from 'minimist';

const AVAILABLE_THEMES = ['light'];

const args = minimist(process.argv.slice(2));
const theme = args.theme;

const isHigherTierToken = (filePath) => {
  return filePath.includes('tier-2-usage') || filePath.includes('tier-3-components');
};

const transformShadowTokens = (dictionary, size, themeTokens) => {
  const shadowProps = dictionary.allTokens.filter(
    (p) => isHigherTierToken(p.filePath) && p.path[0] === 'box-shadow' && p.path[1] === size
  );
  const x = shadowProps.find((p) => p.path[2] === 'x')?.value || '0px';
  const y = shadowProps.find((p) => p.path[2] === 'y')?.value || '0px';
  const blur = shadowProps.find((p) => p.path[2] === 'blur')?.value || '0px';
  const spread = shadowProps.find((p) => p.path[2] === 'spread')?.value || '0px';
  const color = shadowProps.find((p) => p.path[2] === 'color')?.value || 'transparent';
  themeTokens.push(`  --ds-theme-box-shadow-${size}: ${x} ${y} ${blur} ${spread} ${color};`);
};

const transformLineHeight = (dictionary, prop, themeTokens) => {
  const cleanPath = prop.path
    .map((segment) => (segment.startsWith('@') ? segment.substring(1) : segment))
    .filter((segment) => segment !== '')
    .join('-');
  const fontSizePath = [...prop.path.slice(0, -1), 'font-size'];
  const fontSizeProp = dictionary.allTokens.find((p) => p.path.join('.') === fontSizePath.join('.'));
  if (fontSizeProp) {
    const lineHeightPx = parseFloat(prop.value.replace('rem', '')) * 16;
    const fontSizePx = parseFloat(fontSizeProp.value.replace('rem', '')) * 16;
    const unitlessValue = (lineHeightPx / fontSizePx).toFixed(2);
    themeTokens.push(`  --ds-theme-${cleanPath}: ${unitlessValue};`);
  } else {
    themeTokens.push(`  --ds-theme-${cleanPath}: ${prop.value};`);
  }
};

const formatVariables = (dictionary) => {
  const processedShadows = new Set();
  const tier1Tokens = [];
  const themeTokens = [];

  const formatTokenName = (cleanPath, prop) => {
    if (isHigherTierToken(prop.filePath)) return `--ds-theme-${cleanPath}`;
    return `--ds-${cleanPath}`;
  };

  const shadowTokens = dictionary.allTokens.filter(
    (p) => isHigherTierToken(p.filePath) && p.path[0] === 'box-shadow'
  );
  const shadowSizes = [...new Set(shadowTokens.map((p) => p.path[1]).filter(Boolean))];

  dictionary.allTokens.forEach((prop) => {
    if (prop.path[0] === 'z-index') {
      const cleanPath = prop.path
        .map((segment) => (segment.startsWith('@') ? segment.substring(1) : segment))
        .filter((segment) => segment !== '')
        .join('-');
      tier1Tokens.push(`  ${formatTokenName(cleanPath, prop)}: ${prop.value};`);
      return;
    }
    if (isHigherTierToken(prop.filePath) && prop.path[0] === 'box-shadow' && shadowSizes.includes(prop.path[1])) {
      const size = prop.path[1];
      if (processedShadows.has(size)) return;
      processedShadows.add(size);
      transformShadowTokens(dictionary, size, themeTokens);
    } else if (isHigherTierToken(prop.filePath) && prop.path[0] === 'typography' && prop.path.includes('line-height')) {
      transformLineHeight(dictionary, prop, themeTokens);
    } else if (!prop.path.includes('box-shadow') || prop.path.length > 3) {
      const cleanPath = prop.path
        .map((segment) => (segment.startsWith('@') ? segment.substring(1) : segment))
        .filter((segment) => segment !== '')
        .join('-');
      const token = `  ${formatTokenName(cleanPath, prop)}: ${prop.value};`;
      if (isHigherTierToken(prop.filePath)) {
        themeTokens.push(token);
      } else {
        tier1Tokens.push(token);
      }
    }
  });

  return [...new Set([...tier1Tokens, ...themeTokens])].join('\n');
};

const getStyleDictionaryConfig = (theme) => {
  StyleDictionary.registerFormat({
    name: 'json/flat/custom',
    format: function (dictionary) {
      const transformedTokens = {};
      const shadowTokens = dictionary.allTokens.filter(
        (p) => isHigherTierToken(p.filePath) && p.path[0] === 'box-shadow'
      );
      const shadowSizes = [...new Set(shadowTokens.map((p) => p.path[1]).filter(Boolean))];

      dictionary.allTokens.forEach((token) => {
        if (token.path[0] === 'box-shadow' && token.path.length > 2) return;
        const prefix = isHigherTierToken(token.filePath) ? 'ds-theme-' : 'ds-';
        transformedTokens[`${prefix}${token.path.join('-')}`] = token.value;
      });

      shadowSizes.forEach((size) => {
        const props = dictionary.allTokens.filter(
          (p) => isHigherTierToken(p.filePath) && p.path[0] === 'box-shadow' && p.path[1] === size
        );
        const x = props.find((p) => p.path[2] === 'x')?.value || '0px';
        const y = props.find((p) => p.path[2] === 'y')?.value || '0px';
        const blur = props.find((p) => p.path[2] === 'blur')?.value || '0px';
        const spread = props.find((p) => p.path[2] === 'spread')?.value || '0px';
        const color = props.find((p) => p.path[2] === 'color')?.value || 'transparent';
        transformedTokens[`ds-theme-box-shadow-${size}`] = `${x} ${y} ${blur} ${spread} ${color}`;
      });

      return JSON.stringify(transformedTokens, null, 2);
    }
  });

  StyleDictionary.registerFormat({
    name: 'css/variables-themed',
    format: function (dictionary) {
      return `.${theme} {\n${formatVariables(dictionary)}\n}\n`;
    }
  });

  StyleDictionary.registerFormat({
    name: 'css/custom-variables',
    format: function (dictionary) {
      return `:root {\n${formatVariables(dictionary)}\n}`;
    }
  });

  StyleDictionary.registerTransform({
    name: 'size/px-to-rem',
    type: 'value',
    matcher: (prop) => prop?.value && typeof prop.value === 'string' && prop.value.endsWith('px'),
    transform: (prop) => {
      const pixels = parseFloat(prop.value);
      if (isNaN(pixels)) return prop.value;
      return `${Number((pixels / 16).toFixed(4))}rem`;
    }
  });

  StyleDictionary.registerTransform({
    name: 'name/theme-prefix',
    type: 'name',
    transform: (token) => {
      const cleanPath = token.path
        .map((segment) => (segment.startsWith('@') ? segment.substring(1) : segment))
        .filter((segment) => segment !== '')
        .join('-');
      const prefix = isHigherTierToken(token.filePath) ? 'DsTheme' : 'Ds';
      return `${prefix}${cleanPath.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
    }
  });

  StyleDictionary.registerTransformGroup({
    name: 'custom/css',
    transforms: ['attribute/cti', 'name/kebab', 'size/px-to-rem']
  });

  StyleDictionary.registerTransformGroup({
    name: 'custom/js',
    transforms: ['attribute/cti', 'name/theme-prefix', 'size/px-to-rem']
  });

  return {
    source: [`./core/**/*.json`, `./${theme}/**/*.json`],
    log: { verbosity: 'verbose' },
    platforms: {
      ts: {
        transformGroup: 'custom/js',
        buildPath: './',
        files: [
          { destination: `./${theme}/build/js/tokens.js`, format: 'javascript/es6' },
          { destination: `./${theme}/build/js/tokens.d.ts`, format: 'typescript/es6-declarations' }
        ]
      },
      css: {
        transformGroup: 'custom/css',
        buildPath: './',
        files: [
          { destination: `./${theme}/build/css/tokens.css`, format: 'css/custom-variables' },
          { destination: `./${theme}/build/css/${theme}.css`, format: 'css/variables-themed' }
        ]
      },
      json: {
        transformGroup: 'custom/css',
        buildPath: './',
        files: [
          { destination: `./${theme}/build/json/tokens.json`, format: 'json/flat/custom' }
        ]
      }
    }
  };
};

if (!theme) {
  AVAILABLE_THEMES.forEach((themeName) => {
    console.log(`\nBuilding ${themeName} theme`);
    const sd = new StyleDictionary(getStyleDictionaryConfig(themeName));
    sd.buildAllPlatforms();
  });
} else {
  const sd = new StyleDictionary(getStyleDictionaryConfig(theme));
  sd.buildAllPlatforms();
}
```

- [ ] **Step 3: Create `packages/harbor-tokens/index.ts`**

```ts
// Token JS/TS exports — populated after running npm run build:tokens
export {};
```

- [ ] **Step 4: Create empty folder placeholders**

```bash
mkdir -p packages/harbor-tokens/core/tier-1-definitions
mkdir -p packages/harbor-tokens/light/scss
mkdir -p packages/harbor-tokens/light/tier-1-definitions
mkdir -p packages/harbor-tokens/light/tier-2-usage
mkdir -p packages/harbor-tokens/light/tier-3-components

touch packages/harbor-tokens/core/tier-1-definitions/.gitkeep
touch packages/harbor-tokens/light/scss/.gitkeep
touch packages/harbor-tokens/light/tier-1-definitions/.gitkeep
touch packages/harbor-tokens/light/tier-2-usage/.gitkeep
touch packages/harbor-tokens/light/tier-3-components/.gitkeep
```

- [ ] **Step 5: Commit**

```bash
git add packages/harbor-tokens/
git commit -m "chore: scaffold harbor-tokens package"
```

---

### Task 3: harbor-storybook package — config files

**Files:**
- Create: `packages/harbor-storybook/package.json`
- Create: `packages/harbor-storybook/tsconfig.json`
- Create: `packages/harbor-storybook/vite.config.ts`
- Create: `packages/harbor-storybook/.storybook/main.ts`
- Create: `packages/harbor-storybook/.storybook/preview.ts`
- Create: `packages/harbor-storybook/.storybook/themes.scss`
- Create: `packages/harbor-storybook/src/components/.gitkeep`

- [ ] **Step 1: Create `packages/harbor-storybook/package.json`**

```json
{
  "name": "@harbor/storybook",
  "version": "0.1.0",
  "description": "Harbor Design System Storybook",
  "type": "module",
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@storybook/addon-a11y": "^8.4.5",
    "@storybook/addon-essentials": "^8.4.5",
    "@storybook/blocks": "^8.4.5",
    "@storybook/react": "^8.4.5",
    "@storybook/react-vite": "^8.4.5",
    "@storybook/test": "^8.4.5",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.4",
    "sass": "^1.83.4",
    "storybook": "^8.4.5",
    "typescript": "~5.6.2",
    "vite": "^6.0.1"
  }
}
```

- [ ] **Step 2: Create `packages/harbor-storybook/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src", ".storybook"]
}
```

- [ ] **Step 3: Create `packages/harbor-storybook/vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});
```

- [ ] **Step 4: Create `packages/harbor-storybook/.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    './components/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
};

export default config;
```

- [ ] **Step 5: Create `packages/harbor-storybook/.storybook/preview.ts`**

```ts
import type { Preview } from '@storybook/react';

// Uncomment after running npm run build:tokens from the root:
// import './themes.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
```

- [ ] **Step 6: Create `packages/harbor-storybook/.storybook/themes.scss`**

```scss
// Import built token CSS — uncomment after running npm run build:tokens from the root
// @import '../../../harbor-tokens/light/build/css/tokens.css';
// @import '../../../harbor-tokens/light/build/css/light.css';
```

- [ ] **Step 7: Create `packages/harbor-storybook/src/components/.gitkeep`**

```bash
mkdir -p packages/harbor-storybook/src/components
touch packages/harbor-storybook/src/components/.gitkeep
```

- [ ] **Step 8: Commit**

```bash
git add packages/harbor-storybook/
git commit -m "chore: scaffold harbor-storybook package"
```

---

### Task 4: Token visualization story placeholders

**Files:**
- Create: `packages/harbor-storybook/.storybook/components/tier-1-tokens/tier-1-tokens.stories.tsx`
- Create: `packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx`
- Create: `packages/harbor-storybook/.storybook/components/tier-3-tokens/tier-3-tokens.stories.tsx`

- [ ] **Step 1: Create `packages/harbor-storybook/.storybook/components/tier-1-tokens/tier-1-tokens.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design Tokens/Tier 1: Primitive Tokens'
};

export default meta;

export const Placeholder: StoryObj = {
  render: () => (
    <p style={{ fontFamily: 'sans-serif', color: '#666' }}>
      Tier 1 token visualization will be added when tokens are defined.
    </p>
  )
};
```

- [ ] **Step 2: Create `packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design Tokens/Tier 2: Semantic Tokens'
};

export default meta;

export const Placeholder: StoryObj = {
  render: () => (
    <p style={{ fontFamily: 'sans-serif', color: '#666' }}>
      Tier 2 token visualization will be added when tokens are defined.
    </p>
  )
};
```

- [ ] **Step 3: Create `packages/harbor-storybook/.storybook/components/tier-3-tokens/tier-3-tokens.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design Tokens/Tier 3: Component Tokens'
};

export default meta;

export const Placeholder: StoryObj = {
  render: () => (
    <p style={{ fontFamily: 'sans-serif', color: '#666' }}>
      Tier 3 token visualization will be added when tokens are defined.
    </p>
  )
};
```

- [ ] **Step 4: Commit**

```bash
git add packages/harbor-storybook/.storybook/components/
git commit -m "chore: add token story placeholders"
```

---

### Task 5: Install dependencies and verify Storybook starts

- [ ] **Step 1: Install all packages from the root**

```bash
npm install
```

Expected: `node_modules/` created in root and both packages. No errors.

- [ ] **Step 2: Verify Storybook starts**

```bash
npm start
```

Expected: Storybook opens at `http://localhost:6006` showing three stories under "Design Tokens": Tier 1, Tier 2, Tier 3 — each showing a placeholder paragraph.

- [ ] **Step 3: Verify token build script is wired up**

```bash
npm run build:tokens
```

Expected output:
```
Building light theme
```
Then Style Dictionary errors about no source files found — this is expected since no token JSON files exist yet. The important thing is the script runs without Node.js import errors.

- [ ] **Step 4: Commit final state**

```bash
git add package-lock.json
git commit -m "chore: install dependencies"
```
