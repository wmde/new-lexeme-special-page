import { DOMWrapper, mount } from '@vue/test-utils';
import LemmaInput from '@/components/LemmaInput.vue';

describe( 'LemmaInput', () => {

	function createComponent( config: Record<string, unknown> = {} ) {
		return mount( LemmaInput, {
			props: {
				modelValue: '',
			},
			...config,
		} );
	}

	function findInput( wrapper: ReturnType<typeof createComponent> ): Omit<DOMWrapper<HTMLInputElement>, 'exists'> {
		return wrapper.get( 'input' );
	}

	describe( ':props', () => {
		it( ':modelValue - sets the given string as the inputs value', () => {
			const testValue = 'foo';

			const lemmaInputWrapper = createComponent( { props: { modelValue: testValue } } );

			expect( findInput( lemmaInputWrapper ).element.value ).toBe( testValue );
		} );

		it( ':error - displays an error message for value ERROR_LEMMA_TOO_LONG', () => {
			const lemmaInputWrapper = createComponent( { props: { error: 'ERROR_LEMMA_TOO_LONG' } } );

			expect( lemmaInputWrapper.text() ).toContain( 'wikibaselexeme-newlexeme-error-lemma-is-too-long' );
		} );

		it( ':error - displays an error message for value ERROR_NO_LEMMA', () => {
			const lemmaInputWrapper = createComponent( { props: { error: 'ERROR_NO_LEMMA' } } );

			expect( lemmaInputWrapper.text() ).toContain( 'wikibaselexeme-newlexeme-error-no-lemma' );
		} );
	} );

	describe( '@events', () => {
		it( '@update:modelValue - emits update:modelValue when the input\'s value changes', () => {
			const lemmaInputWrapper = createComponent();

			findInput( lemmaInputWrapper ).setValue( 'foo' );

			expect( lemmaInputWrapper.emitted( 'update:modelValue' ) ).toStrictEqual( [ [ 'foo' ] ] );
		} );
	} );
} );
