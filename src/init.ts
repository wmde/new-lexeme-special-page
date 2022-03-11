import createAndMount, {
	Config,
	Services,
} from './main';
import MwMessagesRepository from './mediawiki/MwMessagesRepository';
import { MediaWiki } from './@types/mediawiki';
import { ComponentPublicInstance } from 'vue';

export default function init( config: Config, mw: MediaWiki ): ComponentPublicInstance {
	const messagesRepository = new MwMessagesRepository( mw.message );
	const services: Services = {
		messagesRepository,
	};

	return createAndMount( config, services );
}
