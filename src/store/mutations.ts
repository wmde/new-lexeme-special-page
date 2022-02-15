/**
 * This file stores all the mutations that can be committed to the store.
 * Mutation names are saved and exported as constants for later use in components.
 *
 * @see https://vuex.vuejs.org/guide/mutations.html
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import RootState from './RootState';

export const SET_LEMMA = 'setLemma';

export default {
	[ SET_LEMMA ]( state: RootState, lemma: string ): void {
		state.lemma = lemma;
	},
};
