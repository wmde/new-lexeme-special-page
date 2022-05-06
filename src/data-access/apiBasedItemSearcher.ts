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
		display: {
			label?: {
				language: string;
				value: string;
			};
			description?: {
				language: string;
				value: string;
			};
		};
	}[];
};

export function processResponse(
	response: WbSearchEntitiesResponse,
): SearchedItemOption[] {
	return response.search.map( ( result ): SearchedItemOption => {
		return {
			id: result.id,
			display: result.display,
		};
	} );
}
