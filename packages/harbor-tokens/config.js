import StyleDictionary from 'style-dictionary';
import minimist from 'minimist';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AVAILABLE_THEMES = ['light'];

const args = minimist(process.argv.slice(2));
const theme = args.theme;

// Tier comes from the Figma collection each token belongs to. CSS prefixes:
//   primitive → --ds-primitive-   semantic → --ds-semantic-   component → --ds-component-
const tierOf = (token) =>
  token.original?.$extensions?.['harbor-tier'] ?? 'primitive';
const isHigherTierToken = (token) => tierOf(token) !== 'primitive';
const cssPrefixOf = (token) => `--ds-${tierOf(token)}-`;
const jsonPrefixOf = (token) => `ds-${tierOf(token)}-`;

// Reads design_tokens.json (W3C DTCG, exported from Figma), strips collection-level wrapper
// keys so aliases like {color.background.default} resolve correctly, and tags each token
// with $extensions['harbor-tier'] to preserve tier information without relying on filePath.
const buildTokens = () => {
  const raw = JSON.parse(
    readFileSync(join(__dirname, '../../design_tokens.json'), 'utf-8')
  );
  const TIER_BY_COLLECTION = {
    'primitive-brand-a': 'primitive',
    'primitive-global': 'primitive',
    'semantic-modes': 'semantic',
    'component-modes': 'component',
  };

  const isLeaf = (val) =>
    val !== null && typeof val === 'object' && '$value' in val;

  const tagTokens = (obj, tier) => {
    const out = {};
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith('$')) {
        out[key] = val;
      } else if (isLeaf(val)) {
        out[key] = {
          $type: val.$type,
          $value: val.$value,
          $extensions: { 'harbor-tier': tier },
        };
      } else if (val !== null && typeof val === 'object') {
        out[key] = tagTokens(val, tier);
      } else {
        out[key] = val;
      }
    }
    return out;
  };

  // Deep merge so collections sharing path prefixes (e.g. color.*, border.*) don't overwrite each other.
  const deepMerge = (target, source) => {
    for (const [key, val] of Object.entries(source)) {
      if (!isLeaf(val) && val !== null && typeof val === 'object' &&
          !isLeaf(target[key]) && target[key] !== null && typeof target[key] === 'object') {
        deepMerge(target[key], val);
      } else {
        target[key] = val;
      }
    }
    return target;
  };

  const result = {};
  for (const [collectionName, collection] of Object.entries(raw)) {
    if (collectionName === '$extensions') continue;
    if (typeof collection !== 'object' || collection === null) continue;
    const { $extensions: _skip, ...tokens } = collection;
    const tier = TIER_BY_COLLECTION[collectionName] ?? 'primitive';
    deepMerge(result, tagTokens(tokens, tier));
  }
  return result;
};

const transformShadowTokens = (dictionary, size, themeTokens) => {
  const props = dictionary.allTokens.filter(
    (p) => isHigherTierToken(p) && p.path[0] === 'shadow' && p.path[1] === size
  );
  const x = props.find((p) => p.path[2] === 'x')?.$value ?? '0';
  const y = props.find((p) => p.path[2] === 'y')?.$value ?? '0';
  const blur = props.find((p) => p.path[2] === 'blur')?.$value ?? '0';
  const spread = props.find((p) => p.path[2] === 'spread')?.$value ?? '0';
  const color = props.find((p) => p.path[2] === 'color')?.$value ?? 'transparent';
  const prefix = props.length ? cssPrefixOf(props[0]) : '--ds-semantic-';
  themeTokens.push(`  ${prefix}shadow-${size}: ${x} ${y} ${blur} ${spread} ${color};`);
};

const transformLineHeight = (dictionary, prop, themeTokens) => {
  const cleanPath = prop.path.join('-');
  const prefix = cssPrefixOf(prop);
  const fontSizePath = [...prop.path.slice(0, -1), 'font-size'];
  const fontSizeProp = dictionary.allTokens.find(
    (p) => p.path.join('.') === fontSizePath.join('.')
  );
  if (fontSizeProp) {
    const lhPx = parseFloat(String(prop.$value).replace('rem', '')) * 16;
    const fsPx = parseFloat(String(fontSizeProp.$value).replace('rem', '')) * 16;
    themeTokens.push(`  ${prefix}${cleanPath}: ${(lhPx / fsPx).toFixed(2)};`);
  } else {
    themeTokens.push(`  ${prefix}${cleanPath}: ${prop.$value};`);
  }
};

