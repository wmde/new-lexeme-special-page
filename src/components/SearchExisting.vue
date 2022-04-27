<script setup lang="ts">
defineProps<{ searchMessage: string }>();
// defineEmits<{}>();
</script>

<template>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<p class="wbl-snl-intro-text" v-html="searchMessage" />
</template>
