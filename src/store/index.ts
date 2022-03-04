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

interface StoreParams {
	token?: string;
	licenseUrl?: string;
	licenseName?: string;
}

export default function initStore( {
	token = '',
	licenseUrl = '',
	licenseName = '',
}: StoreParams ): Store<RootState> {
	return createStore( {
		state(): RootState {
			return {
				lemma: '',
				language: '',
				lexicalCategory: '',
				token,
				config: {
					licenseUrl,
					licenseName,
				},
			};
		},
		mutations,
		actions,
	} );
}
