/**
 * This file stores all the actions that can be dispatched to the store.
 * Action names are saved and exported as constants for later use in components.
 *
 * @see https://vuex.vuejs.org/guide/actions.html
 * @see https://vuex.vuejs.org/guide/structure.html
 */

import { ActionContext } from 'vuex';
import RootState from './RootState';
import { INCREMENT } from './mutations';

type RootContext = ActionContext<RootState, RootState>;

// TODO: Remove this example action once the first store action is implemented.
export const DELAYED_INCREMENT = 'incrementAsync';

export default {
	async [ DELAYED_INCREMENT ](
		{ commit }: RootContext,
		{ delay }: { delay: number },
	): Promise<void> {
		await <Promise<void>> new Promise( ( resolve ) => {
			setTimeout( () => resolve(), delay );
		} );
		commit( INCREMENT );
	},
};
