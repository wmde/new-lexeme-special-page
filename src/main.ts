import ItemSearcher from '@/data-access/ItemSearcher';
import LexemeCreator from '@/data-access/LexemeCreator';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
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

export interface Config {
	rootSelector: string;
	licenseUrl?: string;
	licenseName?: string;
}

export interface Services {
	itemSearcher: ItemSearcher;
	messagesRepository?: MessagesRepository;
	lexemeCreator: LexemeCreator;
	wikiRouter: WikiRouter;
}

export default function createAndMount(
	config: Config,
	services: Services,
): ComponentPublicInstance {
	const app = createApp( App );
	const store = initStore( config, services );
	app.use( store );

	app.provide( MessagesKey, new Messages( services.messagesRepository ) );
	app.provide( ItemSearchKey, services.itemSearcher );
	app.provide( WikiRouterKey, services.wikiRouter );

	return app.mount( config.rootSelector );
}
