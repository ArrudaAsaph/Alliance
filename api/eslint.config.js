import tseslint from 'typescript-eslint';
import deprecation from 'eslint-plugin-deprecation';

export default [
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            deprecation,
        },
        rules: {
            'deprecation/deprecation': 'error',
        },
    },
];
