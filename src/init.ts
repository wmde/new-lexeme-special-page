import MwApiItemSearcher from '@/data-access/MwApiItemSearcher';
import createAndMount, {
	CreateAndMountConfig,
	Services,
} from './main';
import MwApiLexemeCreator from './data-access/MwApiLexemeCreator';
import MwMessagesRepository from './plugins/MessagesPlugin/MwMessagesRepository';
import { MediaWiki } from './@types/mediawiki';
import { ComponentPublicInstance } from 'vue';
import MediaWikiRouter from './plugins/WikiRouterPlugin/MediaWikiRouter';
import MwApiLangCodeRetriever from './data-access/MwApiLangCodeRetriever';

interface InitConfig extends CreateAndMountConfig {
	tags: string[];
}

export default function init( config: InitConfig, mw: MediaWiki ): ComponentPublicInstance {
	const languageCode = mw.config.get( 'wgUserLanguage' ) as string;
	const api = new mw.Api( {
		parameters: {
			formatversion: 2,
			uselang: languageCode,
			errorformat: 'html',
		},
	} );

	const itemSearcher = new MwApiItemSearcher( api, languageCode );
	const langCodeRetriever = new MwApiLangCodeRetriever( api, /* FIXME: replace with config value */ 'P218' );
	const messagesRepository = new MwMessagesRepository( mw.message );
	const lexemeCreator = new MwApiLexemeCreator( api, config.tags );
	const wikiRouter = new MediaWikiRouter( mw.util.getUrl );

	const services: Services = {
		itemSearcher,
		langCodeRetriever,
		messagesRepository,
		lexemeCreator,
		wikiRouter,
	};

	return createAndMount( config, services );
}
