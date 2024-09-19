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
@import '@wikimedia/codex-design-tokens/theme-wikimedia-ui';

.wbl-snl-required-asterisk {
	font-size: $font-size-xx-large;
	line-height: 0;

	&:not( :first-child ) {
		margin-inline-start: $spacing-50;
	}

	&:not( :last-child ) {
		margin-inline-end: $spacing-50;
	}
}
</style>
