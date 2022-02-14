<script setup lang="ts">
import { Button as WikitButton } from '@wmde/wikit-vue-components';
</script>

<template>
	<form class="new-lexeme-form">
		<wikit-button
			class="form-button-submit"
			type="progressive"
			variant="primary"
		>
			Create Lexeme
		</wikit-button>
	</form>
</template>

<style scoped lang="scss">
// FIXME: Remove this ignore rule, added to appease stylelint
/* stylelint-disable-line no-empty-source */
</style>
