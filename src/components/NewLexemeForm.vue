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
			{{ $messages.get( 'new-lexeme-submit' ) }}
		</wikit-button>
	</form>
</template>

<style scoped lang="scss">
// FIXME: Remove this ignore rule, added to appease stylelint
/* stylelint-disable-line no-empty-source */
</style>
