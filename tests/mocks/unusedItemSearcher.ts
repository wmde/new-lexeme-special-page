import ItemSearcher from '@/data-access/ItemSearcher';

const unusedItemSearcher: ItemSearcher = {
	searchItems: jest.fn().mockRejectedValue(
		new Error( 'ItemSearcher should not be used in this test' ) ),
};

export default unusedItemSearcher;
