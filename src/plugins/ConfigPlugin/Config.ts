import { SearchedItemOption } from '@/data-access/ItemSearcher';
import {
	inject,
	InjectionKey,
} from 'vue';

export interface Config {
	readonly isAnonymous: boolean;
	readonly licenseUrl: string;
	readonly licenseName: string;
	readonly wikibaseLexemeTermLanguages: Map<string, string>;
	readonly lexicalCategorySuggestions: SearchedItemOption[];
	readonly placeholderExampleData: {
		languageLabel: string;
		lexicalCategoryLabel: string;
		lemma: string;
		spellingVariant: string;
	};
	readonly maxLemmaLength: number;
	readonly availableSearchProfiles: string[];
}

export const ConfigKey: InjectionKey<Config> = Symbol( 'Config' );

export function useConfig(): Config {
	return inject( ConfigKey, () => {
		throw new Error( 'No Config provided!' );
	}, true );
}
