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
						display: {
							label: { value: 'Q1 label', language: 'en' },
							description: { value: 'Q1 description', language: 'en' },
						},
					},
					{
						id: 'Q2',
						display: {
							label: { value: 'Q2 label', language: 'en' },
							// no description
						},
					},
					{
						id: 'Q3',
						display: {
							// no label
							description: { value: 'Q3 description', language: 'en' },
						},
					},
				],
			} as WbSearchEntitiesResponse ),
		};
		const itemSearcher = new MwApiItemSearcher( api, 'en' );

		const results = await itemSearcher.searchItems( 'search term' );

		expect( results ).toStrictEqual( [
			{
				id: 'Q1',
				display: {
					label: { value: 'Q1 label', language: 'en' },
					description: { value: 'Q1 description', language: 'en' },
				},
			},
			{
				id: 'Q2',
				display: {
					label: { value: 'Q2 label', language: 'en' },
				},
			},
			{
				id: 'Q3',
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
					display: {},
				} ],
			} ),
		};
		const itemSearcher = new MwApiItemSearcher( api, 'en' );

		const results = await itemSearcher.searchItems( 'search term', 3 );

		expect( results ).toStrictEqual( [
			{ id: 'Q4', display: {} },
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
