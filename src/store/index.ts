/**
 * This script creates the store with an initial state and exports it.
 *
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import LexemeCreator from '@/data-access/LexemeCreator';
import {
	createStore,
	Store,
} from 'vuex';

import createActions from './actions';
import mutations from './mutations';
import RootState from './RootState';

interface StoreServices {
	lexemeCreator: LexemeCreator;
}

export default function initStore( {
	lexemeCreator,
}: StoreServices ): Store<RootState> {
	return createStore( {
		state(): RootState {
			return {
				lemma: '',
				language: '',
				lexicalCategory: '',
				spellingVariant: '',
				globalErrors: [],
			};
		},
		mutations,
		actions: createActions( lexemeCreator ),
	} );
}
