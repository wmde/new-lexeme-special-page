/* https://jestjs.io/docs/configuration */
module.exports = {
	moduleFileExtensions: [
		'js',
		'ts',
		'vue',
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'\\.css$': '<rootDir>/tests/mocks/styleMock.js',
	},
	setupFiles: [
		'./jest.overrides.js',
	],
	testEnvironment: 'jsdom',
	testEnvironmentOptions: {
		customExportConditions: [ 'node', 'node-addons' ],
	},
	testPathIgnorePatterns: [ '<rootDir>/cypress/' ],
	transform: {
		'^.*\\.ts$': 'ts-jest',
		'^.*\\.vue$': '@vue/vue3-jest',
	},
};
