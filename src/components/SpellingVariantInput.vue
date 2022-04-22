<script setup lang="ts">
import { ref, computed } from 'vue';
import WikitLookup from './WikitLookup';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useLanguageCodesProvider } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';

interface Props {
	modelValue: string | null;
}

interface WikitMenuItem {
	label: string;
	description: string;
}

const props = defineProps<Props>();

const languageCodesProvider = useLanguageCodesProvider();

const wbLexemeTermLanguages = languageCodesProvider.getLanguageCodes().map( ( lang ) => ( {
	label: lang,
	description: '',
} ) );

const menuItems = ref( [] as WikitMenuItem[] );

const emit = defineEmits( {
	'update:modelValue': ( selectedLang: string | null ) => {
		return selectedLang;
	},
} );

const searchInput = ref( '' );
const onSearchInput = ( inputValue: string ) => {
	const lowerCaseInputValue = inputValue.toLowerCase();
	if ( inputValue.trim() === '' ) {
		menuItems.value = [];
		return;
	}

	menuItems.value = wbLexemeTermLanguages.filter(
		( lang ) => lang.label.startsWith( lowerCaseInputValue ) );

	searchInput.value = inputValue;
};

const selectedOption = computed( () => {

	if ( props.modelValue === null ) {
		return null;
	}
	return menuItems.value.find( ( item ) => item.label === props.modelValue );
} );

const onOptionSelected = ( value: unknown ) => {
	const selectedValue = value === null ? null : ( value as WikitMenuItem ).label;
	emit( 'update:modelValue', selectedValue );
};

const messages = useMessages();
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
			'wikibaselexeme-newlexeme-lemma-language-placeholder' )"
		:search-input="searchInput"
		:menu-items="menuItems"
		:value="selectedOption"
		@update:search-input="onSearchInput"
		@input="onOptionSelected"
	>
		<template #no-results>
			{{ messages.getUnescaped( 'wikibaselexeme-newlexeme-no-results' ) }}
		</template>
	</wikit-lookup>
</template>
