import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettierEslint from "eslint-config-prettier/flat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export const eslintConfig = [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/stylistic"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",
    },
  },
  {
    rules: {
      // Enforces that we don't have any unused variables.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Enforces that we use `const foo = () => {}` instead of `function foo() {}`.
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      "object-shorthand": ["error"],
      // Enforces that we don't use `snake_case` for variables names.
      camelcase: [
        "error",
        {
          properties: "never",
        },
      ],
      // Enforces that we don't use `console.log` or `console.error`.
      "no-console": ["error"],
      // Enforces that we use `.map()` instead of `.forEach` or `for` loops.
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForStatement",
          message: "Use a map instead.",
        },
        {
          selector: "CallExpression[callee.property.name='forEach']",
          message: "Use a map instead.",
        },
      ],
      // Enforces that we don't unnecessarily use ternary statements.
      "no-unneeded-ternary": ["error"],
      // Enforces that we don't accidentally use an octal.
      "no-octal": ["error"],
      // Enforces we don't do things like `!!foo`, instead we do a `Boolean(foo)`.
      "no-implicit-coercion": ["error"],
      // Enforces that `switch` statements are exhaustive.
      "default-case": ["error"],
    },
  },
  prettierEslint,
];
