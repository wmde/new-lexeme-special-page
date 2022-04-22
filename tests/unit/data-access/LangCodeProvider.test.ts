import { ListLanguageCodesProvider } from '@/data-access/LanguageCodesProvider';

describe( 'LanguageCodesProvider', () => {
	describe( 'isValidLangCode', () => {
		it( 'returns "true" for a valid language code', () => {
			const listOfValidCodes = [ 'en', 'en-gb', 'de' ];
			const sut = new ListLanguageCodesProvider( listOfValidCodes );

			const actual = sut.isValid( 'en-gb' );

			expect( actual ).toBe( true );
		} );
		it( 'returns "false" for an invalid language code', () => {
			const listOfValidCodes = [ 'en', 'en-gb', 'de' ];
			const sut = new ListLanguageCodesProvider( listOfValidCodes );

			const actual = sut.isValid( 'raccoon' );

			expect( actual ).toBe( false );
		} );
	} );
} );
