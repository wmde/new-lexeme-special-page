/* https://jestjs.io/docs/configuration */
module.exports = {
	moduleFileExtensions: [
		'js',
		'ts',
		'vue',
	],
	moduleNameMapper: {
		'^vue$': '@vue/compat',
		'^@vue/composition-api$': '@vue/compat',
		'^@wmde/wikit-vue-components$': '<rootDir>/node_modules/@wmde/wikit-vue-components/dist/wikit-vue-components-vue3compat.common.js',
		'^@/(.*)$': '<rootDir>/src/$1',
		'\\.css$': '<rootDir>/tests/mocks/styleMock.js',
	},
	setupFiles: [
		'./jest.overrides.js',
	],
	testEnvironment: 'jsdom',
	transform: {
		'^.*\\.ts$': 'ts-jest',
		'^.*\\.vue$': '@vue/vue3-jest',
	},
};
