export default interface LexemeCreator {

	/**
	 * Create a lexeme with a single Lemma and no Statements, Forms or Senses.
	 *
	 * @param lemma The Lemma of the Lexeme.
	 * @param lemmaLanguageCode The language code of the Lemma.
	 * @param lexemeLanguageItemId The item ID of the Lexeme language.
	 * @param lexicalCategoryItemId The item ID of the Lexeme lexical category.
	 * @return The ID of the newly created lexeme.
	 */
	createLexeme(
		lemma: string,
		lemmaLanguageCode: string,
		lexemeLanguageItemId: string,
		lexicalCategoryItemId: string,
	): Promise<string>;

}
