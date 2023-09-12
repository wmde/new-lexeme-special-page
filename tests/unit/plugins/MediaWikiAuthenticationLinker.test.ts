import MediaWikiAuthenticationLinker from '@/plugins/AuthenticationLinkerPlugin/MediaWikiAuthenticationLinker';

describe( 'MediaWikiAuthenticationLinker', () => {
	it( 'delegates to mw.util.getUrl for getting the login url', () => {
		const url = '/w/index.php?title=Special:UserLogin&returnto=Special%3ANewLexeme';
		const getUrlMock = jest.fn().mockReturnValue( url );
		const authenticationLinker = new MediaWikiAuthenticationLinker( getUrlMock, 'Special:NewLexeme' );

		expect( authenticationLinker.getLoginLink() ).toBe( url );
		expect( getUrlMock ).toHaveBeenCalledWith( 'Special:UserLogin', {
			returnto: 'Special:NewLexeme',
		} );
	} );

	it( 'delegates to mw.util.getUrl for getting the create account url', () => {
		const url = '/w/index.php?title=Special:CreateAccount&returnto=Special%3ANewLexeme';
		const getUrlMock = jest.fn().mockReturnValue( url );
		const authenticationLinker = new MediaWikiAuthenticationLinker( getUrlMock, 'Special:NewLexeme' );

		expect( authenticationLinker.getCreateAccountLink() ).toBe( url );
		expect( getUrlMock ).toHaveBeenCalledWith( 'Special:CreateAccount', {
			returnto: 'Special:NewLexeme',
		} );
	} );
} );
