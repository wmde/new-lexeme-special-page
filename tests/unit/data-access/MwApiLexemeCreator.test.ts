import { MwApi } from '@/@types/mediawiki';
import MwApiLexemeCreator from '@/data-access/MwApiLexemeCreator';
import { SubmitError } from '@/store/RootState';
import unusedApi from '../../mocks/unusedApi';
import $ from 'jquery';

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
			errorformat: 'html',
			formatversion: 2,
		} );
	} );

	describe( 'error handling', () => {

		it( 'maps API errors', () => {
			const deferred = $.Deferred();
			const result = { errors: [
				{ code: 'error1', html: 'error one' },
				{ code: 'error2', html: 'error two' },
				{ code: 'error3' },
			] };
			deferred.reject( 'error1', result, result );
			const api: MwApi = {
				...unusedApi,
				assertCurrentUser: ( params: object ) => ( { assert: 'user', ...params } ),
				postWithEditToken: jest.fn().mockReturnValue( deferred ),
			};
			const lexemeCreator = new MwApiLexemeCreator( api );

			return expect( () => lexemeCreator.createLexeme(
				'lemma',
				'en',
				'Q123',
				'Q456',
			) ).rejects.toStrictEqual( [
				{ type: 'error1', message: 'error one' },
				{ type: 'error2', message: 'error two' },
				{ type: 'error3' },
			] as SubmitError[] );
		} );

		it( 'handles HTTP errors', () => {
			const deferred = $.Deferred();
			deferred.reject( 'http', {
				xhr: undefined,
				textStatus: undefined,
				exception: undefined,
			} );
			const api: MwApi = {
				...unusedApi,
				assertCurrentUser: ( params: object ) => ( { assert: 'user', ...params } ),
				postWithEditToken: jest.fn().mockReturnValue( deferred ),
			};
			const lexemeCreator = new MwApiLexemeCreator( api );

			return expect( () => lexemeCreator.createLexeme(
				'lemma',
				'en',
				'Q123',
				'Q456',
			) ).rejects.toStrictEqual( [
				{ type: 'http' },
			] as SubmitError[] );
		} );

	} );

} );
