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

		lemmaInput.setValue( 'foo' );

		expect( store.state.lemma ).toBe( 'foo' );
	} );
} );
