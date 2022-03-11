import createAndMount, {
	Config,
	Services,
} from './main';
import MwApiLexemeCreator from './mediawiki/MwApiLexemeCreator';
import MwMessagesRepository from './mediawiki/MwMessagesRepository';
import { MediaWiki } from './@types/mediawiki';
import { ComponentPublicInstance } from 'vue';

export default function init( config: Config, mw: MediaWiki ): ComponentPublicInstance {
	const messagesRepository = new MwMessagesRepository( mw.message );
	const lexemeCreator = new MwApiLexemeCreator( new mw.Api() );
	const services: Services = {
		messagesRepository,
		lexemeCreator,
	};

	return createAndMount( config, services );
}
