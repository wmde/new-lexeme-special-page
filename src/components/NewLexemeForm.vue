<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { Button as WikitButton } from '@wmde/wikit-vue-components';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import LemmaInput from '@/components/LemmaInput.vue';
import LexicalCategoryInput from '@/components/LexicalCategoryInput.vue';
import {
	UPDATE_LEMMA,
	UPDATE_LEXICAL_CATEGORY,
} from '@/store/actions';

const $messages = useMessages();
const store = useStore();
const lemma = computed( {
	get(): string {
		return store.state.lemma;
	},
	set( newLemmaValue: string ): void {
		store.dispatch( UPDATE_LEMMA, newLemmaValue );
	},
} );
const lexicalCategory = computed( {
	get(): string {
		return store.state.lexicalCategory;
	},
	set( newLexicalCategory: string ): void {
		store.dispatch( UPDATE_LEXICAL_CATEGORY, newLexicalCategory );
	},
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
	<form class="new-lexeme-form">
		<lemma-input
			v-model="lemma"
		/>
		<lexical-category-input
			v-model="lexicalCategory"
		/>
		<wikit-button
			class="form-button-submit"
			type="progressive"
			variant="primary"
		>
			{{ $messages.get( 'wikibaselexeme-newlexeme-submit' ) }}
		</wikit-button>
	</form>
</template>

<style scoped lang="scss">
@import "@wmde/wikit-tokens/variables";

.new-lexeme-form {
	// Box model
	padding: $dimension-layout-small;

	// Border
	border-style: $border-style-base;
	border-width: $border-width-thin;
	border-radius: $border-radius-base;
	border-color: $border-color-base-subtle;
}
</style>
