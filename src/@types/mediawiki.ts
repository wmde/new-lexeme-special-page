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

export type MwTrack = ( topic: `${'timing' | 'counter'}.${string}`, data?: object | number | string ) => void;

/** Return a URL for the given page name and params. Note that the returned URL may be relative! */
export type MwUtilGetUrl = ( pageName: string|null, params?: Record<string, unknown> ) => string;

export interface MediaWiki {
	config: MwConfig;
	message: MwMessages;
	Api: new( defaultOptions?: MwApiOptions ) => MwApi;
	track: MwTrack;
	util: {
		getUrl: MwUtilGetUrl;
	};
}
