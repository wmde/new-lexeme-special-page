import { DOMWrapper, mount } from '@vue/test-utils';
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

	function createComponent( config: Record<string, unknown> = {} ) {
		store = initStore( {
			lexemeCreator: unusedLexemeCreator,
			langCodeRetriever: unusedLangCodeRetriever,
			languageCodesProvider: unusedLanguageCodesProvider,
			tracker: unusedTracker,
		} );

		return mount( LemmaInput, {
			props: {
				modelValue: '',
			},
			global: {
				plugins: [ store ],
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

		it( ':error - displays an error message provided by the prop', async () => {
			const lemmaInputWrapper = createComponent();

			store.state.perFieldErrors.lemmaErrors.push( { messageKey: 'wikibaselexeme-newlexeme-error-no-lemma' } );
			await nextTick();

			expect( lemmaInputWrapper.get( '.wikit-ValidationMessage--error' ).text() ).toContain( '⧼wikibaselexeme-newlexeme-error-no-lemma⧽' );
		} );

		it( ':error - displays an error message in case input is too long', async () => {
			const tooLongValue =
			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula \neget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nu';
			const lemmaInputWrapper = createComponent( { props: { modelValue: tooLongValue } } );

			store.state.perFieldErrors.lemmaErrors.push( { messageKey: 'wikibaselexeme-newlexeme-lemma-too-long-error' } );
			await nextTick();

			expect( lemmaInputWrapper.get( '.wikit-ValidationMessage--error' ).text() ).toContain( '⧼wikibaselexeme-newlexeme-lemma-too-long-error⧽' );
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
