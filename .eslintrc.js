module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'prettier/prettier': ['error', { endOfLine: 'auto' }, { usePrettierrc: true }], // Use our .prettierrc file as source
		// 'indent': [
		// 	'error',
		// 	'tab'
		// ],
		// 'linebreak-style': [
		// 	'error',
		// 	'unix'
		// ],
		// 'quotes': [
		// 	'error',
		// 	'single'
		// ],
		// 'semi': [
		// 	'error',
		// 	'never'
		// ]
	},
}
