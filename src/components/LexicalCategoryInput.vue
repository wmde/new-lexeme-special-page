<script setup lang="ts">
import ItemLookup from '@/components/ItemLookup.vue';
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useItemSearch } from '@/plugins/ItemSearchPlugin/ItemSearch';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';

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
			:error="store.state.perFieldErrors.lexicalCategoryErrors[0]"
			@update:model-value="$emit( 'update:modelValue', $event )"
		/>
	</div>
</template>
