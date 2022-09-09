import ItemSearcher from '@/data-access/ItemSearcher';
import {
	inject,
	InjectionKey,
} from 'vue';

export const LanguageItemSearchKey: InjectionKey<ItemSearcher> = Symbol( 'LanguageItemSearch' );

export function useLanguageItemSearch(): ItemSearcher {
	return inject( LanguageItemSearchKey, () => {
		throw new Error( 'No LanguageItemSearcher provided!' );
	}, true );
}
