import MediaWikiRouter from '@/plugins/WikiRouterPlugin/MediaWikiRouter';

describe( 'MediaWikiRouter', () => {
	const location = global.window.location;

	beforeEach( () => {
		Object.defineProperty( global.window, 'location', {
			value: location,
			writable: true,
			configurable: true,
		} );
	} );

	it( 'delegates to mw.util.getUrl', () => {
		const title = 'Some page';
		const url = '/w/index.php?title=Some_page';
		const getUrlMock = jest.fn().mockReturnValue( url );
		const router = new MediaWikiRouter( getUrlMock );

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

		router.goToTitle( title );

		expect( getUrlMock ).toHaveBeenCalledWith( title );
		expect( setHrefSpy ).toHaveBeenCalledWith( url );
	} );
} );
