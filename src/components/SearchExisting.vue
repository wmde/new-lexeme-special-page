<script setup lang="ts">
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useSearchLinker } from '@/plugins/SearchLinkerPlugin/SearchLinker';
import { computed } from 'vue';
import { useStore } from 'vuex';

const messages = useMessages();
const searchLinker = useSearchLinker();
const store = useStore();
const searchUrl = computed( () => {
	const searchTerm = store.state.lemma;
	return searchLinker.getSearchUrlForLexeme( searchTerm );
} );
const searchMessage = computed( () => messages.get(
	'wikibaselexeme-newlexeme-search-existing',
	searchUrl.value,
) );

</script>

<template>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<p class="wbl-snl-search-existing" v-html="searchMessage" />
</template>

<style lang="scss" scoped>
@import '@/styles/custom-variables.css';
@import '@wikimedia/codex-design-tokens/theme-wikimedia-ui';

.wbl-snl-search-existing {
	/* font Codex Body */
	font-family: $font-family-system-sans;
	font-size: $font-size-small;
	font-weight: $font-weight-normal;
	line-height: $line-height-medium;
	color: $color-base;

	/* margins */
	margin-top: var( --dimension-layout-xsmall );
	margin-bottom: var( --dimension-layout-xsmall );
}
</style>
