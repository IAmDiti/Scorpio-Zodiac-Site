import next from 'eslint-config-next/core-web-vitals'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'design/**', 'next-env.d.ts'] },
  ...next,
  {
    // Quiz definitions are plain data modules — a bare default export reads best.
    files: ['lib/quizzes/*.js'],
    rules: { 'import/no-anonymous-default-export': 'off' },
  },
]

export default config
