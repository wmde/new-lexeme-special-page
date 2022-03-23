import ItemSearcher from '@/data-access/ItemSearcher';
import LexemeCreator from '@/data-access/LexemeCreator';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
import { Config, ConfigKey } from '@/plugins/ConfigPlugin/Config';
import {
	ComponentPublicInstance,
	createApp,
} from 'vue';
import initStore from './store';
import App from './App.vue';
import Messages, { MessagesKey } from './plugins/MessagesPlugin/Messages';
import MessagesRepository from './plugins/MessagesPlugin/MessagesRepository';
import { WikiRouterKey } from './plugins/WikiRouterPlugin/WikiRouter';
import WikiRouter from './plugins/WikiRouterPlugin/WikiRouter';

export interface CreateAndMountConfig extends Config {
	rootSelector: string;
}

export interface Services {
	itemSearcher: ItemSearcher;
	messagesRepository?: MessagesRepository;
	lexemeCreator: LexemeCreator;
	wikiRouter: WikiRouter;
}

export default function createAndMount(
	config: CreateAndMountConfig,
	services: Services,
): ComponentPublicInstance {
	const app = createApp( App );
	const store = initStore( services );
	app.use( store );

	app.provide( ConfigKey, config );
	app.provide( MessagesKey, new Messages( services.messagesRepository ) );
	app.provide( ItemSearchKey, services.itemSearcher );
	app.provide( WikiRouterKey, services.wikiRouter );

	return app.mount( config.rootSelector );
}
