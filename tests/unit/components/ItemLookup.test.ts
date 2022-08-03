import ItemLookup from '@/components/ItemLookup.vue';
import {
	mount,
	VueWrapper,
} from '@vue/test-utils';
import { Lookup as WikitLookup } from '@wmde/wikit-vue-components';

jest.mock( 'lodash/debounce', () => jest.fn( ( fn ) => fn ) );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createLookup( propsOverrides: any = {} ): VueWrapper<any> {
	return mount( ItemLookup, {
		props: {
			label: 'some label',
			placeholder: 'some placeholder',
			searchForItems: jest.fn(),
			value: null,
			...propsOverrides,
		},
	} );
}

async function setSearchInput( lookup: VueWrapper, searchInput: string ): Promise<void> {
	await lookup.find( 'input' ).setValue( searchInput );
	await lookup.setProps( { searchInput } );
}

const exampleSearchResults = [
	{
		display: {
			label: {
				language: 'en',
				value: 'foo',
			},
			description: {
				language: 'en',
				value: 'bar',
			},
		},
		id: 'Q123',
	},
	{
		display: {
			label: {
				language: 'en',
				value: 'zucchini',
			},
			description: {
				language: 'en',
				value: 'Edible summer squash, typically green in colour',
			},
		},
		id: 'Q7533',
	},
	{
		display: {
			label: {
				language: 'en',
				value: 'broccoli',
			},
			description: {
				language: 'en',
				value: 'edible green plant in the cabbage family',
			},
		},
		id: 'Q47722',
	},
	{
		display: {
			description: {
				language: 'en',
				value: 'heated beverage of chocolate',
			},
		},
		id: 'Q13261',
	},
];

describe( 'ItemLookup', () => {
	describe( ':props', () => {

		it( ':searchForItems - method is called on input change', async () => {
			const searchForItems = jest.fn().mockReturnValue( [] );
			const lookup = createLookup( { searchForItems } );

			await setSearchInput( lookup, 'foo' );

			expect( searchForItems ).toHaveBeenCalledWith( 'foo' );
		} );

		it( ':searchForItems - method is not called if input is empty', async () => {
			const searchForItems = jest.fn();
			const lookup = createLookup( { searchForItems } );

			await setSearchInput( lookup, '' );

			expect( searchForItems ).not.toHaveBeenCalled();
		} );

		it( ':searchForItems - method is called on scroll with offset', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );
			await setSearchInput( lookup, 'foo' );

			await lookup.findComponent( WikitLookup ).vm.$emit( 'scroll' );

			expect( searchForItems ).toHaveBeenCalledTimes( 2 );
			expect( searchForItems ).toHaveBeenNthCalledWith( 2, 'foo', 4 );
		} );

		it( ':value - selects the given Item', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );
			await setSearchInput( lookup, 'foo' );
			const selectedItemId = 1;

			await lookup.setProps( { value: exampleSearchResults[ selectedItemId ] } );

			expect( lookup.findComponent( WikitLookup ).props().value.label )
				.toBe( exampleSearchResults[ selectedItemId ].display.label?.value );
		} );

		it( ':value - provides a menu item', async () => {
			const searchForItems = jest.fn();
			const lookup = createLookup( {
				value: {
					id: 'Q1',
					display: {
						label: { language: 'en', value: 'some label' },
						description: { language: 'en', value: 'some description' },
					},
				},
				searchForItems,
			} );

			expect( lookup.findComponent( WikitLookup ).props().menuItems )
				.toStrictEqual( [ {
					value: 'Q1',
					label: 'some label',
					description: 'some description',
				} ] );
			expect( searchForItems ).not.toHaveBeenCalled();
		} );

		it( ':searchForItems - returned suggestions are provided to Wikit Lookup', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );

			await setSearchInput( lookup, 'foo' );

			const wikitLookup = lookup.getComponent( WikitLookup );
			expect( wikitLookup.props( 'menuItems' ) ).toStrictEqual( [
				{
					description: 'bar',
					label: 'foo',
					value: 'Q123',
				},
				{
					description: 'Edible summer squash, typically green in colour',
					label: 'zucchini',
					value: 'Q7533',
				},
				{
					description: 'edible green plant in the cabbage family',
					label: 'broccoli',
					value: 'Q47722',
				},
				{
					description: 'heated beverage of chocolate',
					label: 'Q13261',
					value: 'Q13261',
				},
			] );
		} );

		it( ':itemSuggestions - shows matching suggestions before search results', async () => {
			const itemSuggestions = [
				{
					display: {
						label: {
							value: 'fool', // match
							language: 'en',
						},
					},
					id: 'Q1',
				},
				{
					display: {
						label: {
							value: 'bamboozle', // does not match, should not be shown
							language: 'en',
						},
					},
					id: 'Q11',
				},
				{
					display: {
						label: {
							value: 'FOOD', // case-insensitive match
							language: 'en',
						},
					},
					id: 'Q2',
				},
			];
			const searchForItems = jest.fn().mockReturnValue( [
				{
					display: {
						label: {
							value: 'foo',
							language: 'en',
						},
					},
					id: 'Q3',
				},
				{
					display: {
						label: {
							value: 'bar',
							language: 'en',
						},
					},
					id: 'Q4',
				},
				{
					display: {
						label: {
							value: 'fool', // already in itemSuggestions, should not be shown again
							language: 'en',
						},
					},
					id: 'Q1',
				},
			] );
			const lookup = createLookup( { searchForItems, itemSuggestions } );

			await setSearchInput( lookup, 'foo' );

			const wikitLookup = lookup.getComponent( WikitLookup );
			expect( wikitLookup.props( 'menuItems' ) ).toStrictEqual( [
				// suggestions
				{
					description: '',
					label: 'fool',
					value: 'Q1',
				},
				{
					description: '',
					label: 'FOOD',
					value: 'Q2',
				},
				// search results
				{
					description: '',
					label: 'foo',
					value: 'Q3',
				},
				{
					description: '',
					label: 'bar',
					value: 'Q4',
				},
			] );
		} );

		it.each( [
			[ false, 'false' ],
			[ true, 'true' ],
		] )( ':ariaRequired(%p)', ( propValue, attributeValue ) => {
			const lookup = createLookup( { ariaRequired: propValue } );
			const input = lookup.find( 'input' );

			expect( input.attributes( 'aria-required' ) ).toBe( attributeValue );
		} );
	} );

	describe( '@events', () => {
		it( '@update:modelValue - emits null when the input is changed', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );

			await setSearchInput( lookup, 'foo' );

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect( lookup.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toBe( null );
		} );

		it( '@update:modelValue - emits the search result of the selected option', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );
			await setSearchInput( lookup, 'foo' );
			const selectedItemId = 0;

			await lookup.findComponent( WikitLookup ).vm.$emit(
				'input',
				{
					label: exampleSearchResults[ selectedItemId ].display.label?.value,
					description: exampleSearchResults[ selectedItemId ].display.description.value,
					value: exampleSearchResults[ selectedItemId ].id,
				},
			);

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect( lookup.emitted( 'update:modelValue' )[ 1 ][ 0 ] ).toStrictEqual( exampleSearchResults[ selectedItemId ] );

		} );
	} );
} );
