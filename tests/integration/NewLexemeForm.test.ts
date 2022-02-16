import { mount } from '@vue/test-utils';
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import store from '@/store';

describe( 'NewLexemeForm', () => {
	function mountForm() {
		return mount( NewLexemeForm, {
			global: {
				plugins: [ store ],
			},
		} );
	}

	it( 'updates the store if something is entered into the lemma input', async () => {
		const wrapper = mountForm();
		const lemmaInput = wrapper.find( '.mw-wbl-snl-lemma-input input' );

		await lemmaInput.setValue( 'foo' );

		expect( store.state.lemma ).toBe( 'foo' );
	} );

	it( 'updates the store if something is entered into the language input', async () => {
		const wrapper = mountForm();
		const lemmaInput = wrapper.find( '.wbl-snl-language-input input' );

		await lemmaInput.setValue( 'foo' );

		expect( store.state.language ).toBe( 'foo' );
	} );

	it( 'updates the store if something is entered into the lexical category input', async () => {
		const wrapper = mountForm();
		const lexicalCategoryInput = wrapper.find( '.mw-wbl-snl-lexical-category-input input' );

		await lexicalCategoryInput.setValue( 'foo' );

		expect( store.state.lexicalCategory ).toBe( 'foo' );
	} );
} );
