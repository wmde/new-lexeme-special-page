/**
 * This file stores all the actions that can be dispatched to the store.
 * Action names are saved and exported as constants for later use in components.
 *
 * @see https://vuex.vuejs.org/guide/actions.html
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import { ActionContext } from 'vuex';
import RootState from './RootState';
import {
	SET_LEMMA,
	SET_LEXICAL_CATEGORY,
} from './mutations';

type RootContext = ActionContext<RootState, RootState>;

export const UPDATE_LEMMA = 'updateLemma';
export const UPDATE_LEXICAL_CATEGORY = 'updateLexicalCategory';

export default {
	[ UPDATE_LEMMA ]( { commit }: RootContext, lemma: string ): void {
		commit( SET_LEMMA, lemma );
	},
	[ UPDATE_LEXICAL_CATEGORY ]( { commit }: RootContext, lexicalCategory: string ): void {
		commit( SET_LEXICAL_CATEGORY, lexicalCategory );
	},
};
