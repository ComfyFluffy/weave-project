import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  // Base JavaScript configuration
  js.configs.recommended,

  // TypeScript configuration for all files
  ...tseslint.configs.recommendedTypeChecked,

  // Base configuration for all files
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Common rules for all environments
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/require-await': 'warn',
    },
  },

  // Backend-specific configuration
  {
    files: ['apps/backend/**/*.{js,ts,mjs,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Backend-specific rules
      // '@typescript-eslint/no-require-imports': 'off', // Allow require() in backend if needed
    },
  },

  // Frontend-specific configuration
  {
    files: ['apps/frontend/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      '@tanstack/query': pluginQuery,
    },
    rules: {
      // Base React rules
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginQuery.configs.recommended.rules,

      // React-specific customizations
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation

      // React Refresh rules for Vite
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript integration
      'no-unused-vars': 'off', // Turn off base rule
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Shared types package configuration
  {
    files: ['packages/types/**/*.{js,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Stricter rules for shared types
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // Configuration files
  {
    files: [
      '**/eslint.config.{js,mjs}',
      '**/vite.config.{js,ts}',
      '**/*.config.{js,mjs,ts}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Ignore patterns
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.yarn/**',
      '**/.pnp.*',
      '**/coverage/**',
      'eslint.config.mjs',
    ],
  },
]
