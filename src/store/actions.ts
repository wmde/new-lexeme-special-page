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
import {
	ADD_ERRORS,
	ADD_PER_FIELD_ERROR,
	CLEAR_ERRORS,
	SET_LANGUAGE,
	SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM,
	SET_LEMMA,
	SET_LEXICAL_CATEGORY,
	SET_SPELLING_VARIANT,
} from './mutations';
import RootState from './RootState';

type RootContext = ActionContext<RootState, RootState>;
type RootActions = ActionTree<RootState, RootState>;

export const CREATE_LEXEME = 'createLexeme';
export const HANDLE_LANGUAGE_CHANGE = 'handleLanguageChange';
export const HANDLE_INIT_PARAMS = 'initFromParams';

// internal actions (used by other actions), not exported
const HANDLE_ITEM_LANGUAGE_CODE = 'handleItemLanguageCode';
const VALIDATE_INPUTS = 'validateInputs';

export type InitParams = {
	lemma?: string;
	spellVarCode?: string;
	language?: SearchedItemOption & {
		languageCode: string | null | false;
	};
	lexicalCategory?: SearchedItemOption;
};

export default function createActions(
	lexemeCreator: LexemeCreator,
	langCodeRetriever: LangCodeRetriever,
	languageCodesProvider: LanguageCodesProvider,
	tracker: Tracker,
): RootActions {
	return {
		[ VALIDATE_INPUTS ]( { state, commit }: RootContext ): boolean {
			let everythingIsValid = true;
			if ( !state.lemma ) {
				// FIXME: use mutations everywhere
				commit(
					ADD_PER_FIELD_ERROR,
					// FIXME: message should be code here and transformed it i18n in the component
					{ field: 'lemmaErrors', error: { type: 'error', message: 'wikibaselexeme-newlexeme-error-no-lemma' } },
				);
				everythingIsValid = false;
			}
			if ( !state.language ) {
				commit(
					ADD_PER_FIELD_ERROR,
					{ field: 'languageErrors', error: { type: 'error', message: 'wikibaselexeme-newlexeme-error-no-language' } },
				);
				everythingIsValid = false;
			}
			if ( !state.lexicalCategory ) {
				commit(
					ADD_PER_FIELD_ERROR,
					{ field: 'lexicalCategoryErrors', error: { type: 'error', message: 'wikibaselexeme-newlexeme-error-no-lexical-category' } },
				);
				everythingIsValid = false;
			}
			if ( state.language && !state.languageCodeFromLanguageItem && !state.spellingVariant ) {
				commit(
					ADD_PER_FIELD_ERROR,
					{ field: 'spellingVariantErrors', error: { type: 'error', message: 'wikibaselexeme-newlexeme-error-no-spelling-variant' } },
				);
				everythingIsValid = false;
			}

			return everythingIsValid;
		},
		async [ CREATE_LEXEME ]( { state, commit, dispatch }: RootContext ): Promise<string> {
			if ( !await dispatch( VALIDATE_INPUTS ) ) {
				throw new Error( 'No language or lexical category!' ); // TODO
			}
			if ( !state.language || !state.lexicalCategory ) {
				throw new Error( 'No language or lexical category!' ); // TODO
			}
			commit( CLEAR_ERRORS );
			try {
				const spellingVariant = state.spellingVariant || state.languageCodeFromLanguageItem || '';
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
			{ commit, dispatch }: RootContext,
			newLanguageItem: SearchedItemOption | null,
		): Promise<void> {
			commit( SET_LANGUAGE, newLanguageItem );
			commit( SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM, undefined );
			commit( SET_SPELLING_VARIANT, '' );

			if ( !newLanguageItem ) {
				return;
			}

			const langCode = await langCodeRetriever.getLanguageCodeFromItem( newLanguageItem.id );

			await dispatch( HANDLE_ITEM_LANGUAGE_CODE, langCode );
		},
		async [ HANDLE_INIT_PARAMS ](
			{ commit, dispatch }: RootContext,
			params: InitParams,
		): Promise<void> {
			if ( params.lemma !== undefined ) {
				commit( SET_LEMMA, params.lemma );
			}
			if ( params.spellVarCode !== undefined ) {
				commit( SET_SPELLING_VARIANT, params.spellVarCode );
			}
			if ( params.language !== undefined ) {
				commit( SET_LANGUAGE, {
					id: params.language.id,
					display: params.language.display,
					// don’t copy params.language.languageCode here
				} );
				await dispatch( HANDLE_ITEM_LANGUAGE_CODE, params.language.languageCode );
			}
			if ( params.lexicalCategory !== undefined ) {
				commit( SET_LEXICAL_CATEGORY, params.lexicalCategory );
			}
		},
		async [ HANDLE_ITEM_LANGUAGE_CODE ](
			{ commit }: RootContext,
			languageCode: string | undefined | null | false,
		) {
			if ( typeof languageCode === 'string' && !languageCodesProvider.isValid( languageCode ) ) {
				languageCode = false;
			}

			commit( SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM, languageCode );
		},
	};
}
