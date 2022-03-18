import createAndMount, {
	Config,
	Services,
} from './main';
import MwApiLexemeCreator from './data-access/MwApiLexemeCreator';
import MwMessagesRepository from './plugins/MessagesPlugin/MwMessagesRepository';
import { MediaWiki } from './@types/mediawiki';
import { ComponentPublicInstance } from 'vue';

interface InitConfig extends Config {
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

	const messagesRepository = new MwMessagesRepository( mw.message );
	const lexemeCreator = new MwApiLexemeCreator( api, config.tags );
	const services: Services = {
		messagesRepository,
		lexemeCreator,
	};

	return createAndMount( config, services );
}
