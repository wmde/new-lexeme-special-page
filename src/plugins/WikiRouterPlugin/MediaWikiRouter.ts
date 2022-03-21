import WikiRouter from './WikiRouter';
import { MwUtilGetUrl } from '@/@types/mediawiki';
import {
	inject,
	InjectionKey,
} from 'vue';

export default class MediaWikiRouter implements WikiRouter {

	private readonly getUrl: MwUtilGetUrl;

	public constructor(
		getUrl: MwUtilGetUrl,
	) {
		this.getUrl = getUrl;
	}

	public getPageUrl( title: string, params?: Record<string, unknown> ): string {
		return this.getUrl( title, params );
	}

	public goToTitle( title: string, params?: Record<string, unknown> ): void {
		window.location.href = this.getPageUrl( title, params );
	}

}

export const WikiRouterKey: InjectionKey<WikiRouter> = Symbol( 'WikiRouter' );

export function useWikiRouter(): WikiRouter {
	return inject( WikiRouterKey, () => {
		throw new Error( 'No WikiRouter provided!' );
	}, true );
}
