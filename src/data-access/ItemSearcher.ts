export interface SearchedItemOption {
	id: string;
	display: {
		label?: {
			language: string;
			value: string;
		}; // Term
		description?: {
			language: string;
			value: string;
		}; // Term
	};
}

export default interface ItemSearcher {

	searchItems( searchTerm: string, offset?: number ): Promise<SearchedItemOption[]>;

}
