/* eslint quote-props: [ "error", "consistent-as-needed" ] */

import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig( {
	build: {
		target: 'es2015',
		lib: {
			entry: resolve( __dirname, 'src/main.ts' ),
			name: 'main',
			fileName: ( format ) => `SpecialNewLexeme.${format}.js`,
			formats: [ 'cjs' ],
		},
		rollupOptions: {
			external: [ '@vue/compat', 'vue', 'vuex' ],
		},
	},
	resolve: {
		alias: {
			'vue': '@vue/compat',
			'@vue/composition-api': '@vue/compat',
			'@wmde/wikit-vue-components/dist/wikit-vue-components.css': resolve(
				__dirname,
				'node_modules/@wmde/wikit-vue-components/dist/wikit-vue-components.css',
			),
			'@wmde/wikit-vue-components': resolve(
				__dirname,
				'node_modules/@wmde/wikit-vue-components/dist/wikit-vue-components-vue3compat.common.js',
			),
			'@': resolve( __dirname, 'src' ),
		},
	},
	plugins: [ vue( {
		template: {
			compilerOptions: {
				compatConfig: {
					MODE: 2,
				},
			},
		},
	} ) ],
} );
