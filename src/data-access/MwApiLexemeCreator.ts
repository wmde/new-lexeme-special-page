import { MwApi, MwUtilGetUrl } from '@/@types/mediawiki';
import LexemeCreator from '@/data-access/LexemeCreator';
import { SubmitError } from '@/store/RootState';

type WbEditEntityResponse = {
	entity: {
		id: string;
	};
	tempuserredirect?: string|null;
};

type ApiResult = {
	errors: {
		code: string;
		html: string;
	}[];
};

export default class MwApiLexemeCreator implements LexemeCreator {

	private api: MwApi;
	private getUrl: MwUtilGetUrl;
	private tags: string[];

	public constructor( api: MwApi, getUrl: MwUtilGetUrl, tags: string[] = [] ) {
		this.api = api;
		this.getUrl = getUrl;
		this.tags = tags;
	}

	public async createLexeme(
		lemma: string,
		lemmaLanguageCode: string,
		lexemeLanguageItemId: string,
		lexicalCategoryItemId: string,
	): Promise<URL> {
		const params = this.api.assertCurrentUser( {
			action: 'wbeditentity',
			new: 'lexeme',
			tags: this.tags,
			data: JSON.stringify( {
				lemmas: {
					[ lemmaLanguageCode ]: {
						language: lemmaLanguageCode,
						value: lemma,
					},
				},
				language: lexemeLanguageItemId,
				lexicalCategory: lexicalCategoryItemId,
			} ),
			errorformat: 'html',
			formatversion: 2,
		} );
		const response = await this.api.postWithEditToken( params )
			// jQuery promises can resolve and reject with multiple values;
			// the third argument is either missing or the result
			.catch( ( code: string, _?: unknown, result?: ApiResult ): Promise<never> => {
				let errors: SubmitError[];
				try {
					if ( result && result.errors ) {
						errors = result.errors.map( ( apiError ) => {
							const submitError: SubmitError = { type: apiError.code };
							if ( apiError.html ) {
								submitError.message = apiError.html;
							}
							return submitError;
						} );
					} else {
						errors = [ { type: code } ];
					}
				} catch ( e ) {
					// eslint-disable-next-line no-console
					console.error( 'Unexpected API result', result, e );
					errors = [ { type: 'assertionerror' } ];
				}
				return Promise.reject( errors );
			} );

		const entityResponse = response as WbEditEntityResponse;
		const base = window.location.href;
		if ( entityResponse.tempuserredirect ) {
			return new URL( entityResponse.tempuserredirect, base );
		}
		return new URL( this.getUrl( `Special:EntityPage/${entityResponse.entity.id}` ), base );
	}

}
