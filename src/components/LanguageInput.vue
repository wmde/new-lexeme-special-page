<script setup lang="ts">
import FetchItemSearcher from '@/data-access/FetchItemSearcher';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import ItemLookup from '@/components/ItemLookup.vue';

interface Props {
	modelValue: string | null;
}

defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();

// TODO: inject searcher
const searcher = new FetchItemSearcher();
const searchForItems = searcher.searchItems.bind( searcher );

</script>

<script lang="ts">
export default {
	compatConfig: {
		MODE: 3,
	},
};
</script>

<template>
	<div class="wbl-snl-language-lookup">
		<item-lookup
			:label="messages.get( 'wikibaselexeme-newlexeme-language' )"
			:placeholder="messages.get( 'wikibaselexeme-newlexeme-language-placeholder' )"
			:value="modelValue"
			:search-for-items="searchForItems"
			@update:model-value="$emit( 'update:modelValue', $event )"
		/>
	</div>
</template>
