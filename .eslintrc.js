module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import', '@typescript-eslint', 'poke-eslint'],
  rules: {
    'poke-eslint/poke-return-on-resolve-reject': 1,
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-non-null-assertion': 1,
    eqeqeq: ['error', 'always'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'unknown',
        ],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
}
