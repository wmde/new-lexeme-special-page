/**
 * This file stores all the mutations that can be committed to the store.
 * Mutation names are saved and exported as constants for later use in components.
 *
 * @see https://vuex.vuejs.org/guide/mutations.html
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import RootState from './RootState';

// TODO: Remove this example mutation once the first store mutation is implemented.
export const INCREMENT = 'increment';

export default {
	[ INCREMENT ]( state: RootState ): void {
		state.count++;
	},
};
