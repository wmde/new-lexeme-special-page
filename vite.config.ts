/* eslint quote-props: [ "error", "consistent-as-needed" ] */

import { resolve } from 'path';
import { BuildOptions, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import banner from 'vite-plugin-banner';

function getBuildConfig( isAppBuild: boolean ): BuildOptions {
	if ( isAppBuild ) {
		return {
			target: 'es2015',
		};
	}

	return {
		target: 'es2015',
		lib: {
			entry: resolve( __dirname, 'src/init.ts' ),
			name: 'main',
			fileName: ( format ) => `SpecialNewLexeme.${format}.js`,
			formats: [ 'cjs' ],
		},
		rollupOptions: {
			external: [ 'vue', 'vuex' ],
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig( {
	build: getBuildConfig( !!process.env.BUILD_AS_APP ),
	resolve: {
		alias: {
			'@wmde/wikit-tokens/variables': resolve(
				__dirname,
				'node_modules/@wmde/wikit-tokens/dist/_variables.scss',
			),
			'@': resolve( __dirname, 'src' ),
		},
	},
	plugins: [
		vue( {
			template: {
				compilerOptions: {
					compatConfig: {
						MODE: 3,
					},
				},
			},
		} ),
		banner( '/*!/*@nomin*/' ),
	],
} );
