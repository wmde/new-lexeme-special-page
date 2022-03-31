<script setup lang="ts">
import { ref, computed } from 'vue';
import WikitLookup from './WikitLookup';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';

interface Props {
	modelValue: string | null;
}

const props = defineProps<Props>();

const config = useConfig();

const wbLexemeTermLanguages = config.wikibaseLexemeTermLanguages;

const menuItems = ref( [] as string[] );

const emit = defineEmits( {
	'update:modelValue': ( selectedLang: string | null ) => {
		return selectedLang;
	},
} );

const searchInput = ref( '' );
const onSearchInput = ( inputValue: string ) => {
	if ( inputValue.trim() === '' ) {
		menuItems.value = [];
		return;
	}

	// TODO: menuItems printed as a Proxy
	// console.log( 'onSearchInput', 'inputValue', inputValue, 'menuItems.value', menuItems.value )

	menuItems.value = wbLexemeTermLanguages.filter(
		( lang ) => lang.includes( searchInput.value ) );

	searchInput.value = inputValue;
};

const selectedOption = computed( () => {
	// if ( searchInput.value === null ) {
	// 	return null;
	// }
	// return menuItems.value.find( ( lang ) => lang === searchInput.value );
	
	if ( props.modelValue === null ) {
		return null;
	}
	return menuItems.value.find( ( item ) => item === props.modelValue );
} );

// const menuItems = ( () => {
// return wbLexemeTermLanguages.filter( ( lang ) => lang.includes( searchInput.value ) );
// });

const onOptionSelected = ( value: string ) => {
	emit( 'update:modelValue', value );
};

const onScroll = async () => {
	// TODO
};

const messages = useMessages();
</script>

<template>
	<wikit-lookup
		:label="messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma-language' )"
		:placeholder="messages.getUnescaped(
			'wikibaselexeme-newlexeme-lemma-language-placeholder' )"
		:search-input="searchInput"
		:menu-items="menuItems"
		:value="selectedOption"
		@scroll="onScroll"
		@update:search-input="onSearchInput"
		@input="onOptionSelected"
	>
		<template #no-results>
			{{ messages.getUnescaped( 'wikibaselexeme-newlexeme-no-results' ) }}
		</template>
	</wikit-lookup>
</template>
