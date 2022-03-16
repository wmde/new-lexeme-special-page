import createAndMount, {
	Config,
	Services,
} from './main';
import MwApiLexemeCreator from './mediawiki/MwApiLexemeCreator';
import MwMessagesRepository from './mediawiki/MwMessagesRepository';
import { MediaWiki } from './@types/mediawiki';
import { ComponentPublicInstance } from 'vue';

interface InitConfig extends Config {
	tags: string[];
}

export default function init( config: InitConfig, mw: MediaWiki ): ComponentPublicInstance {
	const messagesRepository = new MwMessagesRepository( mw.message );
	const lexemeCreator = new MwApiLexemeCreator( new mw.Api(), config.tags );
	const services: Services = {
		messagesRepository,
		lexemeCreator,
	};

	return createAndMount( config, services );
}
