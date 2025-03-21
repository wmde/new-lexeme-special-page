<script setup lang="ts">
import { SearchedItemOption } from '@/data-access/ItemSearcher';
import { CREATE_LEXEME, HANDLE_LANGUAGE_CHANGE } from '@/store/actions';
import {
	computed,
	ref,
} from 'vue';
import { useStore } from 'vuex';
import { CdxButton } from '@wikimedia/codex';
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
import { useUrlLauncher } from '@/plugins/UrlLauncherPlugin/UrlLauncher';

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
	set( newSpellingVariant: string | undefined ): void {
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
const urlLauncher = useUrlLauncher();
const onSubmit = async () => {
	submitting.value = true;
	try {
		const targetUrl = await store.dispatch( CREATE_LEXEME );
		await urlLauncher.goToURL( targetUrl );
	} catch {
		// Error is already in store and handled by ErrorMessage component
	}
	submitting.value = false;
};

</script>

<template>
	<form class="wbl-snl-form">
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
			<cdx-button
				class="form-button-submit"
				action="progressive"
				weight="primary"
				type="submit"
				:disabled="submitting"
				@click.prevent="onSubmit"
			>
				{{ submitButtonText }}
			</cdx-button>
		</div>
	</form>
</template>

<style scoped lang="scss">
@use '@wikimedia/codex-design-tokens/theme-wikimedia-ui';
@import '@/styles/custom-variables.css';

.wbl-snl-form {
	// Box model
	padding: var( --dimension-layout-small );

	// Border
	border-style: theme-wikimedia-ui.$border-style-base;
	border-width: theme-wikimedia-ui.$border-width-base;
	border-radius: theme-wikimedia-ui.$border-radius-base;
	border-color: var( --border-color-muted );

	& > * + * {
		margin-top: var( --dimension-layout-xsmall );
	}
}

.wbl-snl-copyright {
	/* codex Body S */
	font-family: theme-wikimedia-ui.$font-family-system-sans;
	font-size: theme-wikimedia-ui.$font-size-small;
	font-weight: theme-wikimedia-ui.$font-weight-normal;
	line-height: theme-wikimedia-ui.$line-height-medium;
	color: var( --color-base );
	margin-bottom: 0;
}

</style>
