import MessagesRepository from '@/plugins/MessagesPlugin/MessagesRepository';
import MessageKeys from '@/plugins/MessagesPlugin/MessageKeys';
import { inject, InjectionKey } from 'vue';

/**
 * Usage:
 *
 * const messages = useMessages();
 *
 * messages.get( 'wikibaselexeme-newlexeme-lemma' )
 * messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma' )
 */
export default class Messages {

	private readonly messagesRepository: MessagesRepository;

	public constructor( messagesRepository?: MessagesRepository ) {
		if ( !messagesRepository ) {
			this.messagesRepository = {
				get( messageKey ) {
					return `⧼${messageKey}⧽`;
				},
				getText( messageKey ) {
					return `⧼${messageKey}⧽`;
				},
			};
			return;
		}
		this.messagesRepository = messagesRepository;
	}

	/**
	 * Parse the message and return it as HTML, with unsafe markup escaped as necessary.
	 * Use this with v-html.
	 *
	 * @param {string} messageKey One of the well-known {@link MessageKeys}.
	 * @param {...string|HTMLElement} params Parameters for the message
	 * ($1, $2, ... in the message source).
	 * @return {string} HTML
	 */
	public get( messageKey: MessageKeys, ...params: readonly ( string|HTMLElement )[] ): string {
		return this.messagesRepository.get( messageKey, ...params );
	}

	/**
	 * Get the message, with parameters replaced but without parsing or escaping anything.
	 * Use this where the result will be escaped already, e.g. in {{}}.
	 *
	 * @param {string} messageKey One of the well-known {@link MessageKeys}.
	 * @param {...string} params Parameters for the message ($1, $2, ... in the message source).
	 * @return {string} plain text
	 */
	public getUnescaped( messageKey: MessageKeys, ...params: readonly string[] ): string {
		return this.messagesRepository.getText( messageKey, ...params );
	}
}

export const MessagesKey: InjectionKey<Messages> = Symbol( 'Messages' );

export function useMessages(): Messages {
	return inject( MessagesKey, new Messages() );
}
