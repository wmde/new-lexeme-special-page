<script setup lang="ts">
import { useStore } from 'vuex';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import ItemLookup from '@/components/ItemLookup.vue';
import { useItemSearch } from '@/plugins/ItemSearchPlugin/ItemSearch';
import { computed } from 'vue';

interface Props {
	modelValue: string | null;
}

defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();

const searcher = useItemSearch();
const searchForItems = searcher.searchItems.bind( searcher );

const store = useStore();

const error = computed( () => {
	if ( store.state.languageCodeFromLanguageItem !== false ) {
		return undefined;
	}
	return {
		type: 'warning' as const,
		message: messages.getUnescaped( 'wikibaselexeme-newlexeme-invalid-language-code-warning' ),
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
	<div class="wbl-snl-language-lookup">
		<item-lookup
			:label="messages.getUnescaped( 'wikibaselexeme-newlexeme-language' )"
			:placeholder="messages.getUnescaped( 'wikibaselexeme-newlexeme-language-placeholder' )"
			:value="modelValue"
			:search-for-items="searchForItems"
			:error="error"
			@update:model-value="$emit( 'update:modelValue', $event )"
		/>
	</div>
</template>
