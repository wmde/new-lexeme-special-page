import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import initStore from '@/store';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';
import unusedLangCodeRetriever from '../mocks/unusedLangCodeRetriever';
import unusedLanguageCodesProvider from '../mocks/unusedLanguageCodesProvider';
import { SearchLinkerKey } from '@/plugins/SearchLinkerPlugin/SearchLinker';
import { Config, ConfigKey } from '@/plugins/ConfigPlugin/Config';
import { WikiRouterKey } from '@/plugins/WikiRouterPlugin/WikiRouter';
import Messages, { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
import DevItemSearcher from '@/data-access/DevItemSearcher';
import DevMessagesRepository from '@/plugins/MessagesPlugin/DevMessagesRepository';

describe( 'App.vue', () => {
	it( 'renders the lemma into search existing link', async () => {
		const store = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: unusedLangCodeRetriever,
			languageCodesProvider: unusedLanguageCodesProvider,
		} );
		const emptyConfig: Config = {
			licenseUrl: '',
			licenseName: '',
			wikibaseLexemeTermLanguages: new Map(),
		};
		const wrapper = mount( App, {
			global: {
				plugins: [ store ],
				provide: {
					[ ConfigKey as symbol ]: emptyConfig,
					[ SearchLinkerKey as symbol ]: {
						getSearchUrlForLexeme: jest.fn().mockReturnValue( 'https://example.com' ),
					},
					[ WikiRouterKey as symbol ]: null,
					[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
				},
			},
		} );
		// const wrapper = mountForm();
		const lemmaInput = wrapper.find( '.wbl-snl-lemma-input input' );

		await lemmaInput.setValue( 'foo' );

		expect( store.state.lemma ).toBe( 'foo' );
	} );
} );
