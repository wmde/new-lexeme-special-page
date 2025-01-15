<script setup lang="ts">
import { useMessages } from '@/plugins/MessagesPlugin/Messages';

const messages = useMessages();
</script>

<template>
	<span
		class="wbl-snl-required-asterisk"
		aria-hidden="true"
		:title="messages.getUnescaped( 'wikibaselexeme-form-field-required' )"
	>*</span>
</template>

<style lang="scss" scoped>
@use '@wikimedia/codex-design-tokens/theme-wikimedia-ui';
@import '../styles/custom-variables.css';

.wbl-snl-required-asterisk {
	font-size: theme-wikimedia-ui.$font-size-x-large;
	line-height: 0;
	margin-inline-start: var( --dimension-spacing-xsmall );
}
</style>
