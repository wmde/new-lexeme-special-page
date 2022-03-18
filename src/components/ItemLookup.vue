<script setup lang="ts">
import { ref, computed } from 'vue';
import { MenuItem } from '@wmde/wikit-vue-components/dist/components/MenuItem';
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import WikitLookup from './WikitLookup';

interface Props {
	label: string;
	placeholder: string;
	value: string | null;
	searchForItems: ( searchTerm: string, offset?: number ) => Promise<SearchedItemOption[]>;
}

const props = defineProps<Props>();
const emit = defineEmits( {
	'update:modelValue': ( selectedItemId: string | null ) => {
		return selectedItemId === null || /^Q\d+$/.test( selectedItemId );
	},
} );

interface MonolingualOption extends MenuItem {
	value: string;
}
const searchSuggestions = ref( [] as MonolingualOption[] );

const selectedOption = computed( () => {
	if ( props.value === null ) {
		return null;
	}
	return searchSuggestions.value.find( ( item ) => item.value === props.value );
} );

const searchInput = ref( '' );

const onOptionSelected = ( value: unknown ) => {
	const itemId = value === null ? null : ( value as MonolingualOption ).value;
	emit( 'update:modelValue', itemId );
};

const onSearchInput = async ( inputValue: string ) => {
	searchInput.value = inputValue;
	if ( inputValue.trim() === '' ) {
		searchSuggestions.value = [];
		return;
	}
	const searchResults = await props.searchForItems( inputValue );
	searchSuggestions.value = searchResults.map( searchResultToMonolingualOption );
};

const onScroll = async () => {
	const searchReults = await props.searchForItems(
		searchInput.value,
		searchSuggestions.value.length,
	);
	searchSuggestions.value.push( ...searchReults.map( searchResultToMonolingualOption ) );
};

function searchResultToMonolingualOption( searchResult: SearchedItemOption ): MonolingualOption {
	return {
		label: searchResult.display.label?.value || '',
		description: searchResult.display.description?.value || '',
		value: searchResult.itemId,
	};
}
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
