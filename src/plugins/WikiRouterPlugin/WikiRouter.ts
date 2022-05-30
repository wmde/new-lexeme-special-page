import { inject, InjectionKey } from 'vue';

export default interface WikiRouter {
	/**
	 * Go to the wiki page with the given title.
	 *
	 * @param title The title (with namespace, if any).
	 * @return A Promise that does not resolve until the navigation is finished.
	 * A real implementation should never resolve the promise,
	 * because by the time navigation finishes,
	 * the page that called this function will no longer be executing JavaScript.
	 * However, a dev implementation may resolve the promise.
	 */
	goToTitle( title: string ): Promise<void>;
}

export const WikiRouterKey: InjectionKey<WikiRouter> = Symbol( 'WikiRouter' );

export function useWikiRouter(): WikiRouter {
	return inject( WikiRouterKey, () => {
		throw new Error( 'No WikiRouter provided!' );
	}, true );
}
