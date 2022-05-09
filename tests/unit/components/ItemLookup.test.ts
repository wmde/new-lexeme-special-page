import { mount } from '@vue/test-utils';
import ItemLookup from '@/components/ItemLookup.vue';
import { Lookup as WikitLookup } from '@wmde/wikit-vue-components';

jest.mock( 'lodash/debounce', () => jest.fn( ( fn ) => fn ) );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createLookup( propsOverrides: any = {} ) {
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

			await lookup.find( 'input' ).setValue( 'foo' );

			expect( searchForItems ).toHaveBeenCalledWith( 'foo' );
		} );

		it( ':searchForItems - method is not called if input is empty', async () => {
			const searchForItems = jest.fn();
			const lookup = createLookup( { searchForItems } );

			await lookup.find( 'input' ).setValue( '' );

			expect( searchForItems ).not.toHaveBeenCalled();
		} );

		it( ':searchForItems - method is called on scroll with offset', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );
			await lookup.find( 'input' ).setValue( 'foo' );

			await lookup.findComponent( WikitLookup ).vm.$emit( 'scroll' );

			expect( searchForItems ).toHaveBeenCalledTimes( 2 );
			expect( searchForItems ).toHaveBeenNthCalledWith( 2, 'foo', 4 );
		} );

		it( ':value - selects the selected Item with this QID', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );
			await lookup.find( 'input' ).setValue( 'foo' );
			const selectedItemId = 1;

			await lookup.setProps( { value: exampleSearchResults[ selectedItemId ].id } );

			expect( lookup.findComponent( WikitLookup ).props().value.label )
				.toBe( exampleSearchResults[ selectedItemId ].display.label?.value );
		} );

		it( ':searchForItems - returned suggestions are provided to Wikit Lookup', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );

			await lookup.find( 'input' ).setValue( 'foo' );

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
							value: 'fool',
							language: 'en',
						},
					},
					id: 'Q1',
				},
				{
					display: {
						label: {
							value: 'bamboozle',
							language: 'en',
						},
					},
					id: 'Q11',
				},
				{
					display: {
						label: {
							value: 'FOOD',
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
			] );
			const lookup = createLookup( { searchForItems, itemSuggestions } );

			await lookup.find( 'input' ).setValue( 'foo' );

			const wikitLookup = lookup.getComponent( WikitLookup );
			expect( wikitLookup.props( 'menuItems' ) ).toStrictEqual( [
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
	} );
	describe( '@events', () => {
		it( '@update:modelValue - emits null when the input is changed', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );

			await lookup.find( 'input' ).setValue( 'foo' );

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect( lookup.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toBe( null );
		} );

		it( '@update:modelValue - emits the itemId of the selected option', async () => {
			const searchForItems = jest.fn().mockReturnValue( exampleSearchResults );
			const lookup = createLookup( { searchForItems } );
			await lookup.find( 'input' ).setValue( 'foo' );
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
			expect( lookup.emitted( 'update:modelValue' )[ 1 ][ 0 ] ).toBe( exampleSearchResults[ selectedItemId ].id );

		} );
	} );
} );
