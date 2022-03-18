import MessagesRepository from '@/plugins/MessagesPlugin/MessagesRepository';
import { MwMessages } from '@/@types/mediawiki';

export default class MwMessagesRepository implements MessagesRepository {

	private mwMessages: MwMessages;

	public constructor( mwMessages: MwMessages ) {
		this.mwMessages = mwMessages;
	}

	public get( messageKey: string, ...params: readonly ( string|HTMLElement )[] ): string {
		return this.mwMessages( messageKey, ...params ).parse();
	}

	public getText( messageKey: string, ...params: readonly string[] ): string {
		return this.mwMessages( messageKey, ...params ).text();
	}
}
