/**
 * This script creates the store with an initial state and exports it.
 *
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import LangCodeRetriever from '@/data-access/LangCodeRetriever';
import LanguageCodesProvider from '@/data-access/LanguageCodesProvider';
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
	langCodeRetriever: LangCodeRetriever;
	languageCodesProvider: LanguageCodesProvider;
}

export default function initStore( {
	lexemeCreator, langCodeRetriever, languageCodesProvider,
}: StoreServices ): Store<RootState> {
	return createStore( {
		state(): RootState {
			return {
				lemma: '',
				language: '',
				languageCodeFromLanguageItem: undefined,
				lexicalCategory: '',
				spellingVariant: '',
				globalErrors: [],
			};
		},
		mutations,
		actions: createActions( lexemeCreator, langCodeRetriever, languageCodesProvider ),
	} );
}
