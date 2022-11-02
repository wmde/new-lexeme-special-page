require( '@rushstack/eslint-patch/modern-module-resolution' );

module.exports = {
	root: true,
	env: {
		'vue/setup-compiler-macros': true,
	},
	extends: [
		'wikimedia',
		'wikimedia/node',
		'wikimedia/client-common',
		'wikimedia/vue3-common',
		// we do not import any wikimedia/language/es* config:
		// if it compiles, we’re allowed to use it
		'@wmde/wikimedia-typescript',
		'@vue/typescript/recommended',
		'plugin:cypress/recommended',
		'plugin:vuejs-accessibility/recommended',
	],
	rules: {
		'comma-dangle': [ 'error', 'always-multiline' ],
		'vue/component-name-in-template-casing': [ 'error', 'kebab-case', {
			registeredComponentsOnly: false, // we don’t use custom elements
		} ],

		// resetting this back to the default value, to comply with modern vite conventions
		'vue/component-tags-order': [ 'error', { order: [ [ 'script', 'template' ], 'style' ] } ],

		// we still need to use some legacy APIs to interact with the vue3compat build of Wikit
		'vue/no-deprecated-v-on-native-modifier': 'off',

		// rule has no support for our @/ aliases;
		// the designated replacement, plugin:import, was a pain so we ditched it
		'node/no-missing-import': 'off',
	},
};
