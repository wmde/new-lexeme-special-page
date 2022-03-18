export interface MwMessage {
	text(): string;
	parse(): string;
}
export type MwMessages = ( key: string, ...params: readonly ( string|HTMLElement )[] ) => MwMessage;

export interface MwApi {
	get( params: object ): Promise<unknown>;
	assertCurrentUser( params: object ): object;
	postWithEditToken( params: object ): Promise<unknown>;
}

interface MwApiOptions {
	parameters?: object;
}

interface MwConfig {
	get( key: string ): unknown;
}

export interface MediaWiki {
	config: MwConfig;
	message: MwMessages;
	Api: new( defaultOptions?: MwApiOptions ) => MwApi;
}
