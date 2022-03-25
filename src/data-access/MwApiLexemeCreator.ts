import { MwApi } from '@/@types/mediawiki';
import LexemeCreator from '@/data-access/LexemeCreator';

type WbEditEntityResponse = {
	entity: {
		id: string;
	};
};

export default class MwApiLexemeCreator implements LexemeCreator {

	private api: MwApi;
	private tags: string[];

	public constructor( api: MwApi, tags: string[] = [] ) {
		this.api = api;
		this.tags = tags;
	}

	public async createLexeme(
		lemma: string,
		lemmaLanguageCode: string,
		lexemeLanguageItemId: string,
		lexicalCategoryItemId: string,
	): Promise<string> {
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
		} );
		const response = await this.api.postWithEditToken( params )
			.catch( () => {
				return Promise.reject( [ { type: 'unknown' } ] );
			} );

		return ( response as WbEditEntityResponse ).entity.id;
	}

}
