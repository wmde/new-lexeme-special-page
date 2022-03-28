import {
	inject,
	InjectionKey,
} from 'vue';

export interface Config {
	readonly licenseUrl: string;
	readonly licenseName: string;
	readonly wikibaseLexemeTermLanguages: string[];
}

export const ConfigKey: InjectionKey<Config> = Symbol( 'Config' );

export function useConfig(): Config {
	return inject( ConfigKey, () => {
		throw new Error( 'No Config provided!' );
	}, true );
}
