<script setup lang="ts">
import { TextInput } from '@wmde/wikit-vue-components';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';
import { computed } from 'vue';

interface Props {
	modelValue: string;
}

const props = defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();

const config = useConfig();
const exampleLemma = config.placeholderExampleData.lemma;
const store = useStore();
const error = computed( () => {
	const inputLength = Array.from( props.modelValue ).length;
	if ( inputLength > config.maxLemmaLength ) {
		return {
			type: 'error',
			message: messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma-too-long-error' ),
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
	<text-input
		class="wbl-snl-lemma-input"
		:label="messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma' )"
		:placeholder="messages.getUnescaped(
			'wikibaselexeme-newlexeme-lemma-placeholder-with-example',
			exampleLemma
		)"
		name="lemma"
		aria-required="true"
		:error="error"
		:value="modelValue"
		@input="$emit( 'update:modelValue', $event )"
	/>
</template>
