const json = require('@eslint/json');

module.exports = [
  {
    ignores: ['**/*.test.js', 'node_modules/**', "package.json", "package-lock.json"],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        console: true,
        process: true,
        module: true,
        require: true,
        __dirname: true
      },
    },
    rules: {
      semi: ['error', 'always'],
      'no-unused-vars': 'warn',
      'no-empty': 'error',
      'no-undef': 'error'
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    languageOptions: { parser: json.parser },
    rules: {},
  },
];