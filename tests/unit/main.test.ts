import createAndMount from '@/main';
import unusedWikiRouter from '../mocks/unusedWikiRouter';
import unusedItemSearcher from '../mocks/unusedItemSearcher';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';
import unusedLangCodeRetriever from '../mocks/unusedLangCodeRetriever';

describe( 'createAndMount', () => {

	it( 'mounts created app on given selector', () => {
		const rootElement = document.createElement( 'div' );
		rootElement.id = 'test-app';
		document.body.append( rootElement );
		const discardedElement = document.createElement( 'div' );
		rootElement.append( discardedElement );

		const instance = createAndMount( {
			rootSelector: '#test-app',
			licenseUrl: '',
			licenseName: '',
			wikibaseLexemeTermLanguages: new Map( [
				[ 'en', 'English' ],
				[ 'de', 'German' ],
			] ),
		}, {
			itemSearcher: unusedItemSearcher,
			lexemeCreator: unusedLexemeCreator,
			searchLinker: {
				getSearchUrlForLexeme: jest.fn().mockReturnValue( 'https://example.com' ),
			},
			wikiRouter: unusedWikiRouter,
			langCodeRetriever: unusedLangCodeRetriever,
		} );

		expect( rootElement.firstChild ).toBe( instance.$el );
		expect( discardedElement.parentElement ).toBe( null );
	} );

} );
