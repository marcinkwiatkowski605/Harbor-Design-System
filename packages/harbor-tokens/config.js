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
