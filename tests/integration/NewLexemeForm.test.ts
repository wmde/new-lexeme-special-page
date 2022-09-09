import LanguageCodesProvider from '@/data-access/LanguageCodesProvider';
import { Config, ConfigKey } from '@/plugins/ConfigPlugin/Config';
import { LanguageCodesProviderKey } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import initStore, { StoreServices } from '@/store';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
import DevItemSearcher from '@/data-access/DevItemSearcher';
import { WikiRouterKey } from '@/plugins/WikiRouterPlugin/WikiRouter';
import unusedLangCodeRetriever from '../mocks/unusedLangCodeRetriever';
import unusedLanguageCodesProvider from '../mocks/unusedLanguageCodesProvider';
import unusedTracker from '../mocks/unusedTracker';
import { nextTick } from 'vue';
import Messages, { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import DevMessagesRepository from '@/plugins/MessagesPlugin/DevMessagesRepository';
import { LanguageItemSearchKey } from '@/plugins/ItemSearchPlugin/LanguageItemSearch';

jest.mock( 'lodash/debounce', () => jest.fn( ( fn ) => fn ) );

describe( 'NewLexemeForm', () => {
	let store: ReturnType<typeof initStore>;

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

	function mountForm( storeServices: Partial<StoreServices> = {}, pluginOverrides = {} ) {
		store = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: unusedLangCodeRetriever,
			languageCodesProvider: unusedLanguageCodesProvider,
			tracker: unusedTracker,
			...storeServices,
		} );
		return mount( NewLexemeForm, {
			global: {
				plugins: [ store ],
				provide: {
					[ ConfigKey as symbol ]: emptyConfig,
					[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageItemSearchKey as symbol ]: new DevItemSearcher(),
					[ LanguageCodesProviderKey as symbol ]: unusedLanguageCodesProvider,
					[ WikiRouterKey as symbol ]: null,
					...pluginOverrides,
				},
			},
		} );
	}

	async function setLemmaInput( formWrapper: VueWrapper, value = 'default test lemma' ) {
		const lemmaInput = formWrapper.get( '.wbl-snl-lemma-input input' );
		await lemmaInput.setValue( value );
	}

	async function selectLanguage( formWrapper: VueWrapper, input = '=Q123' ): Promise<void> {
		const languageInput = formWrapper.find( '.wbl-snl-language-lookup input' );
		await languageInput.setValue( input );
		await formWrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );
	}

	async function selectLexicalCategory( formWrapper: VueWrapper, input = '=Q456' ): Promise<void> {
		const lexicalCategoryInput = formWrapper.find( '.wbl-snl-lexical-category-lookup input' );
		await lexicalCategoryInput.setValue( input );
		await formWrapper.find( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );
	}

	it( 'updates the store if something is entered into the lemma input', async () => {
		const wrapper = mountForm();
		const lemmaInput = wrapper.find( '.wbl-snl-lemma-input input' );

		await lemmaInput.setValue( 'foo' );

		expect( store.state.lemma ).toBe( 'foo' );
	} );

	it( 'updates the store if something is entered into the language input', async () => {
		const wrapper = mountForm( {
			langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'de' ) },
			languageCodesProvider: {
				isValid: jest.fn().mockReturnValue( true ),
				getLanguages: jest.fn(),
			},
		} );

		const languageLookup = wrapper.find( '.wbl-snl-language-lookup input' );

		await languageLookup.setValue( '=Q123' );
		await wrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( wrapper.find( '.wbl-snl-spelling-variant-lookup' ).exists() ).toBe( false );
		expect( store.state.language?.id ).toBe( 'Q123' );
		expect( store.state.languageCodeFromLanguageItem ).toBe( 'de' );

		await languageLookup.setValue( '=Q12' );
		// don’t click any option ⇒ nothing actually selected

		expect( wrapper.find( '.wbl-snl-spelling-variant-lookup' ).exists() ).toBe( false );
		expect( store.state.language ).toBe( null );
		expect( store.state.languageCodeFromLanguageItem ).toBe( undefined );
	} );

	it( 'shows warning message if language code is not valid', async () => {
		const languageCodesProvider: LanguageCodesProvider = {
			isValid: jest.fn().mockReturnValue( false ),
			getLanguages: jest.fn().mockReturnValue( new Map() ),
		};

		const wrapper = mountForm( {
			langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'invalid' ) },
			languageCodesProvider: languageCodesProvider,
		}, {
			[ LanguageCodesProviderKey as symbol ]: languageCodesProvider,
		} );

		await selectLanguage( wrapper, '=Q123' );
		await nextTick();

		expect( store.state.languageCodeFromLanguageItem ).toBe( false );

		const warning = wrapper.find( '.wikit-ValidationMessage--warning' );
		expect( warning.exists() ).toBe( true );
	} );

	it( 'updates the store if something is entered into the lexical category input', async () => {
		const wrapper = mountForm();
		const lexicalCategoryInput = wrapper.find( '.wbl-snl-lexical-category-lookup input' );

		await lexicalCategoryInput.setValue( '=Q456' );
		await wrapper.find( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( store.state.lexicalCategory?.id ).toBe( 'Q456' );
	} );

	it( 'updates the store if a language is selected in the spelling variant input', async () => {
		const languageCodesProvider: LanguageCodesProvider = {
			isValid: jest.fn().mockReturnValue( true ),
			getLanguages: jest.fn().mockReturnValue( new Map( [ [ 'de', 'German' ] ] ) ),
		};

		const wrapper = mountForm( {
			langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( null ) },
			languageCodesProvider: languageCodesProvider,
		}, {
			[ LanguageCodesProviderKey as symbol ]: languageCodesProvider,
		} );

		await selectLanguage( wrapper );
		await nextTick();

		const warning = wrapper.find( '.wikit-ValidationMessage--warning' );
		expect( warning.exists() ).toBe( false );

		const spellingVariantLookup = wrapper.find( '.wbl-snl-spelling-variant-lookup input' );

		await spellingVariantLookup.setValue( 'de' );

		await wrapper.find( '.wbl-snl-spelling-variant-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( store.state.spellingVariant ).toBe( 'de' );
	} );

	describe( 'calls the API to create the Lexeme and then redirects to it', () => {

		it( 'with language code from language item', async () => {
			const createLexeme = jest.fn().mockReturnValue( 'L123' );
			const goToTitle = jest.fn();

			const wrapper = mountForm( {
				lexemeCreator: { createLexeme },
				langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'de' ) },
				languageCodesProvider: {
					isValid: jest.fn().mockReturnValue( true ),
					getLanguages: jest.fn(),
				},
				tracker: { increment: jest.fn() },
			}, {
				[ WikiRouterKey as symbol ]: { goToTitle },
			} );

			await setLemmaInput( wrapper, 'foo' );
			await selectLanguage( wrapper, '=Q123' );
			await selectLexicalCategory( wrapper, '=Q456' );

			const spellingVariantInput = wrapper.find( '.wbl-snl-spelling-variant-lookup input' );
			expect( spellingVariantInput.exists() ).toBe( false );

			await wrapper.trigger( 'submit' );
			await flushPromises();

			expect( createLexeme ).toHaveBeenCalledWith( 'foo', 'de', 'Q123', 'Q456' );
			expect( goToTitle ).toHaveBeenCalledWith( 'Special:EntityPage/L123' );
		} );

		it( 'with spelling variant', async () => {
			const createLexeme = jest.fn().mockReturnValue( 'L123' );
			const goToTitle = jest.fn();

			const wrapper = mountForm( {
				lexemeCreator: { createLexeme },
				langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( null ) },
				languageCodesProvider: unusedLanguageCodesProvider,
				tracker: { increment: jest.fn() },
			}, {
				[ LanguageCodesProviderKey as symbol ]: {
					getLanguages: () => new Map( [ [ 'en-gb', 'British English' ] ] ),
				},
				[ WikiRouterKey as symbol ]: { goToTitle },
			} );

			await setLemmaInput( wrapper, 'foo' );
			await selectLanguage( wrapper, '=Q123' );
			await selectLexicalCategory( wrapper, '=Q456' );

			await nextTick();

			// will actually select en-gb, en is not in wikibaseLexemeTermLanguages
			const spellingVariantInput = wrapper.find( '.wbl-snl-spelling-variant-lookup input' );
			await spellingVariantInput.setValue( 'en' );
			await wrapper.find( '.wbl-snl-spelling-variant-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

			await wrapper.trigger( 'submit' );
			await flushPromises();

			expect( createLexeme ).toHaveBeenCalledWith( 'foo', 'en-gb', 'Q123', 'Q456' );
			expect( goToTitle ).toHaveBeenCalledWith( 'Special:EntityPage/L123' );
		} );

		it( 'disables button when submitting and reenables on error', async () => {
			let reject = undefined as unknown as ( reason: unknown ) => void;
			const promise = new Promise( ( _, reject_ ) => {
				reject = reject_;
			} );
			const createLexeme = jest.fn().mockReturnValue( promise );
			const goToTitle = jest.fn();

			const wrapper = mountForm( {
				lexemeCreator: { createLexeme },
				langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'de' ) },
				languageCodesProvider: {
					isValid: jest.fn().mockReturnValue( true ),
					getLanguages: jest.fn(),
				},
				tracker: { increment: jest.fn() },
			}, {
				[ WikiRouterKey as symbol ]: { goToTitle },
			} );

			await setLemmaInput( wrapper, 'foo' );
			await selectLanguage( wrapper, '=Q123' );
			await selectLexicalCategory( wrapper, '=Q456' );

			const spellingVariantInput = wrapper.find( '.wbl-snl-spelling-variant-lookup input' );
			expect( spellingVariantInput.exists() ).toBe( false );

			await wrapper.trigger( 'submit' );

			const submitButton = wrapper.find( '.wikit-Button' );
			expect( submitButton.attributes( 'disabled' ) ).toBe( '' );
			expect( submitButton.text() ).toBe( 'Creating Lexeme...' );

			reject( [ { type: 'test', message: 'error' } ] );
			await flushPromises();

			expect( submitButton.attributes( 'disabled' ) ).toBe( undefined );
			expect( submitButton.text() ).toBe( 'Create Lexeme' );
			expect( goToTitle ).not.toHaveBeenCalled();
		} );

	} );

	describe( 'validates that every input has a value', () => {
		it( 'shows an error when the lemma input is empty and clears that after something is typed', async () => {
			const createLexeme = jest.fn();

			const messagesPlugin = new Messages( new DevMessagesRepository() );
			const wrapper = mountForm( {
				lexemeCreator: { createLexeme },
				langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'en' ) },
				languageCodesProvider: {
					isValid: jest.fn().mockReturnValue( true ),
					getLanguages: jest.fn(),
				},
			}, {
				[ MessagesKey as symbol ]: messagesPlugin,
			} );

			await selectLanguage( wrapper, '=Q123' );
			await selectLexicalCategory( wrapper, '=Q456' );

			await wrapper.trigger( 'submit' );

			const lemmaInputWrapper = wrapper.get( '.wbl-snl-lemma-input' );
			expect( lemmaInputWrapper.get( '.wikit-ValidationMessage--error' ).text() ).toBe( messagesPlugin.get( 'wikibaselexeme-newlexeme-lemma-empty-error' ) );

			await lemmaInputWrapper.get( 'input' ).setValue( 'foo' );

			expect( lemmaInputWrapper.find( '.wikit-ValidationMessage--error' ).exists() ).toBe( false );

			expect( createLexeme ).not.toHaveBeenCalled();
		} );

		it( 'shows an error when the lexical category input is empty and clears that after something is selected', async () => {
			const createLexeme = jest.fn();
			const messagesPlugin = new Messages( new DevMessagesRepository() );

			const wrapper = mountForm( {
				lexemeCreator: { createLexeme },
				langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'en' ) },
				languageCodesProvider: {
					isValid: jest.fn().mockReturnValue( true ),
					getLanguages: jest.fn(),
				},
			}, {
				[ MessagesKey as symbol ]: messagesPlugin,
			} );

			await setLemmaInput( wrapper, 'foo' );
			await selectLanguage( wrapper, '=Q123' );

			await wrapper.trigger( 'submit' );

			const lexicalCategoryInputWrapper = wrapper.get( '.wbl-snl-lexical-category-lookup' );
			expect( lexicalCategoryInputWrapper.get( '.wikit-ValidationMessage--error' ).text() )
				.toBe( messagesPlugin.get( 'wikibaselexeme-newlexeme-lexicalcategory-empty-error' ) );
			await lexicalCategoryInputWrapper.get( 'input' ).setValue( '=Q456' );
			await lexicalCategoryInputWrapper.find( '.wikit-OptionsMenu__item' ).trigger( 'click' );
			expect( lexicalCategoryInputWrapper.find( '.wikit-ValidationMessage--error' ).exists() ).toBe( false );

			expect( createLexeme ).not.toHaveBeenCalled();
		} );

		it( 'shows an error when the language input is empty and clears that after something is selected', async () => {
			const createLexeme = jest.fn();
			const messagesPlugin = new Messages( new DevMessagesRepository() );

			const wrapper = mountForm( {
				lexemeCreator: { createLexeme },
				langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'en' ) },
				languageCodesProvider: {
					isValid: jest.fn().mockReturnValue( true ),
					getLanguages: jest.fn(),
				},
			}, {
				[ MessagesKey as symbol ]: messagesPlugin,
			} );

			await setLemmaInput( wrapper, 'foo' );
			await selectLexicalCategory( wrapper, '=Q456' );

			await wrapper.trigger( 'submit' );

			const languageInputWrapper = wrapper.get( '.wbl-snl-language-lookup' );
			expect( languageInputWrapper.get( '.wikit-ValidationMessage--error' ).text() )
				.toBe( messagesPlugin.get( 'wikibaselexeme-newlexeme-language-empty-error' ) );
			await languageInputWrapper.get( 'input' ).setValue( '=Q123' );
			await languageInputWrapper.find( '.wikit-OptionsMenu__item' ).trigger( 'click' );

			await flushPromises();

			expect( languageInputWrapper.find( '.wikit-ValidationMessage--error' ).exists() ).toBe( false );

			expect( createLexeme ).not.toHaveBeenCalled();
		} );

		it( 'shows an error when the spelling variant input is empty and clears that after something is selected', async () => {
			const createLexeme = jest.fn();
			const messagesPlugin = new Messages( new DevMessagesRepository() );

			const wrapper = mountForm( {
				lexemeCreator: { createLexeme },
				langCodeRetriever: { getLanguageCodeFromItem: jest.fn().mockResolvedValue( null ) },
				languageCodesProvider: {
					isValid: jest.fn().mockReturnValue( true ),
					getLanguages: jest.fn(),
				},
			}, {
				[ LanguageCodesProviderKey as symbol ]: {
					getLanguages: () => new Map( [ [ 'en-gb', 'British English' ] ] ),
				},
				[ MessagesKey as symbol ]: messagesPlugin,
			} );

			await setLemmaInput( wrapper );
			await selectLanguage( wrapper );
			await selectLexicalCategory( wrapper );

			await wrapper.trigger( 'submit' );

			const spellingVariantInputWrapper = wrapper.get( '.wbl-snl-spelling-variant-lookup' );
			expect( spellingVariantInputWrapper.get( '.wikit-ValidationMessage--error' ).text() )
				.toBe( messagesPlugin.get( 'wikibaselexeme-newlexeme-lemma-language-empty-error' ) );

			await spellingVariantInputWrapper.get( 'input' ).setValue( 'en' );
			await spellingVariantInputWrapper.get( '.wikit-OptionsMenu__item' ).trigger( 'click' );

			expect( spellingVariantInputWrapper.find( '.wikit-ValidationMessage--error' ).exists() ).toBe( false );

			expect( createLexeme ).not.toHaveBeenCalled();
		} );
	} );

} );
