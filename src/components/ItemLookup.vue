<script setup lang="ts">
import { ref, computed } from 'vue';
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import WikitLookup from './WikitLookup';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';

interface Props {
	label: string;
	placeholder: string;
	value: string | null;
	searchForItems: ( searchTerm: string, offset?: number ) => Promise<SearchedItemOption[]>;
	error?: { type: 'error'|'warning'; message: string };
}
const props = defineProps<Props>();

const emit = defineEmits( {
	'update:modelValue': ( selectedItemId: string | null ) => {
		return selectedItemId === null || /^Q\d+$/.test( selectedItemId );
	},
} );

interface WikitMenuItem {
	label: string;
	description: string;
	tag?: string;
}

interface MonolingualOption extends WikitMenuItem {
	value: string;
}
const searchSuggestions = ref( [] as MonolingualOption[] );

const selectedOption = computed( () => {
	if ( props.value === null ) {
		return null;
	}
	return searchSuggestions.value.find( ( item ) => item.value === props.value );
} );

// `lastSelectedOption` is needed to prevent search for new suggestions when one was just selected
// by the user and thus the input updated to display the label of the selected option. This should
// be identical to the `selectedOption` computed above, but that is too "slow" because it only
// updates after the parent component tree has finished processing the `'update:modelValue'` event
// emitted here and updated this component's value prop.
const lastSelectedOption = ref( null as MonolingualOption | null );
const onOptionSelected = ( value: unknown ) => {
	lastSelectedOption.value = value as MonolingualOption;
	const itemId = value === null ? null : ( value as MonolingualOption ).value;
	emit( 'update:modelValue', itemId );
};

const debouncedSearchForItems = debounce( async ( debouncedInputValue: string ) => {
	const searchResults = await props.searchForItems( debouncedInputValue );
	searchSuggestions.value = searchResults.map( searchResultToMonolingualOption );
}, 150 );
const searchInput = ref( '' );
const onSearchInput = async ( inputValue: string ) => {
	searchInput.value = inputValue;
	if ( inputValue.trim() === '' ) {
		searchSuggestions.value = [];
		return;
	}

	if ( inputValue === lastSelectedOption.value?.label ) {
		return;
	}
	debouncedSearchForItems( inputValue );
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
		label: searchResult.display.label?.value || searchResult.itemId,
		description: searchResult.display.description?.value || '',
		value: searchResult.itemId,
	};
}

const messages = useMessages();
</script>

<template>
	<wikit-lookup
		:label="label"
		:placeholder="placeholder"
		:search-input="searchInput"
		:menu-items="searchSuggestions"
		:value="selectedOption"
		:error="error"
		@update:search-input="onSearchInput"
		@scroll="onScroll"
		@input="onOptionSelected"
	>
		<template #no-results>
			{{ messages.getUnescaped( 'wikibaselexeme-newlexeme-no-results' ) }}
		</template>
	</wikit-lookup>
</template>
