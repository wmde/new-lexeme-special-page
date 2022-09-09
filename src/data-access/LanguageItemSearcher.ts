import ItemSearcher, { SearchedItemOption } from '@/data-access/ItemSearcher';
import MwApiItemSearcher from '@/data-access/MwApiItemSearcher';

export default class LanguageItemSearcher implements ItemSearcher {

	private readonly LANGUAGE_PROFILE_NAME: string = 'language' as const;

	private itemSearcher: MwApiItemSearcher;
	private availableSearchProfiles: string[];

	public constructor( itemSearcher: MwApiItemSearcher, availableSearchProfiles: string[] ) {
		this.itemSearcher = itemSearcher;
		this.availableSearchProfiles = availableSearchProfiles;
	}

	public async searchItems( searchTerm: string, offset?: number ): Promise<SearchedItemOption[]> {
		const additionalParams: Record<string, string> = {};
		if ( this.availableSearchProfiles.includes( this.LANGUAGE_PROFILE_NAME ) ) {
			additionalParams.profile = this.LANGUAGE_PROFILE_NAME;
		}
		return this.itemSearcher.searchItems( searchTerm, offset, additionalParams );
	}

}