const formatVariables = (dictionary) => {
  const processedShadows = new Set();
  const primitiveTokens = [];
  const themeTokens = [];

  const shadowSizes = [
    ...new Set(
      dictionary.allTokens
        .filter((p) => isHigherTierToken(p) && p.path[0] === 'shadow')
        .map((p) => p.path[1])
        .filter(Boolean)
    ),
  ];

  dictionary.allTokens.forEach((prop) => {
    const isHigher = isHigherTierToken(prop);
    const cleanPath = prop.path.join('-');
    const prefix = cssPrefixOf(prop);

    if (isHigher && prop.path[0] === 'shadow' && shadowSizes.includes(prop.path[1])) {
      const size = prop.path[1];
      if (processedShadows.has(size)) return;
      processedShadows.add(size);
      transformShadowTokens(dictionary, size, themeTokens);
    } else if (isHigher && prop.path[0] === 'typography' && prop.path.includes('line-height')) {
      transformLineHeight(dictionary, prop, themeTokens);
    } else {
      const line = `  ${prefix}${cleanPath}: ${prop.$value};`;
      (isHigher ? themeTokens : primitiveTokens).push(line);
    }
  });

  return [...new Set([...primitiveTokens, ...themeTokens])].join('\n');
};

StyleDictionary.registerFormat({
  name: 'json/flat/custom',
  format: ({ dictionary }) => {
    const processedShadows = new Set();
    const out = {};

    const shadowSizes = [
      ...new Set(
        dictionary.allTokens
          .filter((p) => isHigherTierToken(p) && p.path[0] === 'shadow')
          .map((p) => p.path[1])
          .filter(Boolean)
      ),
    ];

    dictionary.allTokens.forEach((token) => {
      if (isHigherTierToken(token) && token.path[0] === 'shadow' && token.path.length === 3) return;
      out[`${jsonPrefixOf(token)}${token.path.join('-')}`] = token.$value;
    });

    shadowSizes.forEach((size) => {
      if (processedShadows.has(size)) return;
      processedShadows.add(size);
      const props = dictionary.allTokens.filter(
        (p) => isHigherTierToken(p) && p.path[0] === 'shadow' && p.path[1] === size
      );
      const x = props.find((p) => p.path[2] === 'x')?.$value ?? '0';
      const y = props.find((p) => p.path[2] === 'y')?.$value ?? '0';
      const blur = props.find((p) => p.path[2] === 'blur')?.$value ?? '0';
      const spread = props.find((p) => p.path[2] === 'spread')?.$value ?? '0';
      const color = props.find((p) => p.path[2] === 'color')?.$value ?? 'transparent';
      const prefix = props.length ? jsonPrefixOf(props[0]) : 'ds-semantic-';
      out[`${prefix}shadow-${size}`] = `${x} ${y} ${blur} ${spread} ${color}`;
    });

    return JSON.stringify(out, null, 2);
  },
});

StyleDictionary.registerFormat({
  name: 'css/custom-variables',
  format: ({ dictionary }) => `:root {\n${formatVariables(dictionary)}\n}`,
});

StyleDictionary.registerTransform({
  name: 'size/px-to-rem',
  type: 'value',
  filter: (token, options) =>
    (options?.usesDtcg ? token.$type : token.type) === 'dimension',
  transform: (token, config, options) => {
    const val = options?.usesDtcg ? token.$value : token.value;
    const str = String(val).replace('px', '');
    const px = parseFloat(str);
    if (isNaN(px)) return val;
    return `${Number((px / 16).toFixed(4))}rem`;
  },
});

StyleDictionary.registerTransform({
  name: 'name/tier-prefix',
  type: 'name',
  transform: (token) => {
    const toPascal = (s) =>
      s.replace(/-([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())
       .replace(/^(.)/, (c) => c.toUpperCase());
    const prefix = 'Ds' + toPascal(tierOf(token));
    return prefix + token.path.map(toPascal).join('');
  },
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: ['attribute/cti', 'name/kebab', 'size/px-to-rem'],
});

StyleDictionary.registerTransformGroup({
  name: 'custom/js',
  transforms: ['attribute/cti', 'name/tier-prefix', 'size/px-to-rem'],
});

const getStyleDictionaryConfig = (theme) => ({
  tokens: buildTokens(),
  usesDtcgTokens: true,
  log: { verbosity: 'verbose' },
  platforms: {
    ts: {
      transformGroup: 'custom/js',
      buildPath: './',
      files: [
        { destination: `./${theme}/build/js/tokens.js`, format: 'javascript/es6' },
        { destination: `./${theme}/build/js/tokens.d.ts`, format: 'typescript/es6-declarations' },
      ],
    },
    css: {
      transformGroup: 'custom/css',
      buildPath: './',
      files: [
        { destination: `./${theme}/build/css/tokens.css`, format: 'css/custom-variables' },
      ],
    },
    json: {
      transformGroup: 'custom/css',
      buildPath: './',
      files: [
        { destination: `./${theme}/build/json/tokens.json`, format: 'json/flat/custom' },
      ],
    },
  },
});

if (!theme) {
  for (const themeName of AVAILABLE_THEMES) {
    console.log(`\nBuilding ${themeName} theme`);
    const sd = new StyleDictionary(getStyleDictionaryConfig(themeName));
    await sd.buildAllPlatforms();
  }
} else {
  const sd = new StyleDictionary(getStyleDictionaryConfig(theme));
  await sd.buildAllPlatforms();
}
