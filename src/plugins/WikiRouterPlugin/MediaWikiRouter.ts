import WikiRouter from './WikiRouter';
import { MwUtilGetUrl } from '@/@types/mediawiki';
import {
	inject,
	InjectionKey,
} from 'vue';

export default class MediaWikiRouter implements WikiRouter {

	private readonly getUrl: MwUtilGetUrl;

	/**
	 * The plugin uses a utilty to generate wiki urls from a wiki
	 * page's title and ensure urls are consistent with various 
	 * mediawiki instances without relying on config variables or
	 * constructing the url within the class itself.
	 * 
	 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-getUrl
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
