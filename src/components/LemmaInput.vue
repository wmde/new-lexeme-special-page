<script setup lang="ts">
import { TextInput } from '@wmde/wikit-vue-components';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useStore } from 'vuex';
import { computed } from 'vue';

interface Props {
	modelValue: string;
}

defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();

const config = useConfig();
const exampleLemma = config.placeholderExampleData.lemma;
const store = useStore();
const error = computed( () => {
	if ( !store.state.perFieldErrors.lemmaErrors.length ) {
		return null;
	}
	return {
		type: store.state.perFieldErrors.lemmaErrors[ 0 ].type,
		message: messages.getUnescaped( store.state.perFieldErrors.lemmaErrors[ 0 ].message ),
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
