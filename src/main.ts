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
import LangCodeRetriever from './data-access/LangCodeRetriever';
import { LanguageCodesProviderKey } from './plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import { ListLanguageCodesProvider } from './data-access/LanguageCodesProvider';

export interface CreateAndMountConfig extends Config {
	rootSelector: string;
}

export interface Services {
	itemSearcher: ItemSearcher;
	messagesRepository?: MessagesRepository;
	langCodeRetriever: LangCodeRetriever;
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
	app.provide(
		LanguageCodesProviderKey,
		new ListLanguageCodesProvider( config.wikibaseLexemeTermLanguages ),
	);

	return app.mount( config.rootSelector );
}
