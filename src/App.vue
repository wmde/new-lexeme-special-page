<script setup lang="ts">
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import SearchExisting from '@/components/SearchExisting.vue';
import '@wmde/wikit-vue-components/dist/wikit-vue-components.css';
</script>

<template>
	<teleport to="#wbl-snl-intro-text-wrapper">
		<search-existing />
	</teleport>
	<div class="wbl-snl-app">
		<new-lexeme-form />
	</div>
</template>
