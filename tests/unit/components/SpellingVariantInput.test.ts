import {
	mount,
	VueWrapper,
} from '@vue/test-utils';
import SpellingVariantInput from '@/components/SpellingVariantInput.vue';
import { CdxLookup } from '@wikimedia/codex';
import { LanguageCodesProviderKey } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import DevMessagesRepository from '@/plugins/MessagesPlugin/DevMessagesRepository';
import Messages, { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import { MapLanguageCodesProvider } from '@/data-access/LanguageCodesProvider';
import { ConfigKey } from '@/plugins/ConfigPlugin/Config';
import initStore from '@/store';
import unusedLangCodeRetriever from '../../mocks/unusedLangCodeRetriever';
import unusedLanguageCodesProvider from '../../mocks/unusedLanguageCodesProvider';
import unusedTracker from '../../mocks/unusedTracker';
import unusedLexemeCreator from '../../mocks/unusedLexemeCreator';

const termLanguagesConfig = new Map( [ [ 'en', 'English' ], [ 'en-gb', 'British English' ], [ 'de', 'German' ] ] );

function createLookup( config: Record<string, unknown> = {} ) {
	const store = initStore( {
		lexemeCreator: unusedLexemeCreator,
		langCodeRetriever: unusedLangCodeRetriever,
		languageCodesProvider: unusedLanguageCodesProvider,
		tracker: unusedTracker,
	} );
	return mount( SpellingVariantInput, {
		props: {
			modelValue: '',
		},
		global: {
			plugins: [ store ],
			provide: {
				[ LanguageCodesProviderKey as symbol ]:
					new MapLanguageCodesProvider( termLanguagesConfig ),
				[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
				[ ConfigKey as symbol ]: { placeholderExampleData: {} },
			},
		},
		...config,
	} );
}

async function setSearchInput( lookup: VueWrapper, searchInput: string ): Promise<void> {
	await lookup.find( 'input' ).setValue( searchInput );
	await lookup.setProps( { searchInput } );
}

describe( 'SpellingVariantInput', () => {
	describe( ':props', () => {
		it( ':value - selects the selected language', async () => {
			const lookup = createLookup();

			await lookup.find( 'input' ).setValue( 'en' );

			expect( lookup.find( 'div.cdx-text-input' ).get( 'input' ).element.value )
				.toStrictEqual( 'en' );
		} );

		it( ':menuItems - returned suggestions are provided to Codex Lookup', async () => {
			const lookup = createLookup();

			await setSearchInput( lookup, 'en' );

			const codexLookup = lookup.getComponent( CdxLookup );
			expect( codexLookup.props( 'menuItems' ) ).toStrictEqual( [
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
				new Map( [ [ 'en', 'English' ], [ 'aeb-latn', 'Tunisian Arabic (Latin script)' ], [ 'de', 'German' ] ] ),
				'Tun',
				[ 'aeb-latn' ],
			],
			[
				'matching is not fuzzy - tsa does not match Tunisian',
				new Map( [ [ 'en', 'English' ], [ 'aeb-latn', 'Tunisian Arabic (Latin script)' ], [ 'de', 'German' ] ] ),
				'tsa',
				[],
			],
			[
				'Matching looks at each word in the list, i.e. Tunisian Arabic would display if arabic entered',
				new Map( [ [ 'en', 'English' ], [ 'aeb-latn', 'Tunisian Arabic (Latin script)' ], [ 'de', 'German' ] ] ),
				'arabic',
				[ 'aeb-latn' ],
			],
			[
				'Treats the language code as a word or words for the sake of matching',
				new Map( [ [ 'en', 'English' ], [ 'aeb-latn', 'Tunisian Arabic (Latin script)' ], [ 'de', 'German' ] ] ),
				'aeb',
				[ 'aeb-latn' ],
			],
			[
				'shows all the languages that match the input',
				new Map( [ [ 'en', 'English' ], [ 'en-gb', 'British English' ], [ 'de', 'German' ] ] ),
				'Engl',
				[ 'en', 'en-gb' ],
			],
		] )( '%s', async ( _, termLanguages: Map<string, string>, userInput, expectedOptionValues ) => {
			const store = initStore( {
				lexemeCreator: unusedLexemeCreator,
				langCodeRetriever: unusedLangCodeRetriever,
				languageCodesProvider: unusedLanguageCodesProvider,
				tracker: unusedTracker,
			} );
			const lookup = mount( SpellingVariantInput, {
				props: {
					modelValue: '',
				},
				global: {
					plugins: [ store ],
					provide: {
						[ LanguageCodesProviderKey as symbol ]:
							new MapLanguageCodesProvider( termLanguages ),
						[ MessagesKey as symbol ]: new Messages( new DevMessagesRepository() ),
						[ ConfigKey as symbol ]: { placeholderExampleData: {} },
					},
				},
			} );

			await setSearchInput( lookup, userInput );

			const codexLookup = lookup.getComponent( CdxLookup );
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect( codexLookup.props( 'menuItems' ).map( ( option: any ) => option.value ) ).toStrictEqual( expectedOptionValues );
		} );
	} );

	describe( '@events', () => {
		it( '@update:modelValue - emits null when the input is changed', async () => {
			const lookup = createLookup();

			await setSearchInput( lookup, 'foo' );

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect( lookup.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toBe( undefined );
		} );

		it( '@update:modelValue - emits the value of the selected option', async () => {
			const lookup = createLookup();
			await setSearchInput( lookup, 'en' );

			await lookup.findComponent( CdxLookup ).vm.$emit( 'update:selected', 'en' );

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect( lookup.emitted( 'update:modelValue' )[ 1 ][ 0 ] )
				.toBe( 'en' );

		} );
	} );

} );
