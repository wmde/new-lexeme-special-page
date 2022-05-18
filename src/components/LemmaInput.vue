<script setup lang="ts">
import { TextInput } from '@wmde/wikit-vue-components';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';

interface Props {
	modelValue: string;
}

defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();

const config = useConfig();
const exampleLemma = config.placeholderExampleData.lemma;
const store = useStore();
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
		:error="store.state.perFieldErrors.lemmaErrors[0]"
		:value="modelValue"
		@input="$emit( 'update:modelValue', $event )"
	/>
</template>
