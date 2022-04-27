import { MwUtilGetUrl } from '@/@types/mediawiki';
import SearchLinker from '@/plugins/SearchLinkerPlugin/SearchLinker';

export default class MediaWikiSearchLinker implements SearchLinker {

	public constructor(
		private readonly getUrl: MwUtilGetUrl,
		private readonly lexemeNamespaceId: number,
	) {}

	public getSearchUrlForLexeme( searchTerm: string ): string {
		return this.getUrl( 'Special:Search', {
			search: searchTerm,
			[ `ns${this.lexemeNamespaceId}` ]: 1,
		} );
	}

}
