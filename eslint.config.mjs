import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*', 'assets/**/*', 'comics/**/*', 'storyboard/**/*', 'Sample Images/**/*'],
  },
  firebaseRulesPlugin.configs['flat/recommended'],
];
