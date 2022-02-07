/*
	This will be used for file-types to which Wikimedia linting does not apply, such as json or yaml
 */
module.exports = {
	useTabs: true, // does not apply to yaml as that format cant use tabs
	tabWidth: 4, // applies defacto only to yaml
};
