/**
 * This script creates the store with an initial state and exports it.
 *
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import LangCodeRetriever from '@/data-access/LangCodeRetriever';
import LanguageCodesProvider from '@/data-access/LanguageCodesProvider';
import LexemeCreator from '@/data-access/LexemeCreator';
import Tracker from '@/data-access/tracking/Tracker';
import {
	createStore,
	Store,
} from 'vuex';

import createActions from './actions';
import mutations from './mutations';
import RootState from './RootState';

export interface StoreServices {
	lexemeCreator: LexemeCreator;
	langCodeRetriever: LangCodeRetriever;
	languageCodesProvider: LanguageCodesProvider;
	tracker: Tracker;
}

export default function initStore( {
	lexemeCreator, langCodeRetriever, languageCodesProvider, tracker,
}: StoreServices ): Store<RootState> {
	return createStore( {
		state(): RootState {
			return {
				lemma: '',
				language: null,
				languageSearchInput: '',
				languageCodeFromLanguageItem: undefined,
				lexicalCategory: null,
				lexicalCategorySearchInput: '',
				spellingVariant: '',
				spellingVariantSearchInput: '',
				globalErrors: [],
				perFieldErrors: {
					lemmaErrors: [],
					languageErrors: [],
					lexicalCategoryErrors: [],
					spellingVariantErrors: [],
				},
			};
		},
		mutations,
		actions: createActions( lexemeCreator, langCodeRetriever, languageCodesProvider, tracker ),
	} );
}
