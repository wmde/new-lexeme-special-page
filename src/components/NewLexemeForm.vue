<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { Button as WikitButton } from '@wmde/wikit-vue-components';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import LemmaInput from '@/components/LemmaInput.vue';
import LanguageInput from '@/components/LanguageInput.vue';
import LexicalCategoryInput from '@/components/LexicalCategoryInput.vue';
import {
	SET_LANGUAGE,
	SET_LEMMA,
	SET_LEXICAL_CATEGORY,
} from '@/store/mutations';

const $messages = useMessages();
const store = useStore();
const lemma = computed( {
	get(): string {
		return store.state.lemma;
	},
	set( newLemmaValue: string ): void {
		store.commit( SET_LEMMA, newLemmaValue );
	},
} );
const language = computed( {
	get(): string {
		return store.state.language;
	},
	set( newLanguage: string ): void {
		store.commit( SET_LANGUAGE, newLanguage );
	},
} );
const lexicalCategory = computed( {
	get(): string {
		return store.state.lexicalCategory;
	},
	set( newLexicalCategory: string ): void {
		store.commit( SET_LEXICAL_CATEGORY, newLexicalCategory );
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
	<form class="wbl-snl-form">
		<lemma-input
			v-model="lemma"
		/>
		<language-input
			v-model="language"
		/>
		<lexical-category-input
			v-model="lexicalCategory"
		/>
		<div>
			<wikit-button
				class="form-button-submit"
				type="progressive"
				variant="primary"
			>
				{{ $messages.get( 'wikibaselexeme-newlexeme-submit' ) }}
			</wikit-button>
		</div>
	</form>
</template>

<style scoped lang="scss">
@import "@wmde/wikit-tokens/variables";

.wbl-snl-form {
	& > * + * {
		margin-block-start: $dimension-layout-xsmall;
	}

	// Box model
	padding: $dimension-layout-small;

	// Border
	border-style: $border-style-base;
	border-width: $border-width-thin;
	border-radius: $border-radius-base;
	border-color: $border-color-base-subtle;
}
</style>
