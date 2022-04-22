<script setup lang="ts">
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import '@wmde/wikit-vue-components/dist/wikit-vue-components.css';
</script>

<template>
	<teleport to="#wbl-snl-intro-text-wrapper">
		<p class="wbl-snl-intro-text">
			To Be Done
		</p>
	</teleport>
	<div class="wbl-snl-app">
		<new-lexeme-form />
	</div>
</template>

<style lang="scss" scoped>
@import "@wmde/wikit-tokens/variables";
@import "@wmde/wikit-vue-components/src/styles/mixins/Typography";

.wbl-snl-intro-text {
	@include body;
}
</style>
