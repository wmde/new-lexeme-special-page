import { mount } from '@vue/test-utils';
import SpellingVariantInput from '@/components/SpellingVariantInput.vue';
import { Lookup as WikitLookup } from '@wmde/wikit-vue-components';
import { LanguageCodesProviderKey } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import DevMessagesRepository from '@/plugins/MessagesPlugin/DevMessagesRepository';
import Messages, { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import { ListLanguageCodesProvider } from '@/data-access/LanguageCodesProvider';

const termLanguagesConfig = { en: 'English', 'en-gb': 'British English', de: 'German' };

function createLookup( config: Record<string, unknown> = {} ) {
	return mount( SpellingVariantInput, {
		props: {
			modelValue: '',
		},
		global: {
			provide: {
				[ LanguageCodesProviderKey as symbol ]:
					new ListLanguageCodesProvider( termLanguagesConfig ),
				[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
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

			await lookup.setProps( {
				value: 'en',
			} );

			expect( lookup.findComponent( WikitLookup ).props().value )
				.toStrictEqual( 'en' );
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
				{ en: 'English', 'aeb-latn': 'Tunisian Arabic (Latin script)', de: 'German' },
				'Tun',
				[ 'aeb-latn' ],
			],
			[
				'matching is not fuzzy - tsa does not match Tunisian',
				{ en: 'English', 'aeb-latn': 'Tunisian Arabic (Latin script)', de: 'German' },
				'tsa',
				[],
			],
			[
				'Matching looks at each word in the list, i.e. Tunisian Arabic would display if arabic entered',
				{ en: 'English', 'aeb-latn': 'Tunisian Arabic (Latin script)', de: 'German' },
				'arabic',
				[ 'aeb-latn' ],
			],
			[
				'Treats the language code as a word or words for the sake of matching',
				{ en: 'English', 'aeb-latn': 'Tunisian Arabic (Latin script)', de: 'German' },
				'aeb',
				[ 'aeb-latn' ],
			],
			[
				'shows all the languages that match the input',
				{ en: 'English', 'en-gb': 'British English', de: 'German' },
				'Engl',
				[ 'en', 'en-gb' ],
			],
		] )( '%s', async ( _, termLanguages: Record<string, string>, userInput, expectedOptionValues ) => {
			const lookup = mount( SpellingVariantInput, {
				props: {
					modelValue: '',
				},
				global: {
					provide: {
						[ LanguageCodesProviderKey as symbol ]:
							new ListLanguageCodesProvider( termLanguages ),
						[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
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

			await lookup.findComponent( WikitLookup ).vm.$emit(
				'input',
				{
					label: 'foo',
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
