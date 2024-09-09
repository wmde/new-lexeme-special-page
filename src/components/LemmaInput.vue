<script setup lang="ts">
import { CdxField, CdxTextInput } from '@wikimedia/codex';
import RequiredAsterisk from '@/components/RequiredAsterisk.vue'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';
import { computed } from 'vue';

interface Props {
	modelValue: string;
}

const props = defineProps<Props>();

defineEmits<{
	( e: 'update:modelValue', modelValue: Props['modelValue'] ): void;
}>();

const messages = useMessages();

const config = useConfig();
const exampleLemma = config.placeholderExampleData.lemma;
const store = useStore();
const error = computed( () => {
	const inputLength = Array.from( props.modelValue ).length;
	if ( inputLength > config.maxLemmaLength ) {
		return {
			type: 'error',
			message: messages.getUnescaped(
				'wikibaselexeme-newlexeme-lemma-too-long-error',
				config.maxLemmaLength.toString(),
			),
		};
	}
	if ( !store.state.perFieldErrors.lemmaErrors.length ) {
		return null;
	}
	return {
		type: 'error',
		message: messages.getUnescaped( store.state.perFieldErrors.lemmaErrors[ 0 ].messageKey ),
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
	<!-- TODO should :status and :messages be separate computeds? -->
	<cdx-field
		:status="error !== null ? 'error' : 'default'"
		:messages="error !== null ? { error: error.message } : {}"
	>
		<!-- TODO check escaping of :placeholder -->
		<cdx-text-input
			class="wbl-snl-lemma-input"
			:placeholder="messages.getUnescaped(
				'wikibaselexeme-newlexeme-lemma-placeholder-with-example',
				exampleLemma
			)"
			name="lemma"
			aria-required="true"
			:model-value="modelValue"
			@update:modelValue="$emit( 'update:modelValue', $event )"
		>
			<!-- TODO codex docs say don’t mark required labels with an asterisk…
			<template #suffix>
				<required-asterisk />
			</template>
			-->
		</cdx-text-input>
		<template #label>{{ messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma' ) }}</template><!-- TODO check escaping -->
	</cdx-field>

</template>

<style lang="scss">
@import '@wmde/wikit-tokens/variables';

/* stylelint-disable plugin/stylelint-bem-namics, selector-class-pattern */
.wbl-snl-lemma-input.wikit .wikit-TextInput__label-wrapper {
	gap: $dimension-spacing-xsmall;
}
/* stylelint-enable plugin/stylelint-bem-namics, selector-class-pattern */
</style>
