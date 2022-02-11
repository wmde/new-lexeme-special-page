import RootState from './RootState';

export const INCREMENT = 'increment';

export default {
	[ INCREMENT ]( state: RootState ): void {
		state.count++;
	},
};
