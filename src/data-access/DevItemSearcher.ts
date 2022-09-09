import {
	commonParams,
	processResponse,
	WbSearchEntitiesResponse,
} from '@/data-access/apiBasedItemSearcher';
import ItemSearcher, { SearchedItemOption } from '@/data-access/ItemSearcher';

/**
 * Item searcher for the dev entry point.
 * Searches Wikidata (hard-coded), and also supports some bespoke syntax:
 * =Q123 will always return a single fake search result for that item ID.
 * (This is meant to be used in the Cypress tests.
 * A syntax for synthetic errors might also be added later.)
 */
export default class DevItemSearcher implements ItemSearcher {

	public async searchItems(
		searchTerm: string,
		offset = 0,
		additionalParams = {},
	): Promise<SearchedItemOption[]> {
		const match = searchTerm.match( /^=(Q[1-9][0-9]*)$/ );
		if ( match ) {
			const itemId = match[ 1 ];
			return [ {
				id: itemId,
				display: {
					label: {
						language: 'en',
						value: `fake label for ${itemId}`,
					},
					description: {
						language: 'en',
						value: `fake description for ${itemId}`,
					},
				},
			} ];
		}

		const response = await fetch( 'https://www.wikidata.org/w/api.php?' + new URLSearchParams( {
			...commonParams,
			search: searchTerm,
			language: 'en',
			continue: offset.toString(),
			format: 'json',
			origin: '*',
			...additionalParams,
		} ) ).then( ( r ) => r.json() ) as WbSearchEntitiesResponse;

		return processResponse( response );
	}

}
