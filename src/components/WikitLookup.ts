import {
	defineComponent,
	h,
} from 'vue';
import { Lookup as RealWikitLookup } from '@wmde/wikit-vue-components';

/*
 * This component wraps a Wikit Lookup with no changes.
 * This is necessary to prevent the following vue-tsc error for <Lookup #no-results>:
 * Element implicitly has an 'any' type because expression of type '"no-results"'
 * can't be used to index type '{} | {}'.
 */

export default defineComponent( {
	name: 'WikitLookup',
	render() {
		return h( RealWikitLookup, this.$props, this.$slots );
	},
	compatConfig: { MODE: 3 },
} );
