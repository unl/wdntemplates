import { defineConfig, globalIgnores } from 'eslint/config';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';
import javascript from '@eslint/js';

export default defineConfig([
    globalIgnores([
        './wdn/templates_5.3', // Temporary while development
        './wdn/templates_6.0/js-src.old', // Temporary while development
        './wdn/templates_6.0/js',
        './wdn/templates_6.0/js-src/lib/moment.js',
        './wdn/templates_6.0/js-src/lib/moment-timezone.js',
        './wdn/templates_6.0/js-src/lib/jquery.js',
        './wdn/templates_6.0/js-src/lib/jquery-ui.js',
        './wdn/templates_6.0/js-src/lib/jquery-validator.js',
    ]),
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                'process': 'readonly',
                '__dirname': 'readonly',
                'module': 'writeable',
            },
        },
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            'js': javascript,
            '@stylistic/js': stylisticJs,
        },
        extends: ['js/recommended'],
        rules: {
            '@stylistic/js/array-bracket-spacing': ['error', 'never'],
            '@stylistic/js/block-spacing': 'error',
            '@stylistic/js/brace-style': ['error', '1tbs', {
                'allowSingleLine': true,
            }],
            '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/js/comma-spacing': ['error', {
                'before': false,
                'after': true,
            }],
            '@stylistic/js/eol-last': ['error', 'always'],
            '@stylistic/js/function-call-spacing': ['error', 'never'],
            '@stylistic/js/indent': ['error', 4],
            '@stylistic/js/lines-around-comment': ['error', {
                'beforeBlockComment': true,
                'beforeLineComment': false,
                'allowBlockStart': true,
            }],
            '@stylistic/js/lines-between-class-members': ['error', 'always'],
            '@stylistic/js/no-confusing-arrow': 'error',
            '@stylistic/js/no-extra-semi': 'error',
            '@stylistic/js/no-floating-decimal': 'error',
            '@stylistic/js/no-trailing-spaces': ['error', {
                'ignoreComments': true,
            }],
            '@stylistic/js/quotes': ['error', 'single'],
            '@stylistic/js/semi': ['error', 'always'],
            '@stylistic/js/semi-spacing': 'error',
            '@stylistic/js/space-before-blocks': 'error',
            '@stylistic/js/space-before-function-paren': ['error', 'never'],
            'camelcase': ['error', {
                'ignoreDestructuring': true,
            }],
            'curly': 'error',
            'eqeqeq': ['error', 'always'],
            'id-length': ['error', {
                'min': 2,
            }],
            'no-lonely-if': 'error',
            'no-underscore-dangle': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-object-has-own': 'error',
            'prefer-template': 'error',
            'radix': 'error',
            'yoda': ['error', 'never'],
        },
    },
]);
