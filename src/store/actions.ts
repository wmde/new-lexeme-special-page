/**
 * This file stores all the actions that can be dispatched to the store.
 * Action names are saved and exported as constants for later use in components.
 *
 * @see https://vuex.vuejs.org/guide/actions.html
 * @see https://vuex.vuejs.org/guide/structure.html
 */

/*
 * Actions should be used for complex or asynchronous changes,
 * otherwise it’s preferred to directly use mutations.
 */

import LangCodeRetriever from '@/data-access/LangCodeRetriever';
import LanguageCodesProvider from '@/data-access/LanguageCodesProvider';
import LexemeCreator from '@/data-access/LexemeCreator';
import {
	ActionContext,
	ActionTree,
} from 'vuex';
import { ADD_ERRORS, CLEAR_ERRORS, SET_LANGUAGE, SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM, SET_SPELLING_VARIANT } from './mutations';
import RootState from './RootState';
/*
import {
	MUTATION_NAME,
} from './mutations';
*/

type RootContext = ActionContext<RootState, RootState>;
type RootActions = ActionTree<RootState, RootState>;

export const CREATE_LEXEME = 'createLexeme';
export const HANDLE_LANGUAGE_CHANGE = 'handleLanguageChange';

export default function createActions(
	lexemeCreator: LexemeCreator,
	langCodeRetriever: LangCodeRetriever,
	languageCodesProvider: LanguageCodesProvider,
): RootActions {
	return {
		async [ CREATE_LEXEME ]( { state, commit }: RootContext ): Promise<string> {
			commit( CLEAR_ERRORS );
			try {
				const spellingVariant = state.languageCodeFromLanguageItem || state.spellingVariant;
				const lexemeId = await lexemeCreator.createLexeme(
					state.lemma,
					spellingVariant,
					state.language,
					state.lexicalCategory,
				);
				return lexemeId;
			} catch ( errors ) {
				commit( ADD_ERRORS, errors );
				return Promise.reject( null );
			}
		},
		async [ HANDLE_LANGUAGE_CHANGE ]( { commit }, newLanguageItemId: string ): Promise<void> {
			commit( SET_LANGUAGE, newLanguageItemId );
			commit( SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM, undefined );
			commit( SET_SPELLING_VARIANT, '' );

			if ( !newLanguageItemId ) {
				return;
			}

			let langCode = await langCodeRetriever.getLanguageCodeFromItem( newLanguageItemId );

			if ( typeof langCode === 'string' && !languageCodesProvider.isValid( langCode ) ) {
				langCode = false;
			}

			commit( SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM, langCode );
		},
	};
}
