<script setup lang="ts">
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useSearchLinker } from '@/plugins/SearchLinkerPlugin/SearchLinker';
import { computed, onMounted } from 'vue';
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

onMounted( () => {
	const linkNodes = document.querySelectorAll( '#wbl-snl-search-existing a' );
	linkNodes.forEach( ( linkNode ) => {
		linkNode.setAttribute( 'tabindex', '1' );
	} );
} );

</script>

<template>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<p
		id="wbl-snl-search-existing"
		class="wbl-snl-search-existing"
		v-html="searchMessage"
	/>
</template>

<style lang="scss" scoped>
@import "@wmde/wikit-tokens/variables";
@import "@wmde/wikit-vue-components/src/styles/mixins/Typography";

.wbl-snl-search-existing {
	@include body;

	margin-top: 1rem;
	margin-bottom: 1rem;
}
</style>
