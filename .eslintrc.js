module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    '@react-native',
  ],
  rules: {
    'no-return-await': 0,
    'react/prop-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    indent: ['error', 2, { SwitchCase: 1 }],
    '@typescript-eslint/camelcase': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
