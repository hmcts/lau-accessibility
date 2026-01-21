import globals from "globals";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";


export default [
  {
    files: ["**/*.{js,cjs}"],
    ignores: [
      "allure-results/**",
      "allure-report/**",
      "playwright-report/**",
      "test-results/**",
      "node_modules/**",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      playwright,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "require-await": "warn",

      "playwright/no-page-pause": "error",
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-focused-test": "error",
      "playwright/valid-expect": "error",
    },
  },

  {
    files: ["playwright.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  prettier,
];
