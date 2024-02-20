import MwApiItemSearcher from '@/data-access/MwApiItemSearcher';
import MediaWikiSearchLinker from '@/plugins/SearchLinkerPlugin/MediaWikiSearchLinker';
import MwTracker from '@/data-access/tracking/MwTracker';
import createAndMount, {
	CreateAndMountConfig,
	Services,
} from './main';
import MwApiLexemeCreator from './data-access/MwApiLexemeCreator';
import MwMessagesRepository from './plugins/MessagesPlugin/MwMessagesRepository';
import { MediaWiki } from './@types/mediawiki';
import { ComponentPublicInstance } from 'vue';
import BrowserRedirectingUrlLauncher from '@/plugins/UrlLauncherPlugin/BrowserRedirectingUrlLauncher';
import MwApiLangCodeRetriever from './data-access/MwApiLangCodeRetriever';
import LanguageItemSearcher from '@/data-access/LanguageItemSearcher';
import MediaWikiAuthenticationLinker from '@/plugins/AuthenticationLinkerPlugin/MediaWikiAuthenticationLinker';

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
	const languageItemSearcher = new LanguageItemSearcher(
		itemSearcher,
		config.availableSearchProfiles,
	);
	const langCodeRetriever = new MwApiLangCodeRetriever( api, mw.config.get( 'LexemeLanguageCodePropertyId' ) as string );
	const messagesRepository = new MwMessagesRepository( mw.message );
	const lexemeCreator = new MwApiLexemeCreator( api, mw.util.getUrl, config.tags );
	const searchLinker = new MediaWikiSearchLinker(
		mw.util.getUrl,
		( mw.config.get( 'wgNamespaceIds' ) as Record<string, number> ).lexeme,
	);
	const authenticationLinker = new MediaWikiAuthenticationLinker(
		mw.util.getUrl,
		mw.config.get( 'wgPageName' ) as string,
	);
	const tracker = new MwTracker( mw.track );
	const urlLauncher = new BrowserRedirectingUrlLauncher();

	const services: Services = {
		itemSearcher,
		languageItemSearcher,
		langCodeRetriever,
		messagesRepository,
		lexemeCreator,
		searchLinker,
		authenticationLinker,
		tracker,
		urlLauncher,
	};

	return createAndMount( config, services );
}
