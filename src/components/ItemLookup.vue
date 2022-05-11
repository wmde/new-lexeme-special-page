<script setup lang="ts">
import { ref, computed } from 'vue';
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import WikitLookup from './WikitLookup';
import debounce from 'lodash/debounce';
import escapeRegExp from 'lodash/escapeRegExp';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';

interface Props {
	label: string;
	placeholder: string;
	value: string | null;
	searchForItems: ( searchTerm: string, offset?: number ) => Promise<SearchedItemOption[]>;
	error: { type: 'error'|'warning'; message: string } | null;
	itemSuggestions?: SearchedItemOption[];
}
const props = withDefaults( defineProps<Props>(), {
	error: null,
	itemSuggestions: () => [],
} );

const emit = defineEmits( {
	'update:modelValue': ( selectedItemId: string | null ) => {
		return selectedItemId === null || /^Q\d+$/.test( selectedItemId );
	},
} );

const searchInput = ref( '' );

// itemSuggestions matching the current searchInput
const suggestedOptions = computed( () => {
	const regExp = new RegExp( `\\b${escapeRegExp( searchInput.value )}`, 'i' );
	return props.itemSuggestions.filter(
		( suggestion ) => regExp.test( suggestion.display.label?.value || '' ),
	);
} );
// searchForItems() results for the current searchInput
const searchedOptions = ref( [] as SearchedItemOption[] );

const menuItems = computed( (): SearchedItemOption[] => [
	...suggestedOptions.value,
	...searchedOptions.value.filter(
		( searchedOption ) => !suggestedOptions.value.some(
			( suggestedOption ) => suggestedOption.id === searchedOption.id,
		),
	),
] );

const selectedOption = computed( () => {
	if ( props.value === null ) {
		return null;
	}
	return menuItems.value.find( ( item ) => item.id === props.value ) ?? null;
} );

// `lastSelectedOption` is needed to prevent search for new options when one was just selected
// by the user and thus the input updated to display the label of the selected option. This should
// be identical to the `selectedOption` computed above, but that is too "slow" because it only
// updates after the parent component tree has finished processing the `'update:modelValue'` event
// emitted here and updated this component's value prop.
const lastSelectedOption = ref( null as SearchedItemOption | null );
const onOptionSelected = ( value: SearchedItemOption | null ) => {
	lastSelectedOption.value = value;
	const itemId = value === null ? null : value.id;
	emit( 'update:modelValue', itemId );
};

const debouncedSearchForItems = debounce( async ( debouncedInputValue: string ) => {
	searchedOptions.value = await props.searchForItems( debouncedInputValue );
}, 150 );
const onSearchInput = async ( inputValue: string ) => {
	searchInput.value = inputValue;
	if ( inputValue.trim() === '' ) {
		searchedOptions.value = [];
		return;
	}

	if (
		inputValue === lastSelectedOption.value?.display.label?.value ||
		inputValue === lastSelectedOption.value?.id
	) {
		return;
	}
	debouncedSearchForItems( inputValue );
};

const onScroll = async () => {
	const searchReults = await props.searchForItems(
		searchInput.value,
		searchedOptions.value.length,
	);
	searchedOptions.value.push( ...searchReults );
};

// the remaining setup translates multilingual SearchedItemOptions to monolingual WikitItemOptions

interface WikitMenuItem {
	label: string;
	description: string;
	tag?: string;
}
interface WikitItemOption extends WikitMenuItem {
	value: string;
}

function searchResultToMonolingualOption( searchResult: SearchedItemOption ): WikitItemOption {
	return {
		label: searchResult.display.label?.value || searchResult.id,
		description: searchResult.display.description?.value || '',
		value: searchResult.id,
	};
}

const wikitMenuItems = computed( () => {
	return menuItems.value.map( searchResultToMonolingualOption );
} );

const selectedWikitOption = computed( () => {
	if ( selectedOption.value === null ) {
		return null;
	}
	return searchResultToMonolingualOption( selectedOption.value );
} );

const onWikitOptionSelected = ( value: unknown ) => {
	const wikitOption = value as WikitItemOption | null;
	const searchOption = menuItems.value.find( ( item ) => item.id === wikitOption?.value );
	return onOptionSelected( searchOption ?? null );
};

const messages = useMessages();
</script>

<template>
	<wikit-lookup
		:label="label"
		:placeholder="placeholder"
		:search-input="searchInput"
		:menu-items="wikitMenuItems"
		:value="selectedWikitOption"
		:error="error"
		@update:search-input="onSearchInput"
		@scroll="onScroll"
		@input="onWikitOptionSelected"
	>
		<template #no-results>
			{{ messages.getUnescaped( 'wikibaselexeme-newlexeme-no-results' ) }}
		</template>
	</wikit-lookup>
</template>
