import createActions, { CREATE_LEXEME } from '@/store/actions';
import LexemeCreator from '@/data-access/LexemeCreator';
import {
	ADD_ERRORS,
	CLEAR_ERRORS,
} from '@/store/mutations';
import RootState, { SubmitError } from '@/store/RootState';
import { createStore } from 'vuex';

describe( CREATE_LEXEME, () => {

	it( 'calls lexemeCreator with the right data', async () => {
		const lexemeCreator: LexemeCreator = {
			createLexeme: jest.fn().mockResolvedValue( 'L123' ),
		};

		const actions = createActions( lexemeCreator );
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					spellingVariant: 'de',
					language: 'Q123',
					lexicalCategory: 'Q234',
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

		const actions = createActions( lexemeCreator );
		const mutations = {
			[ CLEAR_ERRORS ]: jest.fn(),
			[ ADD_ERRORS ]: jest.fn(),
		};
		const store = createStore( {
			state(): RootState {
				return {
					lemma: 'foo',
					language: 'Q123',
					lexicalCategory: 'Q234',
				} as RootState;
			},
			actions,
			mutations: mutations,
		} );

		await expect( store.dispatch( CREATE_LEXEME ) ).rejects.toBe( null );

		expect( mutations[ CLEAR_ERRORS ] ).toHaveBeenCalled();
		expect( mutations[ ADD_ERRORS ] ).toHaveBeenCalledWith(
			expect.anything(), // state
			errors, // payload
		);
	} );

} );
