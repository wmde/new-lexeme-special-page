import createAndMount from '@/main';
import unusedWikiRouter from '../mocks/unusedWikiRouter';
import unusedItemSearcher from '../mocks/unusedItemSearcher';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';

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
			wikibaseLexemeTermLanguages: [ 'test' ],
		}, {
			itemSearcher: unusedItemSearcher,
			lexemeCreator: unusedLexemeCreator,
			wikiRouter: unusedWikiRouter,
		} );

		expect( rootElement.firstChild ).toBe( instance.$el );
		expect( discardedElement.parentElement ).toBe( null );
	} );

} );
