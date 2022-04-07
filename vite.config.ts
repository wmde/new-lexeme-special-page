/* eslint quote-props: [ "error", "consistent-as-needed" ] */

import { resolve } from 'path';
import { BuildOptions, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import banner from 'vite-plugin-banner';

function getBuildConfig( buildType = 'app' ): BuildOptions {
	const target = 'es2015';

	switch ( buildType ) {
		case 'preview':
			return {
				target,
			};
		case 'app':
			return {
				target,
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
		case 'info':
			return {
				target,
				lib: {
					entry: resolve( __dirname, 'src/components/InfoMessage.vue' ),
					name: 'info',
					fileName: ( format ) => `info.${format}.js`,
					formats: [ 'cjs' ],
				},
				rollupOptions: {
					external: [ 'vue', 'vuex' ],
				},
			};
		default:
			throw new Error( `Unknown build type ${buildType}` );
	}
}

// https://vitejs.dev/config/
export default defineConfig( {
	build: getBuildConfig( process.env.BUILD_TYPE ),
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
