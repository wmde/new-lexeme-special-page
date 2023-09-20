<script setup lang="ts">
import { useMessages } from '@/plugins/MessagesPlugin/Messages';

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
	<span
		class="wbl-snl-required-asterisk"
		aria-hidden="true"
		:title="messages.getUnescaped( 'wikibaselexeme-form-field-required' )"
	>*</span>
</template>

<style lang="scss" scoped>
@import "@wmde/wikit-tokens/variables";

.wbl-snl-required-asterisk {
	font-size: $font-size-xxlarge;
	line-height: 0;

	&:not(:first-child) {
		margin-inline-start: $dimension-spacing-small;
	}

	&:not(:last-child) {
		margin-inline-end: $dimension-spacing-small;
	}
}
</style>
