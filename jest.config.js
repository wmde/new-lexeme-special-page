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
	testEnvironment: 'jsdom',
	testEnvironmentOptions: {
		customExportConditions: [ 'node', 'node-addons' ],
		url: 'https://wiki.example/',
	},
	testPathIgnorePatterns: [ '<rootDir>/cypress/' ],
	transform: {
		'^.*\\.ts$': 'ts-jest',
		'^.*\\.vue$': '@vue/vue3-jest',
	},
};
