<script setup lang="ts">
import AnonymousEditWarning from '@/components/AnonymousEditWarning.vue';
import NewLexemeForm from '@/components/NewLexemeForm.vue';
import SearchExisting from '@/components/SearchExisting.vue';

</script>

<template>
	<teleport to="#wbl-snl-intro-text-wrapper">
		<search-existing />
		<anonymous-edit-warning />
	</teleport>
	<div class="wbl-snl-app">
		<new-lexeme-form />
	</div>
</template>
