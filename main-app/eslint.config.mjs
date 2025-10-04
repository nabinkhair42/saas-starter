import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];

const config = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/.env*',
      '**/.vscode/**',
      '**/.idea/**',
      '**/*.log',
      '**/coverage/**',
      '**/.cache/**',
      '**/.turbo/**',
      '**/.vercel/**',
      '**/public/**',
      'next-env.d.ts',
    ],
  },
  ...eslintConfig,
];

export default config;
