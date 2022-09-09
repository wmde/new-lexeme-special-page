import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import SearchExisting from '@/components/SearchExisting.vue';
import initStore from '@/store';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';
import unusedLangCodeRetriever from '../mocks/unusedLangCodeRetriever';
import unusedLanguageCodesProvider from '../mocks/unusedLanguageCodesProvider';
import unusedTracker from '../mocks/unusedTracker';
import { SearchLinkerKey } from '@/plugins/SearchLinkerPlugin/SearchLinker';
import { Config, ConfigKey } from '@/plugins/ConfigPlugin/Config';
import { WikiRouterKey } from '@/plugins/WikiRouterPlugin/WikiRouter';
import Messages, { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
import DevItemSearcher from '@/data-access/DevItemSearcher';
import DevMessagesRepository from '@/plugins/MessagesPlugin/DevMessagesRepository';
import MediaWikiSearchLinker from '@/plugins/SearchLinkerPlugin/MediaWikiSearchLinker';
import { LanguageItemSearchKey } from '@/plugins/ItemSearchPlugin/LanguageItemSearch';

describe( 'App.vue', () => {

	beforeEach( () => {
		// create teleport target
		const el = document.createElement( 'div' );
		el.id = 'wbl-snl-intro-text-wrapper';
		document.body.appendChild( el );
	} );

	afterEach( () => {
		// clean up
		document.body.outerHTML = '';
	} );

	it( 'renders the lemma into search existing link', async () => {
		const store = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: unusedLangCodeRetriever,
			languageCodesProvider: unusedLanguageCodesProvider,
			tracker: unusedTracker,
		} );
		const emptyConfig: Config = {
			isAnonymous: false,
			licenseUrl: '',
			licenseName: '',
			wikibaseLexemeTermLanguages: new Map(),
			lexicalCategorySuggestions: [],
			placeholderExampleData: {
				languageLabel: '',
				lemma: '',
				lexicalCategoryLabel: '',
				spellingVariant: '',
			},
			maxLemmaLength: 1000,
			availableSearchProfiles: [],
		};
		const lexemeNS = 146;
		const testUrl = 'https://example.com';
		const mwUtilGetUrl = jest.fn().mockReturnValue( testUrl );
		const wrapper = mount( App, {
			global: {
				plugins: [ store ],
				provide: {
					[ ConfigKey as symbol ]: emptyConfig,
					[ SearchLinkerKey as symbol ]: new MediaWikiSearchLinker(
						mwUtilGetUrl,
						lexemeNS,
					),
					[ WikiRouterKey as symbol ]: null,
					[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageItemSearchKey as symbol ]: new DevItemSearcher(),
				},
			},
		} );

		const lemmaInput = wrapper.find( '.wbl-snl-lemma-input input' );

		await lemmaInput.setValue( 'foo' );

		expect( store.state.lemma ).toBe( 'foo' );
		expect( wrapper.getComponent( SearchExisting ).html() ).toContain( testUrl );
		expect( mwUtilGetUrl ).toHaveBeenNthCalledWith( 2, 'Special:Search', { search: 'foo', [ `ns${lexemeNS}` ]: 1 } );
	} );
} );
