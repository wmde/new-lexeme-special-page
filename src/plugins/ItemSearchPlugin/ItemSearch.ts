import ItemSearcher from '@/data-access/ItemSearcher';
import {
	inject,
	InjectionKey,
} from 'vue';

export const ItemSearchKey: InjectionKey<ItemSearcher> = Symbol( 'ItemSearch' );

export function useItemSearch(): ItemSearcher {
	return inject( ItemSearchKey, () => {
		throw new Error( 'No ItemSearcher provided!' );
	}, true );
}
