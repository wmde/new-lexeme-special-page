import { MwApi } from '@/@types/mediawiki';
import MwApiLexemeCreator from '@/data-access/MwApiLexemeCreator';
import unusedApi from '../../mocks/unusedApi';

describe( 'MwApiLexemeCreator', () => {

	it( 'POSTs the right data', async () => {
		const api: MwApi = {
			...unusedApi,
			assertCurrentUser: ( params: object ) => ( { assert: 'user', ...params } ),
			postWithEditToken: jest.fn().mockResolvedValue( { entity: { id: 'L123' } } ),
		};
		const lexemeCreator = new MwApiLexemeCreator( api, [ 'tag' ] );

		const id = await lexemeCreator.createLexeme(
			'lemma',
			'en',
			'Q123',
			'Q456',
		);

		expect( id ).toBe( 'L123' );
		expect( api.postWithEditToken ).toHaveBeenCalledTimes( 1 );
		expect( api.postWithEditToken ).toHaveBeenCalledWith( {
			action: 'wbeditentity',
			new: 'lexeme',
			tags: [ 'tag' ],
			data: JSON.stringify( {
				lemmas: {
					en: {
						language: 'en',
						value: 'lemma',
					},
				},
				language: 'Q123',
				lexicalCategory: 'Q456',
			} ),
			assert: 'user',
		} );
	} );

} );
