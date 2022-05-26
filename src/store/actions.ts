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
const ASSEMBLE_VALID_INPUTS = 'assembleValidInputs';

export type InitParams = {
	lemma?: string;
	spellVarCode?: string;
	language?: SearchedItemOption & {
		languageCode: string | null | false;
	};
	lexicalCategory?: SearchedItemOption;
};

interface ValidLexemeData {
	validLemma: string;
	validLanguageId: string;
	validLexicalCategoryId: string;
}

export default function createActions(
	lexemeCreator: LexemeCreator,
	langCodeRetriever: LangCodeRetriever,
	languageCodesProvider: LanguageCodesProvider,
	tracker: Tracker,
): RootActions {
	return {
		[ ASSEMBLE_VALID_INPUTS ]( { state, commit }: RootContext ): ValidLexemeData {
			const formData: Partial<ValidLexemeData> = {};

			if ( !state.lemma ) {
				commit(
					ADD_PER_FIELD_ERROR,
					{ field: 'lemmaErrors', error: { messageKey: 'wikibaselexeme-newlexeme-lemma-empty-error' } },
				);
			} else {
				formData.validLemma = state.lemma;
			}
			if ( !state.language ) {
				commit(
					ADD_PER_FIELD_ERROR,
					{ field: 'languageErrors', error: { messageKey: 'wikibaselexeme-newlexeme-language-empty-error' } },
				);
			} else {
				formData.validLanguageId = state.language.id;
			}
			if ( !state.lexicalCategory ) {
				commit(
					ADD_PER_FIELD_ERROR,
					{ field: 'lexicalCategoryErrors', error: { messageKey: 'wikibaselexeme-newlexeme-lexicalcategory-empty-error' } },
				);
			} else {
				formData.validLexicalCategoryId = state.lexicalCategory.id;
			}

			const isFormDataValid = (
				validData: Partial<ValidLexemeData>,
			): validData is ValidLexemeData => {
				return !!validData.validLemma &&
					!!validData.validLanguageId &&
					!!validData.validLexicalCategoryId;
			};

			if ( !isFormDataValid( formData ) ) {
				throw new Error( 'Not all fields are valid' );
			}

			return formData;
		},
		async [ CREATE_LEXEME ]( { state, commit, dispatch }: RootContext ): Promise<string> {
			const {
				validLemma,
				validLanguageId,
				validLexicalCategoryId,
			} = await dispatch( ASSEMBLE_VALID_INPUTS );
			commit( CLEAR_ERRORS );
			try {
				const spellingVariant = state.spellingVariant || state.languageCodeFromLanguageItem || '';
				const lexemeId = await lexemeCreator.createLexeme(
					validLemma,
					spellingVariant,
					validLanguageId,
					validLexicalCategoryId,
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
