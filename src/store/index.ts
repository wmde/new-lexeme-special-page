import { createStore } from 'vuex';

import actions from './actions';
import mutations from './mutations';
import RootState from './RootState';

export default createStore( {
	state(): RootState {
		return {
			count: 0,
		};
	},
	mutations,
	actions,
} );
