import { MwApi } from '@/@types/mediawiki';
import MwApiLexemeCreator from '@/data-access/MwApiLexemeCreator';
import { SubmitError } from '@/store/RootState';
import unusedApi from '../../mocks/unusedApi';

/* Return an object that works a bit like a jQuery.Deferred() rejected with the given args. */
function mockRejectedDeferred( ...args: unknown[] ): unknown {
	return {
		catch<T>( callback: ( ..._: unknown[] ) => PromiseLike<T> ): Promise<T> {
			return Promise.resolve( callback( ...args ) );
		},
	};
}

function mwGetUrl( pageName: string | null ) {
	// relative URL (T358754), relative to testEnvironmentOptions.url in jest.config.js
	return `/${pageName}`;
}

describe( 'MwApiLexemeCreator', () => {

	it( 'POSTs the right data', async () => {
		const api: MwApi = {
			...unusedApi,
			assertCurrentUser: ( params: object ) => ( { assert: 'user', ...params } ),
			postWithEditToken: jest.fn().mockResolvedValue( { entity: { id: 'L123' } } ),
		};
		const lexemeCreator = new MwApiLexemeCreator( api, mwGetUrl, [ 'tag' ] );

		const redirectUrl = await lexemeCreator.createLexeme(
			'lemma',
			'en',
			'Q123',
			'Q456',
		);

		expect( redirectUrl.toString() ).toBe( 'https://wiki.example/Special:EntityPage/L123' );
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

	it( 'Follows redirect if API returns redirect', async () => {
		const loginUrl = 'https://wiki.example/login?redirectto=somewhere';
		const api: MwApi = {
			...unusedApi,
			assertCurrentUser: ( params: object ) => ( { assert: 'user', ...params } ),
			postWithEditToken: jest.fn().mockResolvedValue( {
				entity: { id: 'L123' },
				tempuserredirect: loginUrl,
			} ),
		};
		const lexemeCreator = new MwApiLexemeCreator( api, mwGetUrl, [ 'tag' ] );

		const redirectUrl = await lexemeCreator.createLexeme(
			'lemma',
			'en',
			'Q123',
			'Q456',
		);

		expect( redirectUrl.toString() ).toBe( loginUrl );
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
				forms: [
					{
						add: '',
						representations: {
							en: {
								language: 'en',
								value: 'lemma',
							},
						},
					},
				],
			} ),
			assert: 'user',
			errorformat: 'html',
			formatversion: 2,
		} );
	} );

	describe( 'error handling', () => {

		it( 'maps API errors', () => {
			const result = { errors: [
				{ code: 'error1', html: 'error one' },
				{ code: 'error2', html: 'error two' },
				{ code: 'error3' },
			] };
			const deferred = mockRejectedDeferred( 'error1', result, result );
			const api: MwApi = {
				...unusedApi,
				assertCurrentUser: ( params: object ) => ( { assert: 'user', ...params } ),
				postWithEditToken: jest.fn().mockReturnValue( deferred ),
			};
			const lexemeCreator = new MwApiLexemeCreator( api, mwGetUrl );

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
			const deferred = mockRejectedDeferred( 'http', {
				xhr: undefined,
				textStatus: undefined,
				exception: undefined,
			} );
			const api: MwApi = {
				...unusedApi,
				assertCurrentUser: ( params: object ) => ( { assert: 'user', ...params } ),
				postWithEditToken: jest.fn().mockReturnValue( deferred ),
			};
			const lexemeCreator = new MwApiLexemeCreator( api, mwGetUrl );

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
