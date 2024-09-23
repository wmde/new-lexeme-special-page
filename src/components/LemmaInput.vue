<script setup lang="ts">
import { CdxField, CdxTextInput, ValidationMessages, ValidationStatusType } from '@wikimedia/codex';
import RequiredAsterisk from '@/components/RequiredAsterisk.vue';
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
const error = computed( (): {
	status: ValidationStatusType;
	messages: ValidationMessages;
} => {
	const inputLength = Array.from( props.modelValue ).length;
	if ( inputLength > config.maxLemmaLength ) {
		return {
			status: 'error',
			messages: {
				error: messages.getUnescaped(
					'wikibaselexeme-newlexeme-lemma-too-long-error',
					config.maxLemmaLength.toString(),
				),
			},
		};
	}
	if ( !store.state.perFieldErrors.lemmaErrors.length ) {
		return {
			status: 'default',
			messages: {},
		};
	}
	return {
		status: 'error',
		messages: {
			error: messages.getUnescaped( store.state.perFieldErrors.lemmaErrors[ 0 ].messageKey ),
		},
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
	<cdx-field
		class="wbl-snl-lemma-input"
		:status="error.status"
		:messages="error.messages"
	>
		<!-- eslint-disable vue/v-on-event-hyphenation -->
		<cdx-text-input
			:placeholder="messages.getUnescaped(
				'wikibaselexeme-newlexeme-lemma-placeholder-with-example',
				exampleLemma
			)"
			name="lemma"
			aria-required="true"
			:model-value="modelValue"
			@update:modelValue="$emit( 'update:modelValue', $event )"
		/>
		<!-- eslint-enable -->
		<template #label>
			{{ messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma' ) }}<required-asterisk />
		</template>
	</cdx-field>
</template>

<style lang="scss">
@import '@wmde/wikit-tokens/variables';

.wbl-snl-required-asterisk {
	margin-inline-start: $dimension-spacing-xsmall;
}
</style>
