import LexemeCreator from '@/data-access/LexemeCreator';
import {
	ComponentPublicInstance,
	createApp,
} from 'vue';
import initStore from './store';
import App from './App.vue';
import Messages, { MessagesKey } from './plugins/MessagesPlugin/Messages';
import MessagesRepository from './plugins/MessagesPlugin/MessagesRepository';

export interface Config {
	rootSelector: string;
	token: string;
	licenseUrl?: string;
	licenseName?: string;
}

export interface Services {
	messagesRepository?: MessagesRepository;
	lexemeCreator: LexemeCreator;
}

export default function createAndMount(
	config: Config,
	services: Services,
): ComponentPublicInstance {
	const app = createApp( App );
	const store = initStore( config, services );
	app.use( store );

	app.provide( MessagesKey, new Messages( services.messagesRepository ) );

	return app.mount( config.rootSelector );
}
