<script setup lang="ts">
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { computed } from 'vue/dist/vue';

const messages = useMessages();
const fieldRequiredMessage = computed(
	() => messages.getUnescaped( 'wikibaselexeme-form-field-required' ) );
</script>

<script lang="ts">
export default {
	compatConfig: {
		MODE: 3,
	},
};
</script>

<template>
	<span
		class="wbl-snl-required-asterisk"
		aria-hidden="true"
		:title="fieldRequiredMessage"
	>*</span>
</template>

<style lang="scss" scoped>
@import "@wmde/wikit-tokens/variables";

.wbl-snl-required-asterisk {
	&:not(:first-child) {
		margin-inline-start: $dimension-spacing-small;
	}

	&:not(:last-child) {
		margin-inline-end: $dimension-spacing-small;
	}
}
</style>
