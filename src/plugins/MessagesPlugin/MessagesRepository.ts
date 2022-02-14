export default interface MessagesRepository {
	/**
	 * @return HTML
	 * Any bad tags in the message source are escaped.
	 */
	get( messageKey: string, ...params: readonly ( string| HTMLElement )[] ): string;

	/**
	 * @return plain text
	 * HTML-significant characters in the message source are not escaped,
	 * and the result must not be used as HTML.
	 */
	getText( messageKey: string, ...params: readonly string[] ): string;
}
