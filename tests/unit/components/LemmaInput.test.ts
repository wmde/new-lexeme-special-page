import { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import {
	DOMWrapper,
	mount,
	MountingOptions,
} from '@vue/test-utils';
import LemmaInput from '@/components/LemmaInput.vue';
import { ConfigKey } from '@/plugins/ConfigPlugin/Config';
import initStore from '@/store';
import unusedLangCodeRetriever from '../../mocks/unusedLangCodeRetriever';
import unusedLanguageCodesProvider from '../../mocks/unusedLanguageCodesProvider';
import unusedTracker from '../../mocks/unusedTracker';
import unusedLexemeCreator from '../../mocks/unusedLexemeCreator';
import { nextTick } from 'vue';
import RootState from '@/store/RootState';
import { Store } from 'vuex';

describe( 'LemmaInput', () => {

	let store: Store<RootState>;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function createComponent( config: Partial<MountingOptions<any>> = {} ) {
		store = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: unusedLangCodeRetriever,
			languageCodesProvider: unusedLanguageCodesProvider,
			tracker: unusedTracker,
		} );

		return mount( LemmaInput, {
			...config,
			props: {
				modelValue: '',
				...config.props,
			},
			global: {
				plugins: [ store ],
				provide: {
					[ ConfigKey as symbol ]: { placeholderExampleData: {}, maxLemmaLength: 8 },
					...config.global?.provide,
				},
			},
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

	describe( 'input validation', () => {
		it( 'displays an error message when no input provided', async () => {
			const lemmaInputWrapper = createComponent();

			store.state.perFieldErrors.lemmaErrors.push( { messageKey: 'wikibaselexeme-newlexeme-lemma-empty-error' } );
			await nextTick();

			expect( lemmaInputWrapper.get( '.wikit-ValidationMessage--error' ).text() ).toContain( '⧼wikibaselexeme-newlexeme-lemma-empty-error⧽' );
		} );

		it( 'displays an error message when input is too longer than configured', async () => {
			const tooLongValue = 'InputShouldBeShorter';
			const messageGet = jest.fn().mockImplementation( ( key: string ) => `⧼${key}⧽` );
			const lemmaInputWrapper = createComponent( {
				props: { modelValue: tooLongValue },
				global: { provide: { [ MessagesKey as symbol ]: { getUnescaped: messageGet } } },
			} );

			expect( lemmaInputWrapper.get( '.wikit-ValidationMessage--error' ).text() ).toContain( '⧼wikibaselexeme-newlexeme-lemma-too-long-error⧽' );
			expect( messageGet ).toHaveBeenNthCalledWith( 3, 'wikibaselexeme-newlexeme-lemma-too-long-error', '8' );
		} );

		it( 'counts multi-byte characters as code points', async () => {
			const multiByteInput = '🏳️‍🌈🏳️‍🌈';
			const lemmaInputWrapper = createComponent( { props: { modelValue: multiByteInput } } );
			const mbInputString = Array.from( findInput( lemmaInputWrapper ).element.value );
			expect( mbInputString.length ).toBe( 8 );
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
