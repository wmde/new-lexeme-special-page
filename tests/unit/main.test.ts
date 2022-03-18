import createAndMount from '@/main';
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
		}, {
			itemSearcher: unusedItemSearcher,
			lexemeCreator: unusedLexemeCreator,
		} );

		expect( rootElement.firstChild ).toBe( instance.$el );
		expect( discardedElement.parentElement ).toBe( null );
	} );

} );
