import {
	ComponentPublicInstance,
	createApp,
} from 'vue';
import store from './store';
import App from './App.vue';
import Messages, { MessagesKey } from './plugins/MessagesPlugin/Messages';
import MessagesRepository from './plugins/MessagesPlugin/MessagesRepository';

interface Config {
	rootSelector: string;
}

export default function createAndMount(
	config: Config,
	messageRepo?: MessagesRepository,
): ComponentPublicInstance {
	const app = createApp( App );
	app.use( store );

	app.provide( MessagesKey, new Messages( messageRepo ) );

	return app.mount( config.rootSelector );
}
