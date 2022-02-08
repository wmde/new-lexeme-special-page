module.exports = {
	root: true,
	env: {
		'vue/setup-compiler-macros': true,
	},
	extends: [
		'wikimedia',
		'wikimedia/node',
		'wikimedia/client-common', // client-es6 still extends vue2 config
		'wikimedia/vue3-es6',
		'wikimedia/language/es2021', // this should ensure that we can use all the new features, not only es6
		'@wmde/wikimedia-typescript',
		'@vue/typescript/recommended',
	],
	rules: {
		'comma-dangle': [ 'error', 'always-multiline' ],

		// resetting this back to the default value, to comply with modern vite conventions
		'vue/component-tags-order': [ 'error', { order: [ [ 'script', 'template' ], 'style' ] } ],

		// we still need to use some legacy APIs to interact with the vue3compat build of Wikit
		'vue/no-deprecated-v-on-native-modifier': 'off',
	},
};
