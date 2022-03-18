import { MwApi } from '@/@types/mediawiki';
import { WbSearchEntitiesResponse } from '@/data-access/apiBasedItemSearcher';
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import MwApiItemSearcher from '@/data-access/MwApiItemSearcher';
import unusedApi from '../../mocks/unusedApi';

describe( 'MwApiItemSearcher', () => {

	it( 'gets and transforms search results', async () => {
		const api: MwApi = {
			...unusedApi,
			get: jest.fn().mockResolvedValue( {
				search: [
					{
						id: 'Q1',
						label: 'Q1 label',
						description: 'Q1 description',
					},
					{
						id: 'Q2',
						label: 'Q2 label',
						// no description
					},
					{
						id: 'Q3',
						// no label
						description: 'Q3 description',
					},
				],
			} as WbSearchEntitiesResponse ),
		};
		const itemSearcher = new MwApiItemSearcher( api, 'en' );

		const results = await itemSearcher.searchItems( 'search term' );

		expect( results ).toStrictEqual( [
			{
				itemId: 'Q1',
				display: {
					label: { value: 'Q1 label', language: 'en' },
					description: { value: 'Q1 description', language: 'en' },
				},
			},
			{
				itemId: 'Q2',
				display: {
					label: { value: 'Q2 label', language: 'en' },
				},
			},
			{
				itemId: 'Q3',
				display: {
					description: { value: 'Q3 description', language: 'en' },
				},
			},
		] as SearchedItemOption[] );
		expect( api.get ).toHaveBeenCalledTimes( 1 );
		expect( api.get ).toHaveBeenCalledWith( {
			action: 'wbsearchentities',
			type: 'item',
			limit: '10',
			search: 'search term',
			language: 'en',
			continue: undefined,
		} );
	} );

	it( 'continues from an offset', async () => {
		const api: MwApi = {
			...unusedApi,
			get: jest.fn().mockResolvedValue( {
				search: [ {
					id: 'Q4',
				} ],
			} ),
		};
		const itemSearcher = new MwApiItemSearcher( api, 'en' );

		const results = await itemSearcher.searchItems( 'search term', 3 );

		expect( results ).toStrictEqual( [
			{ itemId: 'Q4', display: {} },
		] as SearchedItemOption[] );
		expect( api.get ).toHaveBeenCalledTimes( 1 );
		expect( api.get ).toHaveBeenCalledWith( {
			action: 'wbsearchentities',
			type: 'item',
			limit: '10',
			search: 'search term',
			language: 'en',
			continue: 3,
		} );
	} );

} );
