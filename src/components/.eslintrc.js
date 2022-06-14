module.exports = {
	rules: {
		// does not support TypeScript syntax properly
		// (spaces in <> should be allowed)
		'func-call-spacing': 'off',
		// defineEmits<{}>() should use an object type with call signatures,
		// even if there is only one event and a function type would be possible
		'@typescript-eslint/prefer-function-type': 'off',
	},
};
