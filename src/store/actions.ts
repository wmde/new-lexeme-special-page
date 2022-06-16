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
import MessageKeys from '@/plugins/MessagesPlugin/MessageKeys';
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
	SET_LANGUAGE_SEARCH_INPUT,
	SET_LEMMA,
	SET_LEXICAL_CATEGORY,
	SET_LEXICAL_CATEGORY_SEARCH_INPUT,
	SET_SPELLING_VARIANT,
	SET_SPELLING_VARIANT_SEARCH_INPUT,
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
	validSpellingVariant: string;
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
				let messageKey: MessageKeys;
				if ( state.languageSearchInput ) {
					messageKey = 'wikibaselexeme-newlexeme-language-invalid-error';
				} else {
					messageKey = 'wikibaselexeme-newlexeme-language-empty-error';
				}
				commit(
					ADD_PER_FIELD_ERROR,
					{ field: 'languageErrors', error: { messageKey: messageKey } },
				);
			} else {
				formData.validLanguageId = state.language.id;
			}
			if ( !state.lexicalCategory ) {
				let messageKey: MessageKeys;
				if ( state.lexicalCategorySearchInput ) {
					messageKey = 'wikibaselexeme-newlexeme-lexicalcategory-invalid-error';
				} else {
					messageKey = 'wikibaselexeme-newlexeme-lexicalcategory-empty-error';
				}
				commit(
					ADD_PER_FIELD_ERROR,
					{ field: 'lexicalCategoryErrors', error: { messageKey: messageKey } },
				);
			} else {
				formData.validLexicalCategoryId = state.lexicalCategory.id;
			}
			if ( state.language ) {
				if ( state.spellingVariant ) {
					formData.validSpellingVariant = state.spellingVariant;
				} else if ( state.languageCodeFromLanguageItem ) {
					formData.validSpellingVariant = state.languageCodeFromLanguageItem;
				} else {
					let messageKey: MessageKeys;
					if ( state.spellingVariantSearchInput ) {
						messageKey = 'wikibaselexeme-newlexeme-lemma-language-invalid-error';
					} else {
						messageKey = 'wikibaselexeme-newlexeme-lemma-language-empty-error';
					}
					commit(
						ADD_PER_FIELD_ERROR,
						{ field: 'spellingVariantErrors', error: { messageKey: messageKey } },
					);
				}
			}

			const isFormDataValid = (
				validData: Partial<ValidLexemeData>,
			): validData is ValidLexemeData => {
				return !!validData.validLemma &&
					!!validData.validLanguageId &&
					!!validData.validLexicalCategoryId &&
					!!validData.validSpellingVariant;
			};

			if ( !isFormDataValid( formData ) ) {
				throw new Error( 'Not all fields are valid' );
			}

			return formData;
		},
		async [ CREATE_LEXEME ]( { commit, dispatch }: RootContext ): Promise<string> {
			const {
				validLemma,
				validLanguageId,
				validLexicalCategoryId,
				validSpellingVariant,
			} = await dispatch( ASSEMBLE_VALID_INPUTS );
			commit( CLEAR_ERRORS );
			try {
				const lexemeId = await lexemeCreator.createLexeme(
					validLemma,
					validSpellingVariant,
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
			{ state, commit, dispatch }: RootContext,
			newLanguageItem: SearchedItemOption | null,
		): Promise<void> {
			const oldLanguageItem = state.language;
			commit( SET_LANGUAGE, newLanguageItem );
			if ( oldLanguageItem?.id === newLanguageItem?.id ) {
				return;
			}

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
				commit( SET_SPELLING_VARIANT_SEARCH_INPUT, params.spellVarCode );
			}
			if ( params.language !== undefined ) {
				commit( SET_LANGUAGE, {
					id: params.language.id,
					display: params.language.display,
					// don’t copy params.language.languageCode here
				} );
				await dispatch( HANDLE_ITEM_LANGUAGE_CODE, params.language.languageCode );
				commit(
					SET_LANGUAGE_SEARCH_INPUT,
					params.language.display.label?.value ?? params.language.id,
				);
			}
			if ( params.lexicalCategory !== undefined ) {
				commit( SET_LEXICAL_CATEGORY, params.lexicalCategory );
				commit(
					SET_LEXICAL_CATEGORY_SEARCH_INPUT,
					params.lexicalCategory.display.label?.value ?? params.lexicalCategory.id,
				);
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
