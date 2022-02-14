import {
	ComponentPublicInstance,
	createApp,
} from 'vue';
import store from './store';
import App from './App.vue';

interface Config {
	rootSelector: string;
}

export default function createAndMount( config: Config ): ComponentPublicInstance {
	return createApp( App )
		.use( store )
		.mount( config.rootSelector );
}
