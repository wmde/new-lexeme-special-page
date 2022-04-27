import { inject, InjectionKey } from 'vue';

export default interface SearchLinker {
	/**
	 * Return a URL for searching for the given term in the lexeme namespace.
	 */
	getSearchUrlForLexeme( searchTerm: string ): string;
}

export const SearchLinkerKey: InjectionKey<SearchLinker> = Symbol( 'SearchLinker' );

export function useSearchLinker(): SearchLinker {
	return inject( SearchLinkerKey, () => {
		throw new Error( 'No SearchLinker provided!' );
	}, true );
}
