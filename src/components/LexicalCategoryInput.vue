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

<script lang="ts">
export default {
	compatConfig: {
		MODE: 3,
	},
};
</script>

<template>
	<text-input
		class="wbl-snl-lexical-category-input"
		:label="messages.get( 'wikibaselexeme-newlexeme-lexicalcategory' )"
		:placeholder="messages.get( 'wikibaselexeme-newlexeme-lexicalcategory-placeholder' )"
		name="lexicalcategory"
		required
		pattern="Q[1-9][0-9]*"
		:value="modelValue"
		@input="$emit( 'update:modelValue', $event )"
	/>
</template>
