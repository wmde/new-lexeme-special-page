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

import LexemeCreator from '@/data-access/LexemeCreator';
import {
	ActionContext,
	ActionTree,
} from 'vuex';
import { ADD_ERRORS, CLEAR_ERRORS } from './mutations';
import RootState from './RootState';
/*
import {
	MUTATION_NAME,
} from './mutations';
*/

type RootContext = ActionContext<RootState, RootState>;
type RootActions = ActionTree<RootState, RootState>;

export const CREATE_LEXEME = 'createLexeme';

export default function createActions( lexemeCreator: LexemeCreator ): RootActions {
	return {
		async [ CREATE_LEXEME ]( { state, commit }: RootContext ): Promise<string> {
			commit( CLEAR_ERRORS );
			try {
				const lexemeId = await lexemeCreator.createLexeme(
					state.lemma,
					state.spellingVariant,
					state.language,
					state.lexicalCategory,
				);
				return lexemeId;
			} catch ( errors ) {
				commit( ADD_ERRORS, errors );
				return Promise.reject( null );
			}
		},
	};
}
