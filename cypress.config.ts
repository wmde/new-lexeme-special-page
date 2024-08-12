import { defineConfig } from 'cypress';

export default defineConfig( {
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents( on ) {
			// `on` is used to hook into various events Cypress emits
			// `config` is the resolved Cypress config
			// Before Cypress 10 this config existed in 'cypress/plugins/index.js' - that
			// location is now deprecated.
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
		},
		baseUrl: 'http://localhost:3000/',
		supportFile: false,
	},
} );
