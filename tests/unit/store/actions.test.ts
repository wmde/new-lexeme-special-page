import createActions, { CREATE_LEXEME } from '@/store/actions';
import LexemeCreator from '@/data-access/LexemeCreator';
import RootState from '@/store/RootState';
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
					language: 'Q123',
					lexicalCategory: 'Q234',
				} as RootState;
			},
			actions,
		} );

		const lexemeId = await store.dispatch( CREATE_LEXEME );

		expect( lexemeId ).toBe( 'L123' );
		expect( lexemeCreator.createLexeme ).toHaveBeenCalledWith(
			'foo',
			'en',
			'Q123',
			'Q234',
		);
	} );

} );
