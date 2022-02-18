/**
 * This script creates the store with an initial state and exports it.
 *
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import {
	createStore,
	Store,
} from 'vuex';

import actions from './actions';
import mutations from './mutations';
import RootState from './RootState';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StoreParams {
	// param: Type;
}

// eslint-disable-next-line no-empty-pattern
export default function initStore( {
	// param = 'default',
}: StoreParams ): Store<RootState> {
	return createStore( {
		state(): RootState {
			return {
				lemma: '',
				language: '',
				lexicalCategory: '',
			};
		},
		mutations,
		actions,
	} );
}
