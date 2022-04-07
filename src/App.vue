<script setup lang="ts">
import InfoMessage from '@/components/InfoMessage.vue';
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import '@wmde/wikit-vue-components/dist/wikit-vue-components.css';
</script>

<template>
	<p class="wbl-snl-intro-text">
		To Be Done
	</p>
	<div class="wbl-snl-app">
		<new-lexeme-form />
		<info-message />
	</div>
</template>

<style lang="scss" scoped>
@import "@wmde/wikit-tokens/variables";
@import "@wmde/wikit-vue-components/src/styles/mixins/Typography";

$break-point: 981px;

.wbl-snl-intro-text {
	@include body;
}

.wbl-snl-app {
	display: flex;

	@media (min-width: $break-point + 1) {
		align-items: stretch;

		& > * + * {
			margin-inline-start: $dimension-layout-medium;
		}
	}

	@media (max-width: $break-point) {
		flex-direction: column;

		& > * + * {
			margin-block-start: $dimension-layout-small;
		}
	}

	& > * {
		flex: 1 1 0;
	}
}
</style>
