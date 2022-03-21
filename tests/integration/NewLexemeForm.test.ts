import { mount } from '@vue/test-utils';
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import initStore from '@/store';
import unusedLexemeCreator from '../mocks/unusedLexemeCreator';
import { ItemSearchKey } from '@/plugins/ItemSearchPlugin/ItemSearch';
import DevItemSearcher from '@/data-access/DevItemSearcher';

jest.mock( 'lodash/debounce', () => jest.fn( ( fn ) => fn ) );

describe( 'NewLexemeForm', () => {
	let store: ReturnType<typeof initStore>;
	beforeEach( () => {
		store = initStore( {}, { lexemeCreator: unusedLexemeCreator } );
	} );

	function mountForm() {
		return mount( NewLexemeForm, {
			global: {
				plugins: [ store ],
				provide: {
					[ ItemSearchKey as symbol ]: new DevItemSearcher(),
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
		const lexicalCategoryInput = wrapper.find( '.wbl-snl-lexical-category-input input' );

		await lexicalCategoryInput.setValue( 'foo' );

		expect( store.state.lexicalCategory ).toBe( 'foo' );
	} );
} );
