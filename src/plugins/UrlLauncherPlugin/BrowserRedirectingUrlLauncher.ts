import UrlLauncher from './UrlLauncher';

/**
 * The plugin performs a redirect away from the current
 * page. It returns a promise that never returns, because
 * the browser window reloads. In test contexts, this
 * can be stubbed to make assertions about the target
 * URL.
 */
export default class BrowserRedirectingUrlLauncher implements UrlLauncher {
	public goToURL( url: URL ): Promise<never> {
		window.location.href = url.toString();
		return new Promise( ( _resolve ) => {
			// never resolve
		} );
	}
}
