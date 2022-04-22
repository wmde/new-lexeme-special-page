import LanguageCodesProvider from '@/data-access/LanguageCodesProvider';
import { ConfigKey } from '@/plugins/ConfigPlugin/Config';
import { LanguageCodesProviderKey } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import { mount } from '@vue/test-utils';
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import initStore from '@/store';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
import DevItemSearcher from '@/data-access/DevItemSearcher';
import { WikiRouterKey } from '@/plugins/WikiRouterPlugin/WikiRouter';
import unusedLangCodeRetriever from '../mocks/unusedLangCodeRetriever';
import unusedLanguageCodesProvider from '../mocks/unusedLanguageCodesProvider';
import { nextTick } from 'vue';
import Messages, { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import DevMessagesRepository from '@/plugins/MessagesPlugin/DevMessagesRepository';

jest.mock( 'lodash/debounce', () => jest.fn( ( fn ) => fn ) );

describe( 'NewLexemeForm', () => {
	let store: ReturnType<typeof initStore>;
	beforeEach( () => {
		store = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: unusedLangCodeRetriever,
			languageCodesProvider: unusedLanguageCodesProvider,
		} );
	} );

	function mountForm() {
		return mount( NewLexemeForm, {
			global: {
				plugins: [ store ],
				provide: {
					[ ConfigKey as symbol ]: {},
					[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageCodesProviderKey as symbol ]: {
						getLanguageCodes: () => [ 'en', 'en-ca', 'de' ],
					},
					[ WikiRouterKey as symbol ]: null,
				},
			},
		} );
	}

	it( 'updates the store if something is entered into the lemma input', async () => {
		const wrapper = mountForm();
		const lemmaInput = wrapper.find( '.wbl-snl-lemma-input input' );

		await lemmaInput.setValue( 'foo' );

		expect( store.state.lemma ).toBe( 'foo' );
	} );

	it( 'updates the store if something is entered into the language input', async () => {
		const testStore = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'de' ) },
			languageCodesProvider: {
				isValid: jest.fn().mockReturnValue( true ),
				getLanguages: jest.fn(),
			},
		} );

		const wrapper = mount( NewLexemeForm, {
			global: {
				plugins: [ testStore ],
				provide: {
					[ ConfigKey as symbol ]: {},
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageCodesProviderKey as symbol ]: {},
					[ WikiRouterKey as symbol ]: null,
				},
			},
		} );

		const languageLookup = wrapper.find( '.wbl-snl-language-lookup input' );

		await languageLookup.setValue( '=Q123' );
		await wrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( wrapper.find( '.wbl-snl-spelling-variant-lookup' ).exists() ).toBe( false );
		expect( testStore.state.language ).toBe( 'Q123' );
		expect( testStore.state.languageCodeFromLanguageItem ).toBe( 'de' );

		await languageLookup.setValue( '=Q12' );
		// don’t click any option ⇒ nothing actually selected

		expect( wrapper.find( '.wbl-snl-spelling-variant-lookup' ).exists() ).toBe( false );
		expect( testStore.state.language ).toBe( null );
		expect( testStore.state.languageCodeFromLanguageItem ).toBe( undefined );
	} );

	it( 'shows warning message if language code is not valid', async () => {
		const languageCodesProvider: LanguageCodesProvider = {
			isValid: jest.fn().mockReturnValue( false ),
			getLanguages: jest.fn().mockReturnValue( new Map() ),
		};
		const testStore = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'invalid' ) },
			languageCodesProvider: languageCodesProvider,
		} );

		const wrapper = mount( NewLexemeForm, {
			global: {
				plugins: [ testStore ],
				provide: {
					[ ConfigKey as symbol ]: {},
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageCodesProviderKey as symbol ]: languageCodesProvider,
					[ WikiRouterKey as symbol ]: null,
				},
			},
		} );

		const languageLookup = wrapper.find( '.wbl-snl-language-lookup input' );
		await languageLookup.setValue( '=Q123' );
		await wrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );
		await nextTick();

		expect( testStore.state.languageCodeFromLanguageItem ).toBe( false );

		const warning = wrapper.find( '.wikit-ValidationMessage--warning' );
		expect( warning.exists() ).toBe( true );
	} );

	it( 'updates the store if something is entered into the lexical category input', async () => {
		const wrapper = mountForm();
		const lexicalCategoryInput = wrapper.find( '.wbl-snl-lexical-category-lookup input' );

		await lexicalCategoryInput.setValue( '=Q456' );
		await wrapper.find( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( store.state.lexicalCategory ).toBe( 'Q456' );
	} );

	it( 'updates the store if a language is selected in the spelling variant input', async () => {
		const languageCodesProvider: LanguageCodesProvider = {
			isValid: jest.fn().mockReturnValue( true ),
			getLanguages: jest.fn().mockReturnValue( new Map( [ [ 'de', 'German' ] ] ) ),
		};
		const testStore = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( null ) },
			languageCodesProvider: languageCodesProvider,
		} );

		const wrapper = mount( NewLexemeForm, {
			global: {
				plugins: [ testStore ],
				provide: {
					[ ConfigKey as symbol ]: {},
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageCodesProviderKey as symbol ]: languageCodesProvider,
					[ WikiRouterKey as symbol ]: null,
					[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
				},
			},
		} );

		const languageLookup = wrapper.find( '.wbl-snl-language-lookup input' );
		await languageLookup.setValue( '=Q123' );
		await wrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );
		await nextTick();

		const warning = wrapper.find( '.wikit-ValidationMessage--warning' );
		expect( warning.exists() ).toBe( false );

		const spellingVariantLookup = wrapper.find( '.wbl-snl-spelling-variant-lookup input' );

		await spellingVariantLookup.setValue( 'de' );

		await wrapper.find( '.wbl-snl-spelling-variant-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( testStore.state.spellingVariant ).toBe( 'de' );
	} );

	it( 'calls the API to create the Lexeme and then redirects to it', async () => {
		const createLexeme = jest.fn().mockReturnValue( 'L123' );
		const goToTitle = jest.fn();
		const testStore = initStore( {
			lexemeCreator: { createLexeme },
			langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'de' ) },
			languageCodesProvider: {
				isValid: jest.fn().mockReturnValue( true ),
				getLanguages: jest.fn(),
			},
		} );
		const wrapper = mount( NewLexemeForm, {
			global: {
				plugins: [ testStore ],
				provide: {
					[ ConfigKey as symbol ]: {},
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageCodesProviderKey as symbol ]: {},
					[ WikiRouterKey as symbol ]: { goToTitle },
				},
			},
		} );

		const lemmaInput = wrapper.find( '.wbl-snl-lemma-input input' );
		await lemmaInput.setValue( 'foo' );

		const languageInput = wrapper.find( '.wbl-snl-language-lookup input' );
		await languageInput.setValue( '=Q123' );
		await wrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		const spellingVariantInput = wrapper.find( '.wbl-snl-spelling-variant-lookup input' );
		expect( spellingVariantInput.exists() ).toBe( false );

		const lexicalCategoryInput = wrapper.find( '.wbl-snl-lexical-category-lookup input' );
		await lexicalCategoryInput.setValue( '=Q456' );
		await wrapper.find( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		await wrapper.trigger( 'submit' );

		expect( createLexeme ).toHaveBeenCalledWith( 'foo', 'de', 'Q123', 'Q456' );
		expect( goToTitle ).toHaveBeenCalledWith( 'Special:EntityPage/L123' );
	} );

	it( 'calls the API to create the Lexeme and then redirects to it', async () => {
		const createLexeme = jest.fn().mockReturnValue( 'L123' );
		const goToTitle = jest.fn();
		const testStore = initStore( {
			lexemeCreator: { createLexeme },
			langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( null ) },
			languageCodesProvider: unusedLanguageCodesProvider,
		} );
		const wrapper = mount( NewLexemeForm, {
			global: {
				plugins: [ testStore ],
				provide: {
					[ ConfigKey as symbol ]: {},
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageCodesProviderKey as symbol ]: {
						getLanguages: () => new Map( [ [ 'en-gb', 'British English' ] ] ),
					},
					[ WikiRouterKey as symbol ]: { goToTitle },
					[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
				},
			},
		} );

		const lemmaInput = wrapper.find( '.wbl-snl-lemma-input input' );
		await lemmaInput.setValue( 'foo' );

		const languageInput = wrapper.find( '.wbl-snl-language-lookup input' );
		await languageInput.setValue( '=Q123' );
		await wrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		await nextTick();

		// will actually select en-gb, en is not in wikibaseLexemeTermLanguages
		const spellingVariantInput = wrapper.find( '.wbl-snl-spelling-variant-lookup input' );
		await spellingVariantInput.setValue( 'en' );
		await wrapper.find( '.wbl-snl-spelling-variant-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		const lexicalCategoryInput = wrapper.find( '.wbl-snl-lexical-category-lookup input' );
		await lexicalCategoryInput.setValue( '=Q456' );
		await wrapper.find( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		await wrapper.trigger( 'submit' );

		expect( createLexeme ).toHaveBeenCalledWith( 'foo', 'en-gb', 'Q123', 'Q456' );
		expect( goToTitle ).toHaveBeenCalledWith( 'Special:EntityPage/L123' );
	} );
} );
