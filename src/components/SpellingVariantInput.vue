<script setup lang="ts">
import { ref, computed } from 'vue';
import escapeRegExp from 'lodash/escapeRegExp';
import {
	CdxLookup,
	CdxField,
	MenuItemData,
	ValidationMessages,
	ValidationStatusType,
} from '@wikimedia/codex';
import RequiredAsterisk from '@/components/RequiredAsterisk.vue';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useLanguageCodesProvider } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';

interface Props {
	modelValue: string | number | undefined;
	searchInput: string;
}

const props = withDefaults( defineProps<Props>(), {
	searchInput: '',
} );

const languageCodesProvider = useLanguageCodesProvider();
const messages = useMessages();

const wbLexemeTermLanguages: MenuItemData[] = [];
languageCodesProvider.getLanguages().forEach(
	( name, code ) => {
		wbLexemeTermLanguages.push( {
			label: messages.getUnescaped( 'wikibase-lexeme-lemma-language-option', name, code ),
			value: code,
			description: '',
		} );
	},
);

const menuItems = ref( [] as MenuItemData[] );

const emit = defineEmits( {
	'update:modelValue': ( selectedLang: Props['modelValue'] ) => {
		return selectedLang === null ||
			typeof selectedLang === 'string' && selectedLang.length > 0;
	},
	'update:searchInput': null,
} );

const onInput = ( inputValue: string ) => {
	emit( 'update:searchInput', inputValue );
	if ( inputValue.trim() === '' ) {
		menuItems.value = [];
		return;
	}

	// eslint-disable-next-line security/detect-non-literal-regexp -- escapeRegExp used
	const regExp = new RegExp( `\\b${escapeRegExp( inputValue )}`, 'i' );
	menuItems.value = wbLexemeTermLanguages.filter(
		( lang ) => lang.label && regExp.test( lang.label ),
	);
	onOptionSelected( inputValue );
};

const selection = ref( null );

const onOptionSelected = ( selectedItem: string | null ) => {
	const selectedValue = menuItems.value.find( ( item ) => item.value === selectedItem );
	emit( 'update:modelValue', selectedValue?.value.toString() || undefined );
};

const config = useConfig();
const store = useStore();
const helpUrl = messages.get( 'wikibaselexeme-newlexeme-lemma-language-help-link-target' );
const helpLinkText = messages.get( 'wikibaselexeme-newlexeme-lemma-language-help-link-text' );
const fieldStatus = computed( (): ValidationStatusType => {
	if ( !store.state.perFieldErrors.spellingVariantErrors.length ) {
		return 'default';
	}
	return 'error';
} );

const errorMessages = computed( (): ValidationMessages => {
	if ( !store.state.perFieldErrors.spellingVariantErrors.length ) {
		return {};
	}
	return {
		error: messages.getUnescaped(
			store.state.perFieldErrors.spellingVariantErrors[ 0 ].messageKey,
		) };
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
	<cdx-field
		class="wbl-snl-spelling-variant-lookup"
		:status="fieldStatus"
		:messages="errorMessages">
		<cdx-lookup
			v-model:selected="selection"
			:placeholder="messages.getUnescaped(
				'wikibaselexeme-newlexeme-lemma-language-placeholder-with-example',
				config.placeholderExampleData.spellingVariant
			)"
			:search-input="searchInput"
			:menu-items="menuItems"
			:input-value="props.modelValue"
			@input="onInput"
			@update:selected="onOptionSelected"
		>
			<template #no-results>
				{{ messages.getUnescaped( 'wikibase-entityselector-notfound' ) }}
			</template>
		</cdx-lookup>
		<template #label>
			{{ messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma-language' ) }}<required-asterisk />
			<span class="wbl-snl-spelling-variant-lookup__help-link">
				<a :href="helpUrl" target="_blank">{{ helpLinkText }}</a>
			</span>
		</template>
	</cdx-field>
</template>

<style lang="scss">
@import '@wikimedia/codex-design-tokens/theme-wikimedia-ui';

.wbl-snl-spelling-variant-lookup {
	&__help-link {
		padding-bottom: $spacing-50;
		display: inline-block;
	}
}

.wbl-snl-required-asterisk {
	margin-inline-start: var( --dimension-spacing-xsmall );
}
</style>
