import MessagesRepository from '@/plugins/MessagesPlugin/MessagesRepository';
import MessageKeys from '@/plugins/MessagesPlugin/MessageKeys';
import { InjectionKey } from 'vue';

/**
 * Usage (assuming this has been registered as a Vue plugin):
 *
 * FIXME: write something about when to use getText vs get
 *
 * `this.$messages.get( this.$messages.KEYS.LEMMA_INPUT_LABEL )`
 * `this.$messages.getText( this.$messages.KEYS.LEMMA_INPUT_LABEL )`
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

	public get( messageKey: MessageKeys, ...params: readonly ( string|HTMLElement )[] ): string {
		return this.messagesRepository.get( messageKey, ...params );
	}

	public getUnescaped( messageKey: MessageKeys, ...params: readonly string[] ): string {
		return this.messagesRepository.getText( messageKey, ...params );
	}
}

export const MessagesKey: InjectionKey<Messages> = Symbol( 'Messages' );
