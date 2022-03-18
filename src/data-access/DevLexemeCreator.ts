import LexemeCreator from './LexemeCreator';

/** Lexeme creator for the dev entry point. */
export default class DevLexemeCreator implements LexemeCreator {

	public async createLexeme(
		lemma: string,
		lemmaLanguageCode: string,
		lexemeLanguageItemId: string,
		lexicalCategoryItemId: string,
	): Promise<string> {
		// eslint-disable-next-line no-alert
		alert( `Create Lexeme "${lemma}"@${lemmaLanguageCode} as ${lexemeLanguageItemId} ${lexicalCategoryItemId}` );
		return 'L1';
	}

}
