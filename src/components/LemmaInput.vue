<script setup lang="ts">
import { TextInput } from '@wmde/wikit-vue-components';
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
const textInputLabelMessage = computed(
	() => messages.getUnescaped( 'wikibaselexeme-newlexeme-lemma' ) );
const textInputPlaceholderMessage = computed(
	() => messages.getUnescaped(
		'wikibaselexeme-newlexeme-lemma-placeholder-with-example',
		exampleLemma ) );

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
	<text-input
		class="wbl-snl-lemma-input"
		:label="textInputLabelMessage"
		:placeholder="textInputPlaceholderMessage"
		name="lemma"
		aria-required="true"
		:error="error"
		:value="modelValue"
		@input="$emit( 'update:modelValue', $event )"
	>
		<template #suffix>
			<required-asterisk />
		</template>
	</text-input>
</template>
