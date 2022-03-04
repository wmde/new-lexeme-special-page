<script setup lang="ts">
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import ItemLookup from '@/components/ItemLookup.vue';

interface Props {
	modelValue: string | null;
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
	<div>
		<item-lookup
			:label="messages.get( 'wikibaselexeme-newlexeme-language' )"
			:placeholder="messages.get( 'wikibaselexeme-newlexeme-language-placeholder' )"
			:value="modelValue"
			@update:model-value="$emit( 'update:modelValue', $event )"
		/>
	</div>
</template>
