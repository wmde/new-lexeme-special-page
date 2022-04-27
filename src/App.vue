<script setup lang="ts">
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import SearchExisting from '@/components/SearchExisting.vue';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useSearchLinker } from '@/plugins/SearchLinkerPlugin/SearchLinker';
import '@wmde/wikit-vue-components/dist/wikit-vue-components.css';
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
	<teleport to="#wbl-snl-intro-text-wrapper">
		<search-existing :search-message="searchMessage" />
	</teleport>
	<div class="wbl-snl-app">
		<new-lexeme-form />
	</div>
</template>

<style lang="scss" scoped>
@import "@wmde/wikit-tokens/variables";
@import "@wmde/wikit-vue-components/src/styles/mixins/Typography";

.wbl-snl-intro-text {
	@include body;
}
</style>
