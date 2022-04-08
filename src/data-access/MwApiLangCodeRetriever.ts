import { MwApi } from '@/@types/mediawiki';
import LangCodeRetriever from './LangCodeRetriever';
import { processWbGetClaimsResponse, WbGetClaimsResponse } from './apiBasedLangCodeRetriever';

export default class MwApiLangCodeRetriever implements LangCodeRetriever {

	private readonly api: MwApi;
	private readonly languageCodeProperty: string;

	public constructor( api: MwApi, languageCodeProperty: string ) {
		if ( typeof languageCodeProperty !== 'string' ) {
			throw new Error( `Expected languageCodeProperty to be propertyId but received ${languageCodeProperty} instead!` );
		}
		this.api = api;
		this.languageCodeProperty = languageCodeProperty;
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
