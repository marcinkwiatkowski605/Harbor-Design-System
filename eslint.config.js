import { fileURLToPath, URL } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  {
    ignores: [".claude/worktrees/**"],
  },
  {
    extends: [js.configs.recommended],
  },
  {
    files: ["packages/*/**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["packages/harbor-tokens/index.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    files: ["packages/*/**/*.{js,mjs}", "scripts/**/*.mjs"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-unused-vars": ["error", { ignoreRestSiblings: true }],
    },
  },
);
