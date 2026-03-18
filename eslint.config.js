import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tsEslint.config(
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.ts', '**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        chrome: 'readonly'
      },
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-floating-promises': 'error'
    }
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      parserOptions: {
        project: null
      }
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off'
    }
  }
);
