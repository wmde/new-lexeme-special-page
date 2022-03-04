<script setup lang="ts">
import { ref, computed } from 'vue';
import { Lookup as WikitLookup } from '@wmde/wikit-vue-components';

interface MonolingualItemOption {
	label: string;
	description: string;
	value: string;
	tag?: string;
}

interface Props {
	label: string;
	placeholder: string;
	value: string | null;
	// error?: 'ERROR_LEMMA_TOO_LONG' | 'ERROR_NO_LEMMA' | null;
}
const props = defineProps<Props>();
const emit = defineEmits( {
	'update:modelValue': ( selectedItemId: string | null ) => {
		return selectedItemId === null || /^Q\d+$/.test( selectedItemId );
	},
} );

const vegetableItems: MonolingualItemOption[] = [
	{
		label: 'potato',
		description: 'root vegetable',
		value: 'Q10998',
	},
	{
		label: 'carrot',
		description: 'root vegetable, usually orange in color',
		value: 'Q81',
		tag: 'limited support',
	},
	{
		label: 'zucchini',
		description: 'Edible summer squash, typically green in colour',
		value: 'Q7533',
	},
	{
		label: 'eggplant',
		description: 'plant species Solanum melongena',
		value: 'Q7540',
	},
	{
		label: 'broccoli',
		description: 'edible green plant in the cabbage family',
		value: 'Q47722',
	},
	{
		label: 'cauliflower',
		description: 'vegetable, for the plant see Q7537 (Brassica oleracea var. botrytis)',
		value: 'Q23900272',
	},
	{
		label: 'brussels sprouts',
		description: 'vegetable',
		value: 'Q150463',
	},
	{
		label: 'cassava root',
		description: 'root vegetable',
		value: 'Q43304555',
	},
	{
		label: 'plantain',
		description: 'banana-like vegetable, less sweet',
		value: 'Q165449',
	},
	{
		label: 'cabbage',
		description: 'Vegetable, the generic term for several varieties.',
		value: 'Q14328596',
	},
	{
		label: 'napa cabbage',
		description: 'a type of Chinese cabbage',
		value: 'Q13360268',
	},
];

const searchResults = ref( [] as MonolingualItemOption[] );

searchResults.value = vegetableItems;

const searchInput = ref( '' );
const onSearchInput = ( value: string ) => {
	console.log( 'search input 2: ' + value );
	searchInput.value = value;
	searchResults.value = vegetableItems.filter( ( item ) => item.label.includes( value ) );
	// FIXME: search for items here!
};

const onScroll = () => {
	console.log( 'list of results is being scrolled - load more!' );
};

const onOptionSelected = ( value: unknown ) => {
	const itemId = value === null ? null : ( value as MonolingualItemOption ).value;
	emit( 'update:modelValue', itemId );
};

const selectedOption = computed( () => {
	if ( props.value === null ) {
		return null;
	}
	return searchResults.value.find( ( item ) => item.value === props.value );
} );

</script>

<template>
	<wikit-lookup
		:label="label"
		:placeholder="placeholder"
		:search-input="searchInput"
		:menu-items="searchResults"
		:value="selectedOption"
		@update:search-input="onSearchInput"
		@scroll="onScroll"
		@input="onOptionSelected"
	>
		<template #no-results>
			FIXME: add no results copy!
		</template>
	</wikit-lookup>
</template>
