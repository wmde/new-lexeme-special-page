<script setup lang="ts">
import ItemLookup from '@/components/ItemLookup.vue';
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useItemSearch } from '@/plugins/ItemSearchPlugin/ItemSearch';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';
import { computed } from 'vue';

interface Props {
	modelValue: SearchedItemOption | null;
}

defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();
const searcher = useItemSearch();
const searchForItems = searcher.searchItems.bind( searcher );
const config = useConfig();
const lexicalCategorySuggestions = config.lexicalCategorySuggestions;
const exampleLexCategory = config.placeholderExampleData.lexicalCategoryLabel;
const store = useStore();
const error = computed( () => {
	if ( !store.state.perFieldErrors.lexicalCategoryErrors.length ) {
		return null;
	}
	return {
		type: 'error' as const,
		message: messages.getUnescaped(
			store.state.perFieldErrors.lexicalCategoryErrors[ 0 ].messageKey,
		),
	};
} );
</script>

<script lang="ts">
export default {
	compatConfig: {
		MODE: 3,
	},
};
</script>

<template>
	<div class="wbl-snl-lexical-category-lookup">
		<item-lookup
			:label="messages.getUnescaped( 'wikibaselexeme-newlexeme-lexicalcategory' )"
			:placeholder="messages.getUnescaped(
				'wikibaselexeme-newlexeme-lexicalcategory-placeholder-with-example',
				exampleLexCategory
			)"
			:value="modelValue"
			:search-for-items="searchForItems"
			:item-suggestions="lexicalCategorySuggestions"
			:error="error"
			@update:model-value="$emit( 'update:modelValue', $event )"
		/>
	</div>
</template>
