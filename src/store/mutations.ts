/**
 * This file stores all the mutations that can be committed to the store.
 * Mutation names are saved and exported as constants for later use in components.
 *
 * @see https://vuex.vuejs.org/guide/mutations.html
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import RootState, { SubmitError } from './RootState';

export const SET_LEMMA = 'setLemma';
export const SET_LANGUAGE = 'setLanguage';
export const SET_LEXICAL_CATEGORY = 'setLexicalCategory';
export const SET_SPELLING_VARIANT = 'setSpellingVariant';
export const ADD_ERRORS = 'addErrors';
export const CLEAR_ERRORS = 'clearErrors';

export default {
	[ SET_LEMMA ]( state: RootState, lemma: string ): void {
		state.lemma = lemma;
	},
	[ SET_LANGUAGE ]( state: RootState, language: string ): void {
		state.language = language;
	},
	[ SET_LEXICAL_CATEGORY ]( state: RootState, lexicalCategory: string ): void {
		state.lexicalCategory = lexicalCategory;
	},
	[ SET_SPELLING_VARIANT ]( state: RootState, spellingVariant: string ): void {
		state.spellingVariant = spellingVariant;
	},
	[ ADD_ERRORS ]( state: RootState, errors: SubmitError[] ): void {
		state.globalErrors.push( ...errors );
	},
	[ CLEAR_ERRORS ]( state: RootState ): void {
		state.globalErrors = [];
	},
};
