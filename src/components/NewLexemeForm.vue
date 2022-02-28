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
const token = computed( () => store.state.token );
const submitMsg = $messages.get( 'wikibaselexeme-newlexeme-submit' );
<<<<<<< HEAD
const termsOfUseTitle = $messages.get( 'copyrightpage' );
const copyrightText = $messages.get(
	'wikibase-shortcopyrightwarning',
	submitMsg,
	termsOfUseTitle,
	store.state.config.licenseUrl,
	store.state.config.licenseName,
=======
const termsOfUseURL = 'https://foundation.wikimedia.org/wiki/Terms_of_Use';
const copyrightText = $messages.get(
	'wikibase-shortcopyrightwarning',
	submitMsg,
	termsOfUseURL,
<<<<<<< HEAD
	store.state.config.cc0Url,
	store.state.config.cc0Text,
>>>>>>> Add cc0 link text and url to store and inject into createAndMount
=======
	store.state.config.licenseUrl,
	store.state.config.licenseName,
>>>>>>> Add parameters to store dynamically upon its creation
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
		<input
			type="hidden"
			name="wpEditToken"
			:value="token"
		>
=======
>>>>>>> Restore lost divs
		<p class="wbl-snl-copyright" v-html="copyrightText" />
=======
		<p class="wbl-snl-copyright wbl-snl-small-text" v-html="copyrightText" />
>>>>>>> Add styles to the copyright info
=======
		<p class="wbl-snl-copyright" v-html="copyrightText" />
>>>>>>> removing small text class and unifying mixin inclusion under copyright class
		<div>
			<wikit-button
				class="form-button-submit"
				type="progressive"
				variant="primary"
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

<<<<<<< HEAD
<<<<<<< HEAD
.wbl-snl-copyright {
	@include small-text;
=======
.wbl-snl-small-text {
=======
.wbl-snl-copyright {
>>>>>>> removing small text class and unifying mixin inclusion under copyright class
	@include small-text;

<<<<<<< HEAD
.wbl-snl-copyright {
>>>>>>> Add styles to the copyright info
=======
>>>>>>> removing small text class and unifying mixin inclusion under copyright class
	font-style: italic;
}

</style>
