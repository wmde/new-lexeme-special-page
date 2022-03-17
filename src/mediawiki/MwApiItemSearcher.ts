import { MwApi } from '@/@types/mediawiki';
import ItemSearcher, { SearchedItemOption } from '@/data-access/ItemSearcher';

type WbSearchEntitiesResponse = {
	search: {
		id: string;
		label: string;
		description?: string;
	}[];
};

export default class MwApiItemSearcher implements ItemSearcher {

	private api: MwApi;
	private languageCode: string;

	public constructor( api: MwApi, languageCode: string ) {
		this.api = api;
		this.languageCode = languageCode;
	}

	public async searchItems( searchTerm: string, offset?: number ): Promise<SearchedItemOption[]> {
		const response = await this.api.get( {
			action: 'wbsearchentities',
			search: searchTerm,
			language: this.languageCode,
			type: 'item',
			limit: 10,
			continue: offset,
		} ) as WbSearchEntitiesResponse;

		return response.search.map( ( result ) => {
			const option: SearchedItemOption = {
				itemId: result.id,
				display: {
					label: {
						language: this.languageCode, // TODO T104344
						value: result.label,
					},
				},
			};

			if ( result.description ) {
				option.display.description = {
					language: this.languageCode, // TODO T104344
					value: result.description,
				};
			}

			return option;
		} );
	}

}
