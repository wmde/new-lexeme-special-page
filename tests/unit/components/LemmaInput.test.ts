import { DOMWrapper, mount } from '@vue/test-utils';
import LemmaInput from '@/components/LemmaInput.vue';
import { ConfigKey } from '@/plugins/ConfigPlugin/Config';

describe( 'LemmaInput', () => {

	function createComponent( config: Record<string, unknown> = {} ) {
		return mount( LemmaInput, {
			props: {
				modelValue: '',
			},
			global: {
				provide: {
					[ ConfigKey as symbol ]: { placeholderExampleData: {} },
				},
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
	} );

	describe( '@events', () => {
		it( '@update:modelValue - emits update:modelValue when the input\'s value changes', () => {
			const lemmaInputWrapper = createComponent();

			findInput( lemmaInputWrapper ).setValue( 'foo' );

			expect( lemmaInputWrapper.emitted( 'update:modelValue' ) ).toStrictEqual( [ [ 'foo' ] ] );
		} );
	} );
} );
