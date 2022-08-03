<script setup lang="ts">
import {
	computed,
	ref,
} from 'vue';
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import WikitLookup from './WikitLookup';
import debounce from 'lodash/debounce';
import escapeRegExp from 'lodash/escapeRegExp';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';

interface Props {
	label: string;
	placeholder: string;
	value: SearchedItemOption | null;
	searchForItems: ( searchTerm: string, offset?: number ) => Promise<SearchedItemOption[]>;
	searchInput: string;
	error?: { type: 'error'|'warning'; message: string } | null;
	itemSuggestions?: SearchedItemOption[];
	ariaRequired?: boolean;
}
const props = withDefaults( defineProps<Props>(), {
	error: null,
	itemSuggestions: () => [],
	searchInput: '',
	ariaRequired: false,
} );

const emit = defineEmits( {
	'update:modelValue': ( value: Props['value'] ) => {
		return value === null || /^Q\d+$/.test( value.id );
	},
	'update:searchInput': null,
} );

// itemSuggestions matching the current searchInput
const suggestedOptions = computed( () => {
	const regExp = new RegExp( `\\b${escapeRegExp( props.searchInput )}`, 'i' );
	return props.itemSuggestions.filter(
		( suggestion ) => regExp.test( suggestion.display.label?.value || '' ),
	);
} );
// searchForItems() results for the current searchInput
const searchedOptions = ref( [] as SearchedItemOption[] );

const menuItems = computed( (): SearchedItemOption[] => {
	const items = [
		...suggestedOptions.value,
		...searchedOptions.value.filter(
			( searchedOption ) => !suggestedOptions.value.some(
				( suggestedOption ) => suggestedOption.id === searchedOption.id,
			),
		),
	];
	if ( !items.length && props.value ) {
		items.push( props.value );
	}
	return items;
} );

// `lastSelectedOption` is needed to prevent search for new options when one was just selected
// by the user and thus the input updated to display the label of the selected option. This should
// be identical to the `value` prop above, but that is too "slow" because it only updates after
// the parent component tree has finished processing the `'update:modelValue'` event emitted here.
const lastSelectedOption = ref( null as SearchedItemOption | null );
const onOptionSelected = ( value: SearchedItemOption | null ) => {
	lastSelectedOption.value = value;
	emit( 'update:modelValue', value );
};

const debouncedSearchForItems = debounce( async ( debouncedInputValue: string ) => {
	searchedOptions.value = await props.searchForItems( debouncedInputValue );
}, 150 );
const onSearchInput = ( inputValue: string ) => {
	emit( 'update:searchInput', inputValue );
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
		props.searchInput,
		searchedOptions.value.length,
	);
	searchedOptions.value = [ ...searchedOptions.value, ...searchReults ];
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

const wikitValue = computed( () => {
	if ( props.value === null ) {
		return null;
	}
	return searchResultToMonolingualOption( props.value );
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
		:search-input="props.searchInput"
		:menu-items="wikitMenuItems"
		:value="wikitValue"
		:error="error"
		:aria-required="ariaRequired"
		@update:search-input="onSearchInput"
		@scroll="onScroll"
		@input="onWikitOptionSelected"
	>
		<template #no-results>
			{{ messages.getUnescaped( 'wikibase-entityselector-notfound' ) }}
		</template>
		<template #suffix>
			<slot name="suffix" />
		</template>
	</wikit-lookup>
</template>
