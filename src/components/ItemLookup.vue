<script setup lang="ts">
import { ref, computed } from 'vue';
import { Lookup as WikitLookup } from '@wmde/wikit-vue-components';

interface MonolingualItemOption {
	label: string;
	description: string;
	value: string;
	tag?: string;
}

interface SearchedItemOption {
	display: {
		label: {
			language: string;
			value: string;
		}; // Term
		description: {
			language: string;
			value: string;
		}; // Term
	};
	itemId: string;
}

interface Props {
	label: string;
	placeholder: string;
	value: string | null;
	searchForItems: ( searchTerm: string, offset?: number ) => Promise<SearchedItemOption[]>;
	// error?: 'ERROR_LEMMA_TOO_LONG' | 'ERROR_NO_LEMMA' | null;
}
const props = defineProps<Props>();
const emit = defineEmits( {
	'update:modelValue': ( selectedItemId: string | null ) => {
		return selectedItemId === null || /^Q\d+$/.test( selectedItemId );
	},
} );

const searchSuggestions = ref( [] as MonolingualItemOption[] );

const searchInput = ref( '' );
const onSearchInput = async ( inputValue: string ) => {
	searchInput.value = inputValue;
	const searchResults = await props.searchForItems( inputValue );
	searchSuggestions.value = searchResults.map( ( result ) => {
		return {
			label: result.display.label.value,
			description: result.display.description.value,
			value: result.itemId,
		};
	} );
};

const onScroll = async () => {
	const searchReults = await props.searchForItems(
		searchInput.value,
		searchSuggestions.value.length,
	);
	searchSuggestions.value.push( ...searchReults.map( ( result ) => {
		return {
			label: result.display.label.value,
			description: result.display.description.value,
			value: result.itemId,
		};
	} ) );
};

const onOptionSelected = ( value: unknown ) => {
	const itemId = value === null ? null : ( value as MonolingualItemOption ).value;
	emit( 'update:modelValue', itemId );
};

const selectedOption = computed( () => {
	if ( props.value === null ) {
		return null;
	}
	return searchSuggestions.value.find( ( item ) => item.value === props.value );
} );

</script>

<template>
	<wikit-lookup
		:label="label"
		:placeholder="placeholder"
		:search-input="searchInput"
		:menu-items="searchSuggestions"
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
