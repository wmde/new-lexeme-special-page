<script setup lang="ts">
import { CREATE_LEXEME } from '@/store/actions';
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
const token = computed( () => store.state.token );
const submitMsg = $messages.get( 'wikibaselexeme-newlexeme-submit' );
const termsOfUseTitle = $messages.get( 'copyrightpage' );
const copyrightText = $messages.get(
	'wikibase-shortcopyrightwarning',
	submitMsg,
	termsOfUseTitle,
	store.state.config.licenseUrl,
	store.state.config.licenseName,
);

const onSubmit = () => {
	store.dispatch( CREATE_LEXEME );
	// TODO redirect to created lexeme
};
</script>

<script lang="ts">
export default {
	compatConfig: {
		MODE: 3,
	},
};
</script>

<template>
	<form class="wbl-snl-form" @submit.prevent="onSubmit">
		<lemma-input
			v-model="lemma"
		/>
		<input
			type="hidden"
			name="lemma-language"
			value="en"
		>
		<language-input
			v-model="language"
		/>
		<lexical-category-input
			v-model="lexicalCategory"
		/>
		<input
			type="hidden"
			name="wpEditToken"
			:value="token"
		>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<p class="wbl-snl-copyright" v-html="copyrightText" />
		<div>
			<wikit-button
				class="form-button-submit"
				type="progressive"
				variant="primary"
				native-type="submit"
			>
				{{ submitMsg }}
			</wikit-button>
		</div>
	</form>
</template>

<style scoped lang="scss">
@import "@wmde/wikit-tokens/variables";
@import "@wmde/wikit-vue-components/src/styles/mixins/Typography";

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

.wbl-snl-copyright {
	@include small-text;

	font-style: italic;
}

</style>
