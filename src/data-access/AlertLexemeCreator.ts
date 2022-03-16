import LexemeCreator from './LexemeCreator';

export default class AlertLexemeCreator implements LexemeCreator {

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
