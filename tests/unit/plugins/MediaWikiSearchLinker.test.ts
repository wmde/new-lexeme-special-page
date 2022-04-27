import MediaWikiSearchLinker from '@/plugins/SearchLinkerPlugin/MediaWikiSearchLinker';

describe( 'MediaWikiSearchLinker', () => {
	it( 'delegates to mw.util.getUrl', () => {
		const url = '/w/index.php?title=Special:Search&search=abc&ns146=1';
		const getUrlMock = jest.fn().mockReturnValue( url );
		const searchLinker = new MediaWikiSearchLinker( getUrlMock, 146 );

		expect( searchLinker.getSearchUrlForLexeme( 'abc' ) ).toBe( url );
		expect( getUrlMock ).toHaveBeenCalledWith( 'Special:Search', {
			search: 'abc',
			ns146: 1,
		} );
	} );
} );
