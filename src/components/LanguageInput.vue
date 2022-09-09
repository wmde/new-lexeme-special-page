<script setup lang="ts">
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import { useStore } from 'vuex';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import ItemLookup from '@/components/ItemLookup.vue';
import RequiredAsterisk from '@/components/RequiredAsterisk.vue';
import { useLanguageItemSearch } from '@/plugins/ItemSearchPlugin/LanguageItemSearch';
import { computed } from 'vue';
import { useConfig } from '@/plugins/ConfigPlugin/Config';

interface Props {
	modelValue: SearchedItemOption | null;
	searchInput: string;
}

defineProps<Props>();

defineEmits<{
	( e: 'update:modelValue', modelValue: Props['modelValue'] ): void;
	( e: 'update:searchInput', searchInput: Props['searchInput'] ): void;
}>();

const messages = useMessages();

const searcher = useLanguageItemSearch();
const searchForItems = searcher.searchItems.bind( searcher );

const store = useStore();

const error = computed( () => {
	if ( store.state.perFieldErrors.languageErrors.length ) {
		return {
			type: 'error' as const,
			message: messages.getUnescaped(
				store.state.perFieldErrors.languageErrors[ 0 ].messageKey,
			),
		};
	}
	if ( store.state.languageCodeFromLanguageItem !== false ) {
		return null;
	}
	return {
		type: 'warning' as const,
		message: messages.getUnescaped( 'wikibaselexeme-newlexeme-invalid-language-code-warning' ),
	};
} );
const config = useConfig();
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
			:placeholder="messages.getUnescaped(
				'wikibaselexeme-newlexeme-language-placeholder-with-example',
				config.placeholderExampleData.languageLabel
			)"
			:value="modelValue"
			:search-input="searchInput"
			:search-for-items="searchForItems"
			:error="error"
			:aria-required="true"
			@update:model-value="$emit( 'update:modelValue', $event )"
			@update:search-input="$emit( 'update:searchInput', $event )"
		>
			<template #suffix>
				<required-asterisk />
			</template>
		</item-lookup>
	</div>
</template>
