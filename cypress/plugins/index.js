// / <reference types="cypress" />

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

module.exports = ( on, _config ) => {
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config
	on( 'task', {
		log( message ) {
			// eslint-disable-next-line no-console
			console.log( message );

			return null;
		},
		table( message ) {
			// eslint-disable-next-line no-console
			console.table( message );

			return null;
		},
	} );
};
