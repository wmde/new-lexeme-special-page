import { SearchedItemOption } from '@/data-access/ItemSearcher';

/*
 * Utility code shared by several API-based ItemSearcher implementations.
 */

export const commonParams: Record<string, string> = {
	action: 'wbsearchentities',
	type: 'item',
	limit: '10',
};

export type WbSearchEntitiesResponse = {
	search: {
		id: string;
		label?: string;
		description?: string;
	}[];
};

export function processResponse(
	response: WbSearchEntitiesResponse,
	defaultLanguageCode: string,
): SearchedItemOption[] {
	return response.search.map( ( result ) => {
		const option: SearchedItemOption = {
			itemId: result.id,
			display: {},
		};

		if ( result.label ) {
			option.display.label = {
				language: defaultLanguageCode, // TODO T104344
				value: result.label,
			};
		}

		if ( result.description ) {
			option.display.description = {
				language: defaultLanguageCode, // TODO T104344
				value: result.description,
			};
		}

		return option;
	} );
}
