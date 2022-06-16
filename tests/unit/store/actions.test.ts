import Tracker from '@/data-access/tracking/Tracker';
import createActions, {
	CREATE_LEXEME,
	HANDLE_LANGUAGE_CHANGE,
	HANDLE_INIT_PARAMS,
} from '@/store/actions';
import LexemeCreator from '@/data-access/LexemeCreator';
import {
	ADD_ERRORS,
	ADD_PER_FIELD_ERROR,
	CLEAR_ERRORS,
} from '@/store/mutations';
import RootState, { SubmitError } from '@/store/RootState';
import { createStore } from 'vuex';
import unusedLangCodeRetriever from '../../mocks/unusedLangCodeRetriever';
import unusedLanguageCodesProvider from '../../mocks/unusedLanguageCodesProvider';
import unusedLexemeCreator from '../../mocks/unusedLexemeCreator';
import mutations from '@/store/mutations';
import unusedTracker from '../../mocks/unusedTracker';

describe( CREATE_LEXEME, () => {

	it( 'calls lexemeCreator with the inferred language variant', async () => {
		const lexemeCreator: LexemeCreator = {
			createLexeme: jest.fn().mockResolvedValue( 'L123' ),
		};
		const tracker: Tracker = {
			increment: jest.fn(),
		};

		const actions = createActions(
			lexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			tracker,
		);
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					spellingVariant: '',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					languageCodeFromLanguageItem: 'fr',
				} as RootState;
			},
			actions,
			mutations: {
				[ CLEAR_ERRORS ]: jest.fn(),
			},
		} );

		const lexemeId = await store.dispatch( CREATE_LEXEME );

		expect( lexemeId ).toBe( 'L123' );
		expect( lexemeCreator.createLexeme ).toHaveBeenCalledWith(
			'foo',
			'fr',
			'Q123',
			'Q234',
		);
		expect( tracker.increment ).toHaveBeenCalledWith(
			'wikibase.lexeme.special.NewLexeme.js.create',
		);
	} );

	it( 'calls lexemeCreator with the language variant selected by the user', async () => {
		const lexemeCreator: LexemeCreator = {
			createLexeme: jest.fn().mockResolvedValue( 'L123' ),
		};

		const actions = createActions(
			lexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			{ increment: jest.fn() },
		);
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					spellingVariant: 'de-formal',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					languageCodeFromLanguageItem: 'de',
				} as RootState;
			},
			actions,
			mutations: {
				[ CLEAR_ERRORS ]: jest.fn(),
			},
		} );
		// normally, spellingVariant would only be set if languageCodeFromLanguageItem is null;
		// however, via the URL parameters one can set both at the same time,
		// in which case the spellingVariant should take precedence

		const lexemeId = await store.dispatch( CREATE_LEXEME );

		expect( lexemeId ).toBe( 'L123' );
		expect( lexemeCreator.createLexeme ).toHaveBeenCalledWith(
			'foo',
			'de-formal',
			'Q123',
			'Q234',
		);
	} );

	it( 'clears global errors and adds new ones to the store', async () => {
		const errors: SubmitError[] = [
			{ type: 'error1', message: 'error one' },
			{ type: 'error2' },
		];
		const lexemeCreator: LexemeCreator = {
			createLexeme: jest.fn().mockRejectedValue( errors ),
		};

		const actions = createActions(
			lexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			unusedTracker,
		);
		const mockMutations = {
			[ CLEAR_ERRORS ]: jest.fn(),
			[ ADD_ERRORS ]: jest.fn(),
		};
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: 'en',
				} as RootState;
			},
			actions,
			mutations: mockMutations,
		} );

		await expect( store.dispatch( CREATE_LEXEME ) ).rejects.toBe( null );

		expect( mockMutations[ CLEAR_ERRORS ] ).toHaveBeenCalled();
		expect( mockMutations[ ADD_ERRORS ] ).toHaveBeenCalledWith(
			expect.anything(), // state
			errors, // payload
		);
	} );

	it( 'shows a per-field error for missing lemma and spelling variant and rejects', async () => {
		const actions = createActions(
			unusedLexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			unusedTracker,
		);
		const mockMutations = {
			[ ADD_PER_FIELD_ERROR ]: jest.fn(),
		};
		const store = createStore( {
			state(): RootState {
				return {
					lemma: '',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: '',
					spellingVariantSearchInput: '',
				} as RootState;
			},
			actions,
			mutations: mockMutations,
		} );

		await expect( store.dispatch( CREATE_LEXEME ) ).rejects.toStrictEqual( new Error( 'Not all fields are valid' ) );

		expect( mockMutations[ ADD_PER_FIELD_ERROR ] ).toHaveBeenCalledTimes( 2 );
		expect( mockMutations[ ADD_PER_FIELD_ERROR ].mock.calls[ 0 ][ 1 ] ).toStrictEqual( {
			error: { messageKey: 'wikibaselexeme-newlexeme-lemma-empty-error' },
			field: 'lemmaErrors',
		} );
		expect( mockMutations[ ADD_PER_FIELD_ERROR ].mock.calls[ 1 ][ 1 ] ).toStrictEqual( {
			error: { messageKey: 'wikibaselexeme-newlexeme-lemma-language-empty-error' },
			field: 'spellingVariantErrors',
		} );
	} );
	it( 'shows a per-field error for missing lexical category and language and rejects', async () => {
		const actions = createActions(
			unusedLexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			unusedTracker,
		);
		const mockMutations = {
			[ ADD_PER_FIELD_ERROR ]: jest.fn(),
		};
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'example lemma',
					language: null,
					languageSearchInput: '',
					lexicalCategory: null,
					lexicalCategorySearchInput: '',
					spellingVariant: 'en',
				} as RootState;
			},
			actions,
			mutations: mockMutations,
		} );

		await expect( store.dispatch( CREATE_LEXEME ) ).rejects.toStrictEqual( new Error( 'Not all fields are valid' ) );

		expect( mockMutations[ ADD_PER_FIELD_ERROR ] ).toHaveBeenCalledTimes( 2 );
		expect( mockMutations[ ADD_PER_FIELD_ERROR ].mock.calls[ 0 ][ 1 ] ).toStrictEqual( {
			error: { messageKey: 'wikibaselexeme-newlexeme-language-empty-error' },
			field: 'languageErrors',
		} );
		expect( mockMutations[ ADD_PER_FIELD_ERROR ].mock.calls[ 1 ][ 1 ] ).toStrictEqual( {
			error: { messageKey: 'wikibaselexeme-newlexeme-lexicalcategory-empty-error' },
			field: 'lexicalCategoryErrors',
		} );
	} );
	it( 'shows a per-field error for invalid lexical category and language and rejects', async () => {
		const actions = createActions(
			unusedLexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			unusedTracker,
		);
		const mockMutations = {
			[ ADD_PER_FIELD_ERROR ]: jest.fn(),
		};
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'example lemma',
					language: null,
					languageSearchInput: 'invalid input',
					lexicalCategory: null,
					lexicalCategorySearchInput: 'invalid input',
					spellingVariant: 'en',
				} as RootState;
			},
			actions,
			mutations: mockMutations,
		} );

		await expect( store.dispatch( CREATE_LEXEME ) ).rejects.toStrictEqual( new Error( 'Not all fields are valid' ) );

		expect( mockMutations[ ADD_PER_FIELD_ERROR ] ).toHaveBeenCalledTimes( 2 );
		expect( mockMutations[ ADD_PER_FIELD_ERROR ].mock.calls[ 0 ][ 1 ] ).toStrictEqual( {
			error: { messageKey: 'wikibaselexeme-newlexeme-language-invalid-error' },
			field: 'languageErrors',
		} );
		expect( mockMutations[ ADD_PER_FIELD_ERROR ].mock.calls[ 1 ][ 1 ] ).toStrictEqual( {
			error: { messageKey: 'wikibaselexeme-newlexeme-lexicalcategory-invalid-error' },
			field: 'lexicalCategoryErrors',
		} );
	} );
	it( 'shows a per-field error for invalid spelling variant and rejects', async () => {
		const actions = createActions(
			unusedLexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			unusedTracker,
		);
		const mockMutations = {
			[ ADD_PER_FIELD_ERROR ]: jest.fn(),
		};
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'example lemma',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: '',
					spellingVariantSearchInput: 'invalid input',
				} as RootState;
			},
			actions,
			mutations: mockMutations,
		} );

		await expect( store.dispatch( CREATE_LEXEME ) ).rejects.toStrictEqual( new Error( 'Not all fields are valid' ) );

		expect( mockMutations[ ADD_PER_FIELD_ERROR ] ).toHaveBeenCalledTimes( 1 );
		expect( mockMutations[ ADD_PER_FIELD_ERROR ].mock.calls[ 0 ][ 1 ] ).toStrictEqual( {
			error: { messageKey: 'wikibaselexeme-newlexeme-lemma-language-invalid-error' },
			field: 'spellingVariantErrors',
		} );
	} );
} );

