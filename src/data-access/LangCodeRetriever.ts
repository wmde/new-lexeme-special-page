export default interface LangCodeRetriever {

	/*
	 * Returns the language code associated with the Item,
	 * which may or may not be a valid language code, validation needs to be done by the caller.
	 * Returns `null` if there is no language code available (incl. missing or novalue statement).
	 * Returns `false` if the Item has somevalue for the language code property.
	 */
	getLanguageCodeFromItem( itemId: string ): Promise<string | null | false>;
}
