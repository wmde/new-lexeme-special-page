import { inject, InjectionKey } from 'vue';

export default interface UrlLauncher {
	/**
	 * Go to the target URL
	 *
	 * @param target The target URL.
	 * @return A Promise that does not resolve until the navigation is finished.
	 * A real implementation should never resolve the promise,
	 * because by the time navigation finishes,
	 * the page that called this function will no longer be executing JavaScript.
	 * However, a dev implementation may resolve the promise.
	 */
	goToURL( target: URL ): Promise<void>;
}

export const UrlLauncherKey: InjectionKey<UrlLauncher> = Symbol( 'UrlLauncher' );

export function useUrlLauncher(): UrlLauncher {
	return inject( UrlLauncherKey, () => {
		throw new Error( 'No UrlLauncher provided!' );
	}, true );
}
