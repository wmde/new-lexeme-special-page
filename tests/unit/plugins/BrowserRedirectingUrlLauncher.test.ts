import BrowserRedirectingUrlLauncher from '@/plugins/UrlLauncherPlugin/BrowserRedirectingUrlLauncher';

describe( 'UrlLauncher', () => {
	const location = global.window.location;

	beforeEach( () => {
		Object.defineProperty( global.window, 'location', {
			value: location,
			writable: true,
			configurable: true,
		} );
	} );

	it( 'updates window.location', () => {
		const url = 'https://wiki.example/w/index.php?title=Some_page';
		const router = new BrowserRedirectingUrlLauncher();

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		delete window.location;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		window.location = {};
		const setHrefSpy = jest.fn();
		Object.defineProperty( global.window.location, 'href', {
			set: setHrefSpy,
		} );

		router.goToURL( new URL( url ) );

		expect( setHrefSpy ).toHaveBeenCalledWith( url );
	} );
} );
