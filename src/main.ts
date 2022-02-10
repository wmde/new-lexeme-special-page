import { createApp } from 'vue';
import App from './App.vue';

interface Config {
	rootSelector: string;
}

export default function createAndMount( config: Config ): void {
	createApp( App )
		.mount( config.rootSelector );
}
