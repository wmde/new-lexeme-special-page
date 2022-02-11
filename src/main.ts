import {
	ComponentPublicInstance,
	createApp,
} from 'vue';
import App from './App.vue';

interface Config {
	rootSelector: string;
}

export default function createAndMount( config: Config ): ComponentPublicInstance {
	return createApp( App )
		.mount( config.rootSelector );
}
