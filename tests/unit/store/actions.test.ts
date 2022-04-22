import createActions, { CREATE_LEXEME, HANDLE_LANGUAGE_CHANGE } from '@/store/actions';
import LexemeCreator from '@/data-access/LexemeCreator';
import {
	ADD_ERRORS,
	CLEAR_ERRORS,
} from '@/store/mutations';
import RootState, { SubmitError } from '@/store/RootState';
import { createStore } from 'vuex';
import unusedLangCodeRetriever from '../../mocks/unusedLangCodeRetriever';
import unusedLanguageCodesProvider from '../../mocks/unusedLanguageCodesProvider';
import unusedLexemeCreator from '../../mocks/unusedLexemeCreator';
import mutations from '@/store/mutations';

describe( CREATE_LEXEME, () => {

	it( 'calls lexemeCreator with the inferred language variant', async () => {
		const lexemeCreator: LexemeCreator = {
			createLexeme: jest.fn().mockResolvedValue( 'L123' ),
		};

		const actions = createActions(
			lexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
		);
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					spellingVariant: '',
					language: 'Q123',
					lexicalCategory: 'Q234',
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
	} );

	it( 'calls lexemeCreator with the language variant selected by the user', async () => {
		const lexemeCreator: LexemeCreator = {
			createLexeme: jest.fn().mockResolvedValue( 'L123' ),
		};

		const actions = createActions(
			lexemeCreator,
			unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
		);
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					spellingVariant: 'de',
					language: 'Q123',
					lexicalCategory: 'Q234',
					languageCodeFromLanguageItem: null,
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
			'de',
			'Q123',
			'Q234',
		);
	} );

	it( 'clears errors and adds new ones to the store', async () => {
		const errors: SubmitError[] = [
			{ type: 'error1', message: 'error one' },
			{ type: 'error2' },
		];
		const lexemeCreator: LexemeCreator = {
			createLexeme: jest.fn().mockRejectedValue( errors ),
		};

		const actions = createActions( lexemeCreator, unusedLangCodeRetriever,
			unusedLanguageCodesProvider,
		);
		const mockMutations = {
			[ CLEAR_ERRORS ]: jest.fn(),
			[ ADD_ERRORS ]: jest.fn(),
		};
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: 'Q123',
					lexicalCategory: 'Q234',
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

} );

describe( 'HANDLE_LANGUAGE_CHANGE', () => {
	it( 'resets language fields in the store', async () => {
		const actions = createActions(
			unusedLexemeCreator,
			{
				getLanguageCodeFromItem: jest.fn().mockResolvedValue( null ),
			},
			unusedLanguageCodesProvider,
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: 'Q123',
					lexicalCategory: 'Q234',
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		const actionPromise = store.dispatch( HANDLE_LANGUAGE_CHANGE, 'Q456' );

		expect( store.state.language ).toBe( 'Q456' );
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
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: 'Q123',
					lexicalCategory: 'Q234',
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
		const isValidMock = jest.fn().mockReturnValue( true );
		const actions = createActions(
			unusedLexemeCreator,
			{
				getLanguageCodeFromItem: jest.fn().mockResolvedValue( 'de' ),
			},
			{
				isValid: isValidMock,
				getLanguageCodes: jest.fn(),
			},
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: 'Q123',
					lexicalCategory: 'Q234',
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_LANGUAGE_CHANGE, 'Q456' );

		expect( store.state.language ).toBe( 'Q456' );
		expect( store.state.spellingVariant ).toBe( '' );
		expect( store.state.languageCodeFromLanguageItem ).toBe( 'de' );
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
				getLanguageCodes: jest.fn(),
			},
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: 'Q123',
					lexicalCategory: 'Q234',
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_LANGUAGE_CHANGE, 'Q456' );

		expect( store.state.language ).toBe( 'Q456' );
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
				getLanguageCodes: jest.fn(),
			},
		);

		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: 'Q123',
					lexicalCategory: 'Q234',
					spellingVariant: 'bar',
					languageCodeFromLanguageItem: false,
				} as RootState;
			},
			actions,
			mutations,
		} );

		await store.dispatch( HANDLE_LANGUAGE_CHANGE, 'Q456' );

		expect( store.state.language ).toBe( 'Q456' );
		expect( store.state.spellingVariant ).toBe( '' );
		expect( store.state.languageCodeFromLanguageItem ).toBe( retrievedLangCodeResult );
		expect( isValidMock ).not.toHaveBeenCalled();
	} );
} );
