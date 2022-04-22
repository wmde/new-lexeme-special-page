import { ListLanguageCodesProvider } from '@/data-access/LanguageCodesProvider';

describe( 'LanguageCodesProvider', () => {
	describe( 'isValidLangCode', () => {
		it( 'returns "true" for a valid language code', () => {
			const listOfValidCodes = new Map( [ [ 'en', 'English' ], [ 'en-gb', 'British English' ], [ 'de', 'German' ] ] );
			const sut = new ListLanguageCodesProvider( listOfValidCodes );

			const actual = sut.isValid( 'en-gb' );

			expect( actual ).toBe( true );
		} );
		it( 'returns "false" for an invalid language code', () => {
			const listOfValidCodes = new Map( [ [ 'en', 'English' ], [ 'en-gb', 'British English' ], [ 'de', 'German' ] ] );
			const sut = new ListLanguageCodesProvider( listOfValidCodes );

			const actual = sut.isValid( 'raccoon' );

			expect( actual ).toBe( false );
		} );
	} );

	describe( 'getLanguageCodes', () => {
		it( 'returns list of language codes and names', () => {
			const listOfValidCodes = new Map( [ [ 'en', 'English' ], [ 'en-gb', 'British English' ], [ 'de', 'German' ] ] );
			const sut = new ListLanguageCodesProvider( listOfValidCodes );

			const actual = sut.getLanguages();

			expect( actual ).toStrictEqual( new Map( [ [ 'en', 'English' ], [ 'en-gb', 'British English' ], [ 'de', 'German' ] ] ) );
		} );
	} );
} );
