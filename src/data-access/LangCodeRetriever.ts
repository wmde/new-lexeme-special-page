export default interface LangCodeRetriever {

	/*
	 * Returns the language code associated with the Item,
	 * which may or may not be a valid language code, validation needs to be done by the caller.
	 * Returns `null` if the Item has no associated language code (including a novalue statement).
	 * Returns `false` if the Item has somevalue for the language code property.
	 */
	getLanguageCodeFromItem( itemId: string ): Promise<string | null | false>;
}
