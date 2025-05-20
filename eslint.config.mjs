import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tailwind from 'eslint-plugin-tailwindcss';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      '.next/**',
      'public/**',
      'next.config.js',
      'postcss.config.js',
      'node_modules/**',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginUnicorn.configs['flat/recommended'],
  ...tailwind.configs['flat/recommended'],
  ...compat.config({
    extends: ['next'],
    settings: {
      next: {
        rootDir: '.',
      },
    },
  }),
  ...compat.config({
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:tailwindcss/recommended',
      'prettier',
    ],
  }),
  {
    rules: {
      'no-undef': 'error',
      'react/react-in-jsx-scope': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'warn',
      'unicorn/no-empty-file': 'warn',
      'unicorn/filename-case': 'warn',
      'unicorn/prefer-logical-operator-over-ternary': 'warn',
      'unicorn/consistent-function-scoping': 'warn',
      'unicorn/numeric-separators-style': 'warn',
      'unicorn/no-array-for-each': 'warn',
      'unicorn/catch-error-name': 'warn',
      'unicorn/no-useless-promise-resolve-reject': 'warn',
      'unicorn/prefer-global-this': 'warn',
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
];
export default config;