describe( 'HANDLE_LANGUAGE_CHANGE', () => {
	it( 'resets language fields in the store', async () => {
		const actions = createActions(
			unusedLexemeCreator,
			{
				getLanguageCodeFromItem: jest.fn().mockResolvedValue( null ),
			},
			unusedLanguageCodesProvider,
			unusedTracker,
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		const actionPromise = store.dispatch( HANDLE_LANGUAGE_CHANGE, { id: 'Q456' } );

		expect( store.state.language ).toStrictEqual( { id: 'Q456' } );
		expect( store.state.spellingVariant ).toBe( '' );
		expect( store.state.languageCodeFromLanguageItem ).toBe( undefined );

		await actionPromise;
	} );

	it( 'if no language item was selected, don\'t try to retrieve code', async () => {
		const retrieveMethod = jest.fn();
		const actions = createActions(
			unusedLexemeCreator,
			{
				getLanguageCodeFromItem: retrieveMethod,
			},
			unusedLanguageCodesProvider,
			unusedTracker,
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_LANGUAGE_CHANGE, null );

		expect( retrieveMethod ).not.toHaveBeenCalled();
	} );

	it( 'validates and sets to state if valid lang code was returned', async () => {
		const getLanguageCodeFromItemMock = jest.fn().mockResolvedValue( 'de' );
		const isValidMock = jest.fn().mockReturnValue( true );
		const actions = createActions(
			unusedLexemeCreator,
			{
				getLanguageCodeFromItem: getLanguageCodeFromItemMock,
			},
			{
				isValid: isValidMock,
				getLanguages: jest.fn(),
			},
			unusedTracker,
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_LANGUAGE_CHANGE, { id: 'Q456' } );

		expect( store.state.language ).toStrictEqual( { id: 'Q456' } );
		expect( store.state.spellingVariant ).toBe( '' );
		expect( store.state.languageCodeFromLanguageItem ).toBe( 'de' );
		expect( getLanguageCodeFromItemMock ).toHaveBeenCalledWith( 'Q456' );
		expect( isValidMock ).toHaveBeenCalledWith( 'de' );
	} );

	it( 'validates and sets false state if invalid lang code was returned', async () => {
		const isValidMock = jest.fn().mockReturnValue( false );
		const actions = createActions(
			unusedLexemeCreator,
			{
				getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'vandalism' ),
			},
			{
				isValid: isValidMock,
				getLanguages: jest.fn(),
			},
			unusedTracker,
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_LANGUAGE_CHANGE, { id: 'Q456' } );

		expect( store.state.language ).toStrictEqual( { id: 'Q456' } );
		expect( store.state.spellingVariant ).toBe( '' );
		expect( store.state.languageCodeFromLanguageItem ).toBe( false );
		expect( isValidMock ).toHaveBeenCalledWith( 'vandalism' );
	} );

	it.each( [
		[ false ],
		[ null ],
	] )( 'passes through, without validation, the non-string retrieved language code: `%s`', async ( retrievedLangCodeResult ) => {
		const isValidMock = jest.fn();
		const actions = createActions(
			unusedLexemeCreator,
			{
				getLanguageCodeFromItem: jest.fn().mockResolvedValue( retrievedLangCodeResult ),
			},
			{
				isValid: isValidMock,
				getLanguages: jest.fn(),
			},
			unusedTracker,
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_LANGUAGE_CHANGE, { id: 'Q456' } );

		expect( store.state.language ).toStrictEqual( { id: 'Q456' } );
		expect( store.state.spellingVariant ).toBe( '' );
		expect( store.state.languageCodeFromLanguageItem ).toBe( retrievedLangCodeResult );
		expect( isValidMock ).not.toHaveBeenCalled();
	} );

	it( 'does nothing when language does not change', async () => {
		const actions = createActions(
			unusedLexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			unusedTracker,
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: { id: 'Q123', display: {} },
					lexicalCategory: { id: 'Q234', display: {} },
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: null,
				} as RootState;
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_LANGUAGE_CHANGE, { id: 'Q123' } );

		expect( store.state.language ).toStrictEqual( { id: 'Q123' } );
		expect( store.state.spellingVariant ).toBe( 'bar' );
		expect( store.state.languageCodeFromLanguageItem ).toBe( null );
	} );
} );

