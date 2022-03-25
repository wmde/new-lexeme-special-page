import LexemeCreator from './LexemeCreator';

/** Lexeme creator for the dev entry point. */
export default class DevLexemeCreator implements LexemeCreator {

	public async createLexeme(
		lemma: string,
		lemmaLanguageCode: string,
		lexemeLanguageItemId: string,
		lexicalCategoryItemId: string,
	): Promise<string> {

		await new Promise( ( resolve ) => setTimeout( resolve, 0 ) );
		alert( `Create Lexeqme "${lemma}"@${lemmaLanguageCode} as ${lexemeLanguageItemId} ${lexicalCategoryItemId}` );
		return Promise.reject( [ { type: 'dev', message: '<em>dev error message</em>' } ] );
		return 'L1';
	}
}
