import {
	ComponentPublicInstance,
	createApp,
} from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';

interface Config {
	rootSelector: string;
}

interface State {
	count: number
}

const store = createStore( {
	state(): State {
		return {
			count: 0,
		};
	},
	mutations: {
		increment( state: State ) {
			state.count++;
		},
	},
} );

export default function createAndMount( config: Config ): ComponentPublicInstance {
	return createApp( App )
		.use( store )
		.mount( config.rootSelector );
}
