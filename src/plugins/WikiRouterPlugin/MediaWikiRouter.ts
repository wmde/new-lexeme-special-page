import WikiRouter from './WikiRouter';
import { MwUtilGetUrl } from '@/@types/mediawiki';
import {
	inject,
	InjectionKey,
} from 'vue';

export default class MediaWikiRouter implements WikiRouter {

	private readonly getUrl: MwUtilGetUrl;

	/**
	 * This uses the standard Mediawiki utility, because that is simpler than constructing it
	 * ourselves out of multiple pieces of config.
	 *
	 * @param {MwUtilGetUrl} getUrl
	 */
	public constructor(
		getUrl: MwUtilGetUrl,
	) {
		this.getUrl = getUrl;
	}

	public goToTitle( title: string, params?: Record<string, unknown> ): void {
		window.location.href = this.getPageUrl( title, params );
	}

	private getPageUrl( title: string, params?: Record<string, unknown> ): string {
		return this.getUrl( title, params );
	}

}

export const WikiRouterKey: InjectionKey<WikiRouter> = Symbol( 'WikiRouter' );

export function useWikiRouter(): WikiRouter {
	return inject( WikiRouterKey, () => {
		throw new Error( 'No WikiRouter provided!' );
	}, true );
}
