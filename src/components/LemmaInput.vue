<script setup lang="ts">
import { TextInput } from '@wmde/wikit-vue-components';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';

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
			message: messages.get( 'wikibaselexeme-newlexeme-error-lemma-is-too-long' ),
		};
	}
	if ( errorKey === 'ERROR_NO_LEMMA' ) {
		return {
			type: 'error',
			message: messages.get( 'wikibaselexeme-newlexeme-error-no-lemma' ),
		};
	}
	return null;
}
</script>

<template>
	<text-input
		:label="messages.get( 'wikibaselexeme-newlexeme-lemma' )"
		:placeholder="messages.get( 'wikibaselexeme-newlexeme-lemma-placeholder' )"
		name="lemma"
		required
		:error="buildError( error )"
		:value="modelValue"
		@input="$emit( 'update:modelValue', $event )"
	/>
</template>
