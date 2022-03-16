import { mount } from '@vue/test-utils';
import ItemLookup from '@/components/ItemLookup.vue';
import { Lookup as WikitLookup } from '@wmde/wikit-vue-components';

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
		itemId: 'Q123',
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
		itemId: 'Q7533',
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
		itemId: 'Q47722',
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
			expect( searchForItems ).toHaveBeenNthCalledWith( 2, 'foo', 3 );
		} );

		it.todo( ':value - selects the selected Item with this QID' );
	} );
	describe( '@events', () => {
		it.todo( '@update:modelValue - emits the itemId of the selected option' );
	} );
} );
