export interface MwMessage {
	text(): string;
	parse(): string;
}
export type MwMessages = ( key: string, ...params: readonly ( string|HTMLElement )[] ) => MwMessage;

export interface MwApi {
	assertCurrentUser( params: object ): object;
	postWithEditToken( params: object ): Promise<unknown>;
}

export interface MediaWiki {
	message: MwMessages;
	Api: new() => MwApi;
}
