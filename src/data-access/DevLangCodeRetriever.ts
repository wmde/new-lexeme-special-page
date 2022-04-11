import { processWbGetClaimsResponse, WbGetClaimsResponse } from './apiBasedLangCodeRetriever';
import LangCodeRetriever from './LangCodeRetriever';

export default class DevLangCodeRetriever implements LangCodeRetriever {
	public async getLanguageCodeFromItem( itemId: string ): Promise<string | false | null> {
		const response = await fetch( 'https://www.wikidata.org/w/api.php?' + new URLSearchParams( {
			action: 'wbgetclaims',
			entity: itemId,
			property: 'P218',
			props: '',
			format: 'json',
			origin: '*',
		} ) ).then( ( r ) => r.json() ) as WbGetClaimsResponse;

		return processWbGetClaimsResponse( response, 'P218' );
	}
}
