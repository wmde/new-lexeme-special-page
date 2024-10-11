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
@import '../styles/custom-variables.css';
@import '@wikimedia/codex-design-tokens/theme-wikimedia-ui';

.wbl-snl-required-asterisk {
	font-size: $font-size-x-large;
	line-height: 0;
	margin-inline-start: var( --dimension-spacing-xsmall );
}
</style>
