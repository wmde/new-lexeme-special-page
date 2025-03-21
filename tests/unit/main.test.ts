import createAndMount from '@/main';
import unusedTracker from '../mocks/unusedTracker';
import unusedUrlLauncher from '../mocks/unusedUrlLauncher';
import unusedItemSearcher from '../mocks/unusedItemSearcher';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';
import unusedLangCodeRetriever from '../mocks/unusedLangCodeRetriever';

describe( 'createAndMount', () => {

	it( 'mounts created app on given selector', () => {
		const rootElement = document.createElement( 'div' );
		rootElement.id = 'wbl-snl-intro-text-wrapper';
		document.body.append( rootElement );
		const discardedElement = document.createElement( 'div' );
		rootElement.append( discardedElement );

		const instance = createAndMount( {
			rootSelector: '#wbl-snl-intro-text-wrapper',
			isAnonymous: false,
			licenseUrl: '',
			licenseName: '',
			wikibaseLexemeTermLanguages: new Map( [
				[ 'en', 'English' ],
				[ 'de', 'German' ],
			] ),
			lexicalCategorySuggestions: [],
			placeholderExampleData: {
				languageLabel: '',
				lemma: '',
				lexicalCategoryLabel: '',
				spellingVariant: '',
			},
			maxLemmaLength: 1000,
			availableSearchProfiles: [],
			tempUserEnabled: false,
		}, {
			itemSearcher: unusedItemSearcher,
			languageItemSearcher: unusedItemSearcher,
			lexemeCreator: unusedLexemeCreator,
			searchLinker: {
				getSearchUrlForLexeme: jest.fn().mockReturnValue( 'https://example.com' ),
			},
			authenticationLinker: {
				getLoginLink: jest.fn(),
				getCreateAccountLink: jest.fn(),
			},
			tracker: unusedTracker,
			urlLauncher: unusedUrlLauncher,
			langCodeRetriever: unusedLangCodeRetriever,
		} );

		expect( rootElement.firstChild ).toBe( instance.$el );
		expect( discardedElement.parentElement ).toBe( null );
	} );

} );
