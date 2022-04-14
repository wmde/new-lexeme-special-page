import { MwApi } from '@/@types/mediawiki';
import LangCodeRetriever from './LangCodeRetriever';
import { processWbGetClaimsResponse, WbGetClaimsResponse } from './apiBasedLangCodeRetriever';

export default class MwApiLangCodeRetriever implements LangCodeRetriever {

	private readonly api: MwApi;
	private readonly languageCodeProperty: string | null;

	public constructor( api: MwApi, languageCodeProperty: string | null ) {
		this.api = api;
		this.languageCodeProperty = languageCodeProperty;
	}

	public async getLanguageCodeFromItem( itemId: string ): Promise<string | null | false> {
		if ( !this.languageCodeProperty ) {
			return null;
		}

		const response = await this.api.get( {
			action: 'wbgetclaims',
			entity: itemId,
			property: this.languageCodeProperty,
			props: '',
		} ).catch( ( code: string, _?: unknown, result?: unknown ) => {
			// eslint-disable-next-line no-console
			console.warn( `Error while retrieving language code in ${this.languageCodeProperty} for item ${itemId}: ${code}`, result );

			return false;
		} );

		if ( response === false ) {
			return false;
		}

		return processWbGetClaimsResponse(
			response as WbGetClaimsResponse,
			this.languageCodeProperty,
		);
	}
}
