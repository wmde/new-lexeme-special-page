import { mount } from '@vue/test-utils';
import SpellingVariantInput from '@/components/SpellingVariantInput.vue';
import { Lookup as WikitLookup } from '@wmde/wikit-vue-components';
import { LanguageCodesProviderKey } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';

const exampleWikibaseLexemeTermLanguagesConfig = [ 'en', 'en-ca', 'es', 'hi' ];

function createLookup( config: Record<string, unknown> = {} ) {
	return mount( SpellingVariantInput, {
		props: {
			modelValue: '',
		},
		global: {
			provide: {
				[ LanguageCodesProviderKey as symbol ]: {
					getLanguageCodes: () => exampleWikibaseLexemeTermLanguagesConfig,
				},
			},
		},
		...config,
	} );
}

describe( 'SpellingVariantInput', () => {
	describe( ':props', () => {
		it( ':value - selects the selected language', async () => {
			const lookup = createLookup();
			await lookup.find( 'input' ).setValue( 'foo' );
			const selectedItemId = 1;

			await lookup.setProps( {
				value: exampleWikibaseLexemeTermLanguagesConfig[ selectedItemId ],
			} );

			expect( lookup.findComponent( WikitLookup ).props().value )
				.toBe( exampleWikibaseLexemeTermLanguagesConfig[ selectedItemId ] );
		} );

		it( ':menuItems - returned suggestions are provided to Wikit Lookup', async () => {
			const lookup = createLookup();

			await lookup.find( 'input' ).setValue( 'en' );

			const wikitLookup = lookup.getComponent( WikitLookup );
			expect( wikitLookup.props( 'menuItems' ) ).toStrictEqual( [
				{
					description: '',
					label: 'en',
				},
				{
					description: '',
					label: 'en-ca',
				},
			] );
		} );
	} );
	describe( '@events', () => {
		it( '@update:modelValue - emits null when the input is changed', async () => {
			const lookup = createLookup();

			await lookup.find( 'input' ).setValue( 'foo' );

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect( lookup.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toBe( null );
		} );

		it( '@update:modelValue - emits the value of the selected option', async () => {
			const lookup = createLookup();
			await lookup.find( 'input' ).setValue( 'en' );
			const selectedItemId = 0;

			await lookup.findComponent( WikitLookup ).vm.$emit(
				'input',
				{
					label: exampleWikibaseLexemeTermLanguagesConfig[ selectedItemId ],
					description: '',
				},
			);

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect( lookup.emitted( 'update:modelValue' )[ 1 ][ 0 ] )
				.toBe( exampleWikibaseLexemeTermLanguagesConfig[ selectedItemId ] );

		} );
	} );
} );
