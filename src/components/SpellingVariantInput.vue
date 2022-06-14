<script setup lang="ts">
import { ref, computed } from 'vue';
import escapeRegExp from 'lodash/escapeRegExp';
import WikitLookup from './WikitLookup';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useLanguageCodesProvider } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';

interface Props {
	modelValue: string | null;
}

interface WikitMenuItem {
	label: string;
	description: string;
	value: string;
}

const props = defineProps<Props>();

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
} );

const searchInput = ref( '' );
const onSearchInput = ( inputValue: string ) => {
	searchInput.value = inputValue;
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
		@update:search-input="onSearchInput"
		@input="onOptionSelected"
	>
		<template #no-results>
			{{ messages.getUnescaped( 'wikibase-entityselector-notfound' ) }}
		</template>
	</wikit-lookup>
</template>
