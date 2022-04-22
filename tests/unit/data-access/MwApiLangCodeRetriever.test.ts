import MwApiLangCodeRetriever from '@/data-access/MwApiLangCodeRetriever';
import unusedApi from '../../mocks/unusedApi';

describe( 'MwApiLangCodeRetriever', () => {

	it( 'returns null if there is no language code', async () => {
		const api = unusedApi;

		api.get = jest.fn().mockResolvedValue( {
			claims: {},
		} );

		const sut = new MwApiLangCodeRetriever( api, 'P218' );

		expect( await sut.getLanguageCodeFromItem( 'Q5' ) ).toBe( null );
	} );

	it( 'picks the preferred rank statement if available', async () => {
		const api = unusedApi;

		api.get = jest.fn().mockResolvedValue( {
			claims: {
				P218: [
					{
						mainsnak: {
							snaktype: 'value',
							property: 'P218',
							hash: 'faa942355921695b9fa30805f0bb66bc7ed5a433',
							datavalue: {
								value: 'sh',
								type: 'string',
							},
							datatype: 'external-id',
						},
						type: 'statement',
						id: 'Q9301$6e2ffdaf-4ec3-055f-7165-4849df92ffde',
						rank: 'normal',
					},
					{
						mainsnak: {
							snaktype: 'novalue',
							property: 'P218',
							hash: 'b9ab13daebfa249a806a50c92940e64f253f2ab6',
							datatype: 'external-id',
						},
						type: 'statement',
						id: 'Q9301$e0e7dc32-4ffa-943b-953c-c6283e53e0a3',
						rank: 'preferred',
					},
				],
			},
		} );

		const sut = new MwApiLangCodeRetriever( api, 'P218' );

		expect( await sut.getLanguageCodeFromItem( 'Q9301' ) ).toBe( null );
	} );

	it( 'returns the language code from the normal ranked statement if there is no preferred one', async () => {
		const api = unusedApi;

		api.get = jest.fn().mockResolvedValue( {
			claims: {
				P218: [
					{
						mainsnak: {
							snaktype: 'value',
							property: 'P218',
							hash: 'faa942355921695b9fa30805f0bb66bc7ed5a433',
							datavalue: {
								value: 'sh',
								type: 'string',
							},
							datatype: 'external-id',
						},
						type: 'statement',
						id: 'Q9301$6e2ffdaf-4ec3-055f-7165-4849df92ffde',
						rank: 'normal',
					},
				],
			},
		} );

		const sut = new MwApiLangCodeRetriever( api, 'P218' );

		expect( await sut.getLanguageCodeFromItem( 'Q9301' ) ).toBe( 'sh' );
	} );

	it( 'returns null if there is only a deprecated language code', async () => {
		const api = unusedApi;

		api.get = jest.fn().mockResolvedValue( {
			claims: {
				P218: [
					{
						mainsnak: {
							snaktype: 'value',
							property: 'P218',
							hash: 'faa942355921695b9fa30805f0bb66bc7ed5a433',
							datavalue: {
								value: 'sh',
								type: 'string',
							},
							datatype: 'external-id',
						},
						type: 'statement',
						id: 'Q9301$6e2ffdaf-4ec3-055f-7165-4849df92ffde',
						rank: 'deprecated',
					},
				],
			},
		} );

		const sut = new MwApiLangCodeRetriever( api, 'P218' );

		expect( await sut.getLanguageCodeFromItem( 'Q9301' ) ).toBe( null );
	} );
} );
