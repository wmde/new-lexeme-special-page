<script setup lang="ts">
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import { useStore } from 'vuex';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import ItemLookup from '@/components/ItemLookup.vue';
import RequiredAsterisk from '@/components/RequiredAsterisk.vue';
import { useLanguageItemSearch } from '@/plugins/ItemSearchPlugin/LanguageItemSearch';
import { computed, toRef } from 'vue';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useModelWrapper } from '@wikimedia/codex';

interface Props {
	modelValue: SearchedItemOption | null;
	searchInput: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
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

/**
 * We want to pass the searchInput property from the parent component
 * to the child component. The searchInput property comes in read-only
 * and receives updates from the parent (it is a ref / computed value).
 * Use the `useModelWrapper` helper here to turn the read-only property
 * into a computed value that emits updates on change.
 */
const searchInputWrapper = useModelWrapper(
	toRef( props, 'searchInput' ),
	emit,
	'update:searchInput',
);
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
			v-model:search-input="searchInputWrapper"
			:label="messages.getUnescaped( 'wikibaselexeme-newlexeme-language' )"
			:placeholder="messages.getUnescaped(
				'wikibaselexeme-newlexeme-language-placeholder-with-example',
				config.placeholderExampleData.languageLabel
			)"
			:value="modelValue"
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

<style lang="scss">
@import '@wikimedia/codex-design-tokens/theme-wikimedia-ui';
</style>