describe( HANDLE_INIT_PARAMS, () => {

	it( 'does nothing given empty params', async () => {
		const state = (): RootState => ( {
			lemma: 'lemma',
			language: { id: 'Q123', display: {} },
			languageSearchInput: '',
			lexicalCategory: { id: 'Q234', display: {} },
			lexicalCategorySearchInput: '',
			spellingVariant: 'bar',
			spellingVariantSearchInput: 'bar',
			languageCodeFromLanguageItem: false,
			globalErrors: [],
			perFieldErrors: {
				lemmaErrors: [],
				languageErrors: [],
				lexicalCategoryErrors: [],
				spellingVariantErrors: [],
			},
		} );
		const actions = createActions(
			unusedLexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
			unusedTracker,
		);
		const store = createStore( {
			state,
			actions,
		} );

		await store.dispatch( HANDLE_INIT_PARAMS, {} );

		expect( store.state ).toStrictEqual( state() );
	} );

	it( 'sets state from all params', async () => {
		const actions = createActions(
			unusedLexemeCreator,
			unusedLangCodeRetriever,
			{
				isValid: jest.fn().mockReturnValue( true ),
				getLanguages: jest.fn(),
			},
			unusedTracker,
		);
		const store = createStore( {
			state(): RootState {
				return {
					lemma: '',
					language: null,
					languageSearchInput: '',
					lexicalCategory: null,
					lexicalCategorySearchInput: '',
					spellingVariant: '',
					spellingVariantSearchInput: '',
					languageCodeFromLanguageItem: undefined,
					globalErrors: [],
					perFieldErrors: {
						lemmaErrors: [],
						languageErrors: [],
						lexicalCategoryErrors: [],
						spellingVariantErrors: [],
					},
				};
			},
			actions,
			mutations,
		} );
		const language = {
			id: 'Q1860',
			display: {
				label: { language: 'en', value: 'English' },
			},
		};
		const lexicalCategory = {
			id: 'Q1064',
			display: {
				label: { language: 'en', value: 'noun' },
			},
		};

		await store.dispatch( HANDLE_INIT_PARAMS, {
			lemma: 'lemma',
			spellVarCode: 'en-gb',
			language: { ...language, languageCode: 'en' },
			lexicalCategory,
		} );

		expect( store.state ).toStrictEqual( {
			lemma: 'lemma',
			language,
			languageSearchInput: language.display.label.value,
			lexicalCategory,
			lexicalCategorySearchInput: lexicalCategory.display.label.value,
			spellingVariant: 'en-gb',
			spellingVariantSearchInput: 'en-gb',
			languageCodeFromLanguageItem: 'en',
			globalErrors: [],
			perFieldErrors: {
				lemmaErrors: [],
				languageErrors: [],
				lexicalCategoryErrors: [],
				spellingVariantErrors: [],
			},
		} );
	} );

	it( 'validates language code from language item', async () => {
		const isValidMock = jest.fn().mockReturnValue( false );
		const actions = createActions(
			unusedLexemeCreator,
			unusedLangCodeRetriever,
			{
				isValid: isValidMock,
				getLanguages: jest.fn(),
			},
			unusedTracker,
		);
		const store = createStore( {
			state(): RootState {
				return {
					lemma: '',
					language: null,
					languageSearchInput: '',
					lexicalCategory: null,
					lexicalCategorySearchInput: '',
					spellingVariant: '',
					spellingVariantSearchInput: '',
					languageCodeFromLanguageItem: undefined,
					globalErrors: [],
					perFieldErrors: {
						lemmaErrors: [],
						languageErrors: [],
						lexicalCategoryErrors: [],
						spellingVariantErrors: [],
					},
				};
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_INIT_PARAMS, {
			language: {
				id: 'Q1860',
				display: {},
				languageCode: 'invalid',
			},
		} );

		expect( store.state.language ).toStrictEqual( {
			id: 'Q1860',
			display: {},
		} );
		expect( store.state.languageCodeFromLanguageItem ).toBe( false );
		expect( isValidMock ).toHaveBeenCalledWith( 'invalid' );
	} );

} );
