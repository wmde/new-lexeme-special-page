<script setup lang="ts">
import { TextInput } from '@wmde/wikit-vue-components';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';

interface Props {
	modelValue: string;
}

defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();
</script>

<template>
	<text-input
		class="wbl-snl-language-input"
		:label="messages.get( 'wikibaselexeme-newlexeme-language' )"
		:placeholder="messages.get( 'wikibaselexeme-newlexeme-language-placeholder' )"
		name="lexeme-language"
		required
		pattern="Q[1-9][0-9]*"
		:value="modelValue"
		@input="$emit( 'update:modelValue', $event )"
	/>
</template>
