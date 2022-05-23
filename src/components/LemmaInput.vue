<script setup lang="ts">
import { TextInput } from '@wmde/wikit-vue-components';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useConfig } from '@/plugins/ConfigPlugin/Config';

interface Props {
	modelValue: string;
	error?: 'ERROR_LEMMA_TOO_LONG' | 'ERROR_NO_LEMMA' | null;
}

withDefaults( defineProps<Props>(), { error: null } );

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();

function buildError( errorKey: Props['error'] ) {
	if ( errorKey === 'ERROR_LEMMA_TOO_LONG' ) {
		return {
			type: 'error',
			message: messages.getUnescaped( 'wikibaselexeme-newlexeme-error-lemma-is-too-long' ),
		};
	}
	if ( errorKey === 'ERROR_NO_LEMMA' ) {
		return {
			type: 'error',
			message: messages.getUnescaped( 'wikibaselexeme-newlexeme-error-no-lemma' ),
		};
	}
	return null;
}
const config = useConfig();
const exampleLemma = config.placeholderExampleData.lemma;
</script>

<script lang="ts">
export default {
	compatConfig: {
		MODE: 3,
	},
};
</script>

<template>
	<text-input
		class="wbl-snl-lemma-input"
		:label="messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma' )"
		:placeholder="messages.getUnescaped(
			'wikibaselexeme-newlexeme-lemma-placeholder-with-example',
			exampleLemma
		)"
		name="lemma"
		aria-required="true"
		:error="buildError( error )"
		:value="modelValue"
		@input="$emit( 'update:modelValue', $event )"
	/>
</template>
