/**
 * This script creates the store with an initial state and exports it.
 *
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import { createStore } from 'vuex';

import actions from './actions';
import mutations from './mutations';
import RootState from './RootState';

export default createStore( {
	state(): RootState {
		return {
			lemma: '',
		};
	},
	mutations,
	actions,
} );
