<script setup lang="ts">
import { inject } from 'vue';
import { Button as WikitButton } from '@wmde/wikit-vue-components';
import { MessagesKey } from '@/plugins/MessagesPlugin/Messages';

const $messages = inject( MessagesKey );
</script>

<template>
	<form class="new-lexeme-form">
		<wikit-button
			class="form-button-submit"
			type="progressive"
			variant="primary"
		>
			{{ $messages.get( 'wikibaselexeme-new-lexeme-submit' ) }}
		</wikit-button>
	</form>
</template>

<style scoped lang="scss">
@import "@wmde/wikit-tokens/variables";

.new-lexeme-form {
	// Box model
	padding: $dimension-layout-small;

	// Border
	border-style: $border-style-base;
	border-width: $border-width-thin;
	border-radius: $border-radius-base;
	border-color: $border-color-base-subtle;
}
</style>
