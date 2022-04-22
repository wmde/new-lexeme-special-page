import { mount } from '@vue/test-utils';
import SpellingVariantInput from '@/components/SpellingVariantInput.vue';
import { Lookup as WikitLookup } from '@wmde/wikit-vue-components';
import { LanguageCodesProviderKey } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';

const exampleWikibaseLexemeTermLanguagesConfig = [ [ 'en', 'English' ], [ 'en-gb', 'British English' ], [ 'de', 'German' ] ];

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
				.toStrictEqual( exampleWikibaseLexemeTermLanguagesConfig[ selectedItemId ] );
		} );

		it( ':menuItems - returned suggestions are provided to Wikit Lookup', async () => {
			const lookup = createLookup();

			await lookup.find( 'input' ).setValue( 'en' );

			const wikitLookup = lookup.getComponent( WikitLookup );
			expect( wikitLookup.props( 'menuItems' ) ).toStrictEqual( [
				{
					description: '',
					label: 'English (en)',
					value: 'en',
				},
				{
					description: '',
					label: 'British English (en-gb)',
					value: 'en-gb',
				},
			] );
		} );
	} );

	describe( 'suggested options', () => {
		it.each( [
			[
				'Tun would open Tunisian',
				[ [ 'en', 'English' ], [ 'aeb-latn', 'Tunisian Arabic (Latin script)' ], [ 'de', 'German' ] ],
				'Tun',
				[ 'aeb-latn' ],
			],
			[
				'matching is not fuzzy - tsa does not match Tunisian',
				[ [ 'en', 'English' ], [ 'aeb-latn', 'Tunisian Arabic (Latin script)' ], [ 'de', 'German' ] ],
				'tsa',
				[],
			],
			[
				'Matching looks at each word in the list, i.e. Tunisian Arabic would display if arabic entered',
				[ [ 'en', 'English' ], [ 'aeb-latn', 'Tunisian Arabic (Latin script)' ], [ 'de', 'German' ] ],
				'arabic',
				[ 'aeb-latn' ],
			],
			[
				'Treats the language code as a word or words for the sake of matching',
				[ [ 'en', 'English' ], [ 'aeb-latn', 'Tunisian Arabic (Latin script)' ], [ 'de', 'German' ] ],
				'aeb',
				[ 'aeb-latn' ],
			],
			[
				'shows all the languages that match the input',
				[ [ 'en', 'English' ], [ 'en-gb', 'British English' ], [ 'de', 'German' ] ],
				'Engl',
				[ 'en', 'en-gb' ],
			],
		] )( '%s', async ( _, totalOptions, userInput, expectedOptionValues ) => {
			const lookup = mount( SpellingVariantInput, {
				props: {
					modelValue: '',
				},
				global: {
					provide: {
						[ LanguageCodesProviderKey as symbol ]: {
							getLanguageCodes: () => totalOptions,
						},
					},
				},
			} );

			await lookup.find( 'input' ).setValue( userInput );

			const wikitLookup = lookup.getComponent( WikitLookup );
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect( wikitLookup.props( 'menuItems' ).map( ( option: any ) => option.value ) ).toStrictEqual( expectedOptionValues );
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
					value: 'en',
				},
			);

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect( lookup.emitted( 'update:modelValue' )[ 1 ][ 0 ] )
				.toBe( 'en' );

		} );
	} );
} );
