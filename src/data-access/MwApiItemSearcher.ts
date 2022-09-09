import { MwApi } from '@/@types/mediawiki';
import {
	commonParams,
	processResponse,
	WbSearchEntitiesResponse,
} from '@/data-access/apiBasedItemSearcher';
import ItemSearcher, { SearchedItemOption } from '@/data-access/ItemSearcher';

export default class MwApiItemSearcher implements ItemSearcher {

	private api: MwApi;
	private languageCode: string;

	public constructor( api: MwApi, languageCode: string ) {
		this.api = api;
		this.languageCode = languageCode;
	}

	public async searchItems(
		searchTerm: string,
		offset?: number,
		additionalParams: Record<string, string> = {},
	): Promise<SearchedItemOption[]> {
		// TODO handle errors
		const response = await this.api.get( {
			...commonParams,
			search: searchTerm,
			language: this.languageCode,
			continue: offset,
			...additionalParams,
		} ) as WbSearchEntitiesResponse;

		return processResponse( response );
	}

}
