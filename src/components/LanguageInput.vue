<script setup lang="ts">
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import ItemLookup from '@/components/ItemLookup.vue';
import { useItemSearch } from '@/plugins/ItemSearchPlugin/ItemSearch';

interface Props {
	modelValue: string | null;
}

defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();

const searcher = useItemSearch();
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
