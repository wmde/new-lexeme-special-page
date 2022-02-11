import { ActionContext, Store } from 'vuex';
import RootState from './RootState';
import { INCREMENT } from './mutations';

export const DELAYED_INCREMENT = 'incrementAsync';

export default {
	async [ DELAYED_INCREMENT ](
		{ commit }: ActionContext<RootState, RootState>,
		{ delay }: { delay: number },
	): Promise<void> {
		await <Promise<void>> new Promise( ( resolve ) => {
			setTimeout( () => resolve(), delay );
		} );
		commit( INCREMENT );
	},
};
