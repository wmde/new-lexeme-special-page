<script setup lang="ts">
import {
	ref,
	computed,
	toRef,
} from 'vue';
import escapeRegExp from 'lodash/escapeRegExp';
import {
	CdxLookup,
	CdxField,
	MenuItemData,
	ValidationMessages,
	ValidationStatusType,
	useModelWrapper,
} from '@wikimedia/codex';
import RequiredAsterisk from '@/components/RequiredAsterisk.vue';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useLanguageCodesProvider } from '@/plugins/LanguageCodesProviderPlugin/LanguageCodesProvider';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';

interface Props {
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
	'update:modelValue': ( selectedLang ) => {
		return selectedLang === null || selectedLang === undefined ||
			typeof selectedLang === 'string' && selectedLang.length > 0;
	},
	'update:searchInput': null,
} );

const lastInput = ref( null as string|null );
const onInput = ( inputValue: string ) => {
	if ( lastInput.value === inputValue ) {
		return;
	}
	lastInput.value = inputValue;
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

/**
 * We want to pass the searchInput property from the parent component
 * to the child component. The searchInput property comes in read-only
 * and receives updates from the parent (it is a ref / computed value).
 * Use the `useModelWrapper` helper here to turn the read-only property
 * into a computed value that emits updates on change.
 */
const searchInputWrapper = useModelWrapper(
	toRef( props, 'searchInput' ),
	emit,
	'update:searchInput',
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
	<cdx-field
		class="wbl-snl-spelling-variant-lookup"
		:status="fieldStatus"
		:messages="errorMessages">
		<cdx-lookup
			v-model:selected="selection"
			v-model:input-value="searchInputWrapper"
			:placeholder="messages.getUnescaped(
				'wikibaselexeme-newlexeme-lemma-language-placeholder-with-example',
				config.placeholderExampleData.spellingVariant
			)"
			:menu-items="menuItems"
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
