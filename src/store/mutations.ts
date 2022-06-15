/**
 * This file stores all the mutations that can be committed to the store.
 * Mutation names are saved and exported as constants for later use in components.
 *
 * @see https://vuex.vuejs.org/guide/mutations.html
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import { SearchedItemOption } from '@/data-access/ItemSearcher';
import MessageKeys from '@/plugins/MessagesPlugin/MessageKeys';
import RootState, { SubmitError } from './RootState';

export const SET_LEMMA = 'setLemma';
export const SET_LANGUAGE = 'setLanguage';
export const SET_LANGUAGE_SEARCH_INPUT = 'setLanguageSearchInput';
export const SET_LEXICAL_CATEGORY = 'setLexicalCategory';
export const SET_LEXICAL_CATEGORY_SEARCH_INPUT = 'setLexicalCategorySearchInput';
export const SET_SPELLING_VARIANT = 'setSpellingVariant';
export const SET_SPELLING_VARIANT_SEARCH_INPUT = 'setSpellingVariantSearchInput';
export const SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM = 'setLanguageCodeFromLanguageItem';
export const ADD_ERRORS = 'addErrors';
export const ADD_PER_FIELD_ERROR = 'addPerFieldError';
export const CLEAR_PER_FIELD_ERRORS = 'clearPerFieldErrors';
export const CLEAR_ERRORS = 'clearErrors';

export default {
	[ SET_LEMMA ]( state: RootState, lemma: string ): void {
		state.lemma = lemma;
	},
	[ SET_LANGUAGE ]( state: RootState, language: SearchedItemOption | null ): void {
		state.language = language;
	},
	[ SET_LANGUAGE_SEARCH_INPUT ](
		state: RootState, languageSearchInput: string ): void {
		state.languageSearchInput = languageSearchInput;
	},
	[ SET_LEXICAL_CATEGORY ]( state: RootState, lexicalCategory: SearchedItemOption | null ): void {
		state.lexicalCategory = lexicalCategory;
	},
	[ SET_LEXICAL_CATEGORY_SEARCH_INPUT ](
		state: RootState, lexicalCategorySearchInput: string ): void {
		state.lexicalCategorySearchInput = lexicalCategorySearchInput;
	},
	[ SET_SPELLING_VARIANT ]( state: RootState, spellingVariant: string ): void {
		state.spellingVariant = spellingVariant;
	},
	[ SET_SPELLING_VARIANT_SEARCH_INPUT ](
		state: RootState, spellingVariantSearchInput: string ): void {
		state.spellingVariantSearchInput = spellingVariantSearchInput;
	},
	[ SET_LANGUAGE_CODE_FROM_LANGUAGE_ITEM ](
		state: RootState,
		langCode: string|null|false|undefined,
	): void {
		state.languageCodeFromLanguageItem = langCode;
	},
	[ ADD_ERRORS ]( state: RootState, errors: SubmitError[] ): void {
		state.globalErrors.push( ...errors );
	},
	[ ADD_PER_FIELD_ERROR ](
		state: RootState,
		payload: { field: keyof RootState['perFieldErrors']; error: { messageKey: MessageKeys } },
	): void {
		state.perFieldErrors[ payload.field ].push( payload.error );
	},
	[ CLEAR_PER_FIELD_ERRORS ](
		state: RootState,
		payload: keyof RootState['perFieldErrors'],
	): void {
		state.perFieldErrors[ payload ] = [];
	},
	[ CLEAR_ERRORS ]( state: RootState ): void {
		state.globalErrors = [];
	},
};
