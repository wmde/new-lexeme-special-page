import ItemSearcher, { SearchedItemOption } from '@/data-access/ItemSearcher';

type WbSearchEntitiesResponse = {
	search: {
		id: string;
		label: string;
		description?: string;
	}[];
};

export default class FetchItemSearcher implements ItemSearcher {

	public async searchItems( searchTerm: string, offset = 0 ): Promise<SearchedItemOption[]> {
		const match = searchTerm.match( /^=(Q[1-9][0-9]*)$/ );
		if ( match ) {
			const itemId = match[ 1 ];
			return [ {
				itemId: itemId,
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

		// TODO a lot of this is duplicated from MwApiItemSearcher…

		const response = await fetch( 'https://www.wikidata.org/w/api.php?' + new URLSearchParams( {
			action: 'wbsearchentities',
			search: searchTerm,
			language: 'en',
			type: 'item',
			limit: '10',
			continue: offset.toString(),
			format: 'json',
			origin: '*',
		} ) ).then( ( r ) => r.json() ) as WbSearchEntitiesResponse;

		return response.search.map( ( result ) => {
			const option: SearchedItemOption = {
				itemId: result.id,
				display: {
					label: {
						language: 'en', // TODO T104344
						value: result.label,
					},
				},
			};

			if ( result.description ) {
				option.display.description = {
					language: 'en', // TODO T104344
					value: result.description,
				};
			}

			return option;
		} );
	}

}
