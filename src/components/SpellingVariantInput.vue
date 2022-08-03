<script setup lang="ts">
import { ref, computed } from 'vue';
import escapeRegExp from 'lodash/escapeRegExp';
import WikitLookup from './WikitLookup';
import { Link as WikitLink } from '@wmde/wikit-vue-components';
import RequiredAsterisk from '@/components/RequiredAsterisk.vue';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useLanguageCodesProvider } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';

interface Props {
	modelValue: string | null;
	searchInput: string;
}

interface WikitMenuItem {
	label: string;
	description: string;
	value: string;
}

const props = withDefaults( defineProps<Props>(), {
	searchInput: '',
} );

const languageCodesProvider = useLanguageCodesProvider();
const messages = useMessages();

const wbLexemeTermLanguages: WikitMenuItem[] = [];
languageCodesProvider.getLanguages().forEach(
	( name, code ) => {
		wbLexemeTermLanguages.push( {
			label: messages.getUnescaped( 'wikibase-lexeme-lemma-language-option', name, code ),
			value: code,
			description: '',
		} );
	},
);

const menuItems = ref( [] as WikitMenuItem[] );

const emit = defineEmits( {
	'update:modelValue': ( selectedLang: Props['modelValue'] ) => {
		return selectedLang === null || selectedLang.length > 0;
	},
	'update:searchInput': null,
} );

const onSearchInput = ( inputValue: string ) => {
	emit( 'update:searchInput', inputValue );
	if ( inputValue.trim() === '' ) {
		menuItems.value = [];
		return;
	}

	const regExp = new RegExp( `\\b${escapeRegExp( inputValue )}`, 'i' );
	menuItems.value = wbLexemeTermLanguages.filter(
		( lang ) => regExp.test( lang.label ),
	);
};

const selectedOption = computed( () => {

	if ( props.modelValue === null ) {
		return null;
	}
	return menuItems.value.find( ( item ) => item.label === props.modelValue );
} );

const onOptionSelected = ( value: unknown ) => {
	const selectedValue = value === null ? null : ( value as WikitMenuItem ).value;
	emit( 'update:modelValue', selectedValue );
};

const config = useConfig();
const store = useStore();
const error = computed( () => {
	if ( !store.state.perFieldErrors.spellingVariantErrors.length ) {
		return null;
	}
	return {
		type: 'error',
		message: messages.getUnescaped(
			store.state.perFieldErrors.spellingVariantErrors[ 0 ].messageKey,
		),
	};
} );
const helpUrl = messages.get( 'wikibaselexeme-newlexeme-lemma-language-help-link-target' );
const helpLinkText = messages.get( 'wikibaselexeme-newlexeme-lemma-language-help-link-text' );
</script>

<script lang="ts">
export default {
	compatConfig: {
		MODE: 3,
	},
};
</script>

<template>
	<wikit-lookup
		class="wbl-snl-spelling-variant-lookup"
		:label="messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma-language' )"
		:placeholder="messages.getUnescaped(
			'wikibaselexeme-newlexeme-lemma-language-placeholder-with-example',
			config.placeholderExampleData.spellingVariant
		)"
		:search-input="searchInput"
		:menu-items="menuItems"
		:value="selectedOption"
		:error="error"
		:aria-required="true"
		@update:search-input="onSearchInput"
		@input="onOptionSelected"
	>
		<template #no-results>
			{{ messages.getUnescaped( 'wikibase-entityselector-notfound' ) }}
		</template>
		<template #suffix>
			<required-asterisk />
			<span class="wbl-snl-spelling-variant-lookup__help-link">
				<wikit-link :href="helpUrl" target="_blank">{{ helpLinkText }}</wikit-link>
			</span>
		</template>
	</wikit-lookup>
</template>

<style lang="scss" scoped>
@import "@wmde/wikit-tokens/variables";

.wbl-snl-spelling-variant-lookup {
	&__help-link {
		padding-bottom: $wikit-Label-padding-block-end;
		display: inline-block;
	}
}
</style>
