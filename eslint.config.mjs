import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

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
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslintPluginUnicorn.configs['flat/recommended'],
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
      'prettier',
    ],
  }),
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-children-prop': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/rules-of-hooks': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-empty-file': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/catch-error-name': 'off',
      'unicorn/no-useless-promise-resolve-reject': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-native-coercion-functions': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-document-cookie': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-array-some': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/prefer-type-error': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-typeof-undefined': 'off',
      'unicorn/prefer-date-now': 'off',
      'unicorn/no-lonely-if': 'warn',
      'unicorn/prefer-optional-catch-binding': 'warn',

      'no-case-declarations': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-children-prop': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
export default config;
