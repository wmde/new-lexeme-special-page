import { MwApi } from '@/@types/mediawiki';
import LangCodeRetriever from './LangCodeRetriever';
import { processWbGetClaimsResponse, WbGetClaimsResponse } from './apiBaseLangCodeRetriever';

export default class MwApiLangCodeRetriever implements LangCodeRetriever {

	public constructor( private api: MwApi, private languageCodeProperty: string ) {
	}

	public async getLanguageCodeFromItem( itemId: string ): Promise<string | null | false> {
		// TODO handle errors
		const response = await this.api.get( {
			action: 'wbgetclaims',
			entity: itemId,
			property: this.languageCodeProperty,
			props: '',
		} ) as WbGetClaimsResponse;

		return processWbGetClaimsResponse( response, this.languageCodeProperty );
	}
}
