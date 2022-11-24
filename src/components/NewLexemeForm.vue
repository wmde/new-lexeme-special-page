<script setup lang="ts">
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import { CREATE_LEXEME, HANDLE_LANGUAGE_CHANGE } from '@/store/actions';
import {
	computed,
	ref,
} from 'vue';
import { useStore } from 'vuex';
import { Button as WikitButton } from '@wmde/wikit-vue-components';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import LemmaInput from '@/components/LemmaInput.vue';
import LanguageInput from '@/components/LanguageInput.vue';
import SpellingVariantInput from '@/components/SpellingVariantInput.vue';
import LexicalCategoryInput from '@/components/LexicalCategoryInput.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import {
	CLEAR_PER_FIELD_ERRORS,
	SET_LANGUAGE_SEARCH_INPUT,
	SET_LEMMA,
	SET_LEXICAL_CATEGORY,
	SET_LEXICAL_CATEGORY_SEARCH_INPUT,
	SET_SPELLING_VARIANT,
	SET_SPELLING_VARIANT_SEARCH_INPUT,
} from '@/store/mutations';
import { useWikiRouter } from '@/plugins/WikiRouterPlugin/WikiRouter';

const config = useConfig();
const $messages = useMessages();
const store = useStore();
const lemma = computed( {
	get(): string {
		return store.state.lemma;
	},
	set( newLemmaValue: string ): void {
		store.commit( SET_LEMMA, newLemmaValue );
		if ( newLemmaValue.trim().length > 0 ) {
			store.commit( CLEAR_PER_FIELD_ERRORS, 'lemmaErrors' );
		}
	},
} );
const language = computed( {
	get(): SearchedItemOption | null {
		return store.state.language;
	},
	async set( newLanguage: SearchedItemOption | null ): Promise<void> {
		await store.dispatch( HANDLE_LANGUAGE_CHANGE, newLanguage );
		if ( newLanguage ) {
			store.commit( CLEAR_PER_FIELD_ERRORS, 'languageErrors' );
		}
	},
} );
const languageSearchInput = computed( {
	get(): string {
		return store.state.languageSearchInput;
	},
	set( newLanguageSearchInput: string ): void {
		store.commit( SET_LANGUAGE_SEARCH_INPUT, newLanguageSearchInput );
	},
} );
const lexicalCategory = computed( {
	get(): SearchedItemOption | null {
		return store.state.lexicalCategory;
	},
	set( newLexicalCategory: SearchedItemOption | null ): void {
		store.commit( SET_LEXICAL_CATEGORY, newLexicalCategory );
		if ( newLexicalCategory ) {
			store.commit( CLEAR_PER_FIELD_ERRORS, 'lexicalCategoryErrors' );
		}
	},
} );
const lexicalCategorySearchInput = computed( {
	get(): string {
		return store.state.lexicalCategorySearchInput;
	},
	set( newLexicalCategorySearchInput: string ): void {
		store.commit( SET_LEXICAL_CATEGORY_SEARCH_INPUT, newLexicalCategorySearchInput );
	},
} );
const showSpellingVariantInput = computed( () => {
	return store.state.languageCodeFromLanguageItem === null ||
		store.state.languageCodeFromLanguageItem === false;
} );
const spellingVariant = computed( {
	get(): string {
		return store.state.spellingVariant;
	},
	set( newSpellingVariant: string | null ): void {
		store.commit( SET_SPELLING_VARIANT, newSpellingVariant );
		if ( newSpellingVariant ) {
			store.commit( CLEAR_PER_FIELD_ERRORS, 'spellingVariantErrors' );
		}
	},
} );
const spellingVariantSearchInput = computed( {
	get(): string {
		return store.state.spellingVariantSearchInput;
	},
	set( newSpellingVariantSearchInput: string ): void {
		store.commit( SET_SPELLING_VARIANT_SEARCH_INPUT, newSpellingVariantSearchInput );
	},
} );

const submitting = ref( false );

const submitMsg = $messages.getUnescaped( 'wikibaselexeme-newlexeme-submit' );
const submittingMsg = $messages.getUnescaped( 'wikibaselexeme-newlexeme-submitting' );
const termsOfUseTitle = $messages.get( 'copyrightpage' );
const copyrightText = $messages.get(
	'wikibase-shortcopyrightwarning',
	submitMsg,
	termsOfUseTitle,
	config.licenseUrl,
	config.licenseName,
);
const submitButtonText = computed( () => {
	return submitting.value ? submittingMsg : submitMsg;
} );

const error = computed( () => {
	if ( store.state.globalErrors.length > 0 ) {
		const firstError = store.state.globalErrors[ 0 ];
		if ( firstError.message ) {
			return firstError.message;
		}

		return $messages.getUnescaped( 'wikibaselexeme-newlexeme-submit-error' );
	}

	return null;
} );
const wikiRouter = useWikiRouter();
const onSubmit = async () => {
	submitting.value = true;
	try {
		const lexemeId = await store.dispatch( CREATE_LEXEME );
		await wikiRouter.goToTitle( `Special:EntityPage/${lexemeId}` );
	} catch {
		// Error is already in store and handled by ErrorMessage component
	}
	submitting.value = false;
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
		<language-input
			v-model="language"
			v-model:search-input="languageSearchInput"
		/>
		<spelling-variant-input
			v-if="showSpellingVariantInput"
			v-model="spellingVariant"
			v-model:search-input="spellingVariantSearchInput"
		/>
		<lexical-category-input
			v-model="lexicalCategory"
			v-model:search-input="lexicalCategorySearchInput"
		/>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<p class="wbl-snl-copyright" v-html="copyrightText" />
		<error-message v-if="error">
			<!-- eslint-disable-next-line vue/no-v-html -->
			<span v-html="error" />
		</error-message>
		<div>
			<wikit-button
				class="form-button-submit"
				type="progressive"
				variant="primary"
				native-type="submit"
				:disabled="submitting"
			>
				{{ submitButtonText }}
			</wikit-button>
		</div>
	</form>
</template>

<style scoped lang="scss">
@import "@wmde/wikit-tokens/variables";
@import "@wmde/wikit-vue-components/src/styles/mixins/Typography";

.wbl-snl-form {
	& > * + * {
		margin-top: $dimension-layout-xsmall;
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

	font-size: 0.8125rem;
	font-style: italic;
	font-synthesis: none;
	margin-bottom: 0;
}

</style>
