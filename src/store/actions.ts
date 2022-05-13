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

import { SearchedItemOption } from '@/data-access/ItemSearcher';
import LangCodeRetriever from '@/data-access/LangCodeRetriever';
import LanguageCodesProvider from '@/data-access/LanguageCodesProvider';
import LexemeCreator from '@/data-access/LexemeCreator';
import Tracker from '@/data-access/tracking/Tracker';
import {
	ActionContext,
	ActionTree,
} from 'vuex';
import { ADD_ERRORS, CLEAR_ERRORS, SET_LANGUAGE, SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM, SET_SPELLING_VARIANT } from './mutations';
import RootState from './RootState';

type RootContext = ActionContext<RootState, RootState>;
type RootActions = ActionTree<RootState, RootState>;

export const CREATE_LEXEME = 'createLexeme';
export const HANDLE_LANGUAGE_CHANGE = 'handleLanguageChange';

export default function createActions(
	lexemeCreator: LexemeCreator,
	langCodeRetriever: LangCodeRetriever,
	languageCodesProvider: LanguageCodesProvider,
	tracker: Tracker,
): RootActions {
	return {
		async [ CREATE_LEXEME ]( { state, commit }: RootContext ): Promise<string> {
			if ( !state.language || !state.lexicalCategory ) {
				throw new Error( 'No language or lexical category!' ); // TODO
			}
			commit( CLEAR_ERRORS );
			try {
				const spellingVariant = state.languageCodeFromLanguageItem || state.spellingVariant;
				const lexemeId = await lexemeCreator.createLexeme(
					state.lemma,
					spellingVariant,
					state.language.id,
					state.lexicalCategory.id,
				);
				tracker.increment( 'wikibase.lexeme.special.NewLexeme.js.create' );
				return lexemeId;
			} catch ( errors ) {
				commit( ADD_ERRORS, errors );
				return Promise.reject( null );
			}
		},
		async [ HANDLE_LANGUAGE_CHANGE ](
			{ commit }: RootContext,
			newLanguageItem: SearchedItemOption | null,
		): Promise<void> {
			commit( SET_LANGUAGE, newLanguageItem );
			commit( SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM, undefined );
			commit( SET_SPELLING_VARIANT, '' );

			if ( !newLanguageItem ) {
				return;
			}

			let langCode = await langCodeRetriever.getLanguageCodeFromItem( newLanguageItem.id );

			if ( typeof langCode === 'string' && !languageCodesProvider.isValid( langCode ) ) {
				langCode = false;
			}

			commit( SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM, langCode );
		},
	};
}
