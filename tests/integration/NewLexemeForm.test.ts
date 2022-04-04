import { ConfigKey } from '@/plugins/ConfigPlugin/Config';
import { mount } from '@vue/test-utils';
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import initStore from '@/store';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
import DevItemSearcher from '@/data-access/DevItemSearcher';
import { WikiRouterKey } from '@/plugins/WikiRouterPlugin/WikiRouter';

jest.mock( 'lodash/debounce', () => jest.fn( ( fn ) => fn ) );

describe( 'NewLexemeForm', () => {
	let store: ReturnType<typeof initStore>;
	beforeEach( () => {
		store = initStore( { lexemeCreator: unusedLexemeCreator } );
	} );

	function mountForm() {
		return mount( NewLexemeForm, {
			global: {
				plugins: [ store ],
				provide: {
					[ ConfigKey as symbol ]: { wikibaseLexemeTermLanguages: [ 'en', 'en-ca', 'de' ] },
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
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
		const wrapper = mountForm();
		const languageLookup = wrapper.find( '.wbl-snl-language-lookup input' );

		await languageLookup.setValue( '=Q123' );
		await wrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( store.state.language ).toBe( 'Q123' );
	} );

	it( 'updates the store if something is entered into the lexical category input', async () => {
		const wrapper = mountForm();
		const lexicalCategoryInput = wrapper.find( '.wbl-snl-lexical-category-lookup input' );

		await lexicalCategoryInput.setValue( '=Q456' );
		await wrapper.find( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( store.state.lexicalCategory ).toBe( 'Q456' );
	} );

	it( 'updates the store if a language is selected in the spelling variant input', async () => {
		const wrapper = mountForm();
		const SpellingVariantLookup = wrapper.find( '.wbl-snl-spelling-variant-lookup input' );

		await SpellingVariantLookup.setValue( 'de' );

		await wrapper.find( '.wbl-snl-spelling-variant-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		expect( store.state.spellingVariant ).toBe( 'de' );
	} );

	it( 'calls the API to create the Lexeme and then redirects to it', async () => {
		const createLexeme = jest.fn().mockReturnValue( 'L123' );
		const goToTitle = jest.fn();
		const testStore = initStore( { lexemeCreator: { createLexeme } } );
		const wrapper = mount( NewLexemeForm, {
			global: {
				plugins: [ testStore ],
				provide: {
					[ ConfigKey as symbol ]: { wikibaseLexemeTermLanguages: [ 'en' ] },
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
					[ WikiRouterKey as symbol ]: { goToTitle },
				},
			},
		} );

		const lemmaInput = wrapper.find( '.wbl-snl-lemma-input input' );
		await lemmaInput.setValue( 'foo' );

		const languageInput = wrapper.find( '.wbl-snl-language-lookup input' );
		await languageInput.setValue( '=Q123' );
		await wrapper.find( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		const lexicalCategoryInput = wrapper.find( '.wbl-snl-lexical-category-lookup input' );
		await lexicalCategoryInput.setValue( '=Q456' );
		await wrapper.find( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).trigger( 'click' );

		await wrapper.trigger( 'submit' );

		expect( createLexeme ).toHaveBeenCalledWith( 'foo', 'en', 'Q123', 'Q456' );
		expect( goToTitle ).toHaveBeenCalledWith( 'Special:EntityPage/L123' );
	} );
} );
