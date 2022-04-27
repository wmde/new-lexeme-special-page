import ItemSearcher from '@/data-access/ItemSearcher';
import LexemeCreator from '@/data-access/LexemeCreator';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
import { Config, ConfigKey } from '@/plugins/ConfigPlugin/Config';
import SearchLinker, { SearchLinkerKey } from '@/plugins/SearchLinkerPlugin/SearchLinker';
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
import { MapLanguageCodesProvider } from './data-access/LanguageCodesProvider';

export interface CreateAndMountConfig extends Config {
	rootSelector: string;
}

export interface Services {
	itemSearcher: ItemSearcher;
	messagesRepository?: MessagesRepository;
	langCodeRetriever: LangCodeRetriever;
	lexemeCreator: LexemeCreator;
	searchLinker: SearchLinker;
	wikiRouter: WikiRouter;
}

export default function createAndMount(
	config: CreateAndMountConfig,
	services: Services,
): ComponentPublicInstance {
	const app = createApp( App );
	const languageCodesProvider = new MapLanguageCodesProvider(
		config.wikibaseLexemeTermLanguages,
	);
	const store = initStore( { ...services, languageCodesProvider } );
	app.use( store );

	app.provide( ConfigKey, config );
	app.provide( MessagesKey, new Messages( services.messagesRepository ) );
	app.provide( ItemSearchKey, services.itemSearcher );
	app.provide( SearchLinkerKey, services.searchLinker );
	app.provide( WikiRouterKey, services.wikiRouter );
	app.provide(
		LanguageCodesProviderKey,
		languageCodesProvider,
	);

	return app.mount( config.rootSelector );
}
