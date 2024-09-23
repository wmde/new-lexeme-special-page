<script setup lang="ts">
import {
	computed,
	ComputedRef,
	ref,
} from 'vue';
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import {
	CdxLookup,
	CdxField,
	MenuItemData,
	ValidationStatusType,
	ValidationMessages,
} from '@wikimedia/codex';
import RequiredAsterisk from '@/components/RequiredAsterisk.vue';
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

const selection = ref( null );

// itemSuggestions matching the current searchInput
const suggestedOptions = computed( () => {
	// eslint-disable-next-line security/detect-non-literal-regexp -- escapeRegExp used
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
const onInput = ( inputValue: string ) => {
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

const onLoadMore = async () => {
	const searchReults = await props.searchForItems(
		props.searchInput,
		searchedOptions.value.length,
	);
	searchedOptions.value = [ ...searchedOptions.value, ...searchReults ];
};

// the remaining setup translates multilingual SearchedItemOptions to monolingual MenuItemData
function searchResultToMonolingualOption( searchResult: SearchedItemOption ): MenuItemData {
	return {
		label: searchResult.display.label?.value || searchResult.id,
		description: searchResult.display.description?.value || '',
		value: searchResult.id,
	};
}

const codexMenuItems: ComputedRef<MenuItemData[]> = computed( () => {
	return menuItems.value.map( searchResultToMonolingualOption );
} );

const onCodexOptionSelected = ( selectedItem: string | null ) => {
	const searchOption = menuItems.value.find( ( item ) => item.id === selectedItem );
	return onOptionSelected( searchOption ?? null );
};

const messages = useMessages();

const menuConfig = {
	visibleItemLimit: 6,
};

const fieldStatus = computed( (): ValidationStatusType => {
	if ( !props.error ) {
		return 'default';
	}
	return props.error.type;
} );

const errorMessages = computed( (): ValidationMessages => {
	if ( props.error ) {
		if ( props.error.type === 'error' ) {
			return { error: props.error.message };
		}
		if ( props.error.type === 'warning' ) {
			return { warning: props.error.message };
		}
	}
	return {};
} );
</script>

<template>
	<cdx-field
		:status="fieldStatus"
		:messages="errorMessages">
		<cdx-lookup
			v-model:selected="selection"
			:placeholder="placeholder"
			:menu-items="codexMenuItems"
			:menu-config="menuConfig"
			@load-more="onLoadMore"
			@input="onInput"
			@update:selected="onCodexOptionSelected"
		>
			<template #no-results>
				{{ messages.getUnescaped( 'wikibase-entityselector-notfound' ) }}
			</template>
		</cdx-lookup>
		<template #label>
			{{ label }}<required-asterisk v-if="ariaRequired" />
		</template>
	</cdx-field>
</template>

<style scoped lang="scss">
.wbl-snl-required-asterisk {
	margin-inline-start: var( --dimension-spacing-xsmall );
}
</style>
