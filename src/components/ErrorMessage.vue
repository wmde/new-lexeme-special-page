<script setup lang="ts">
import { CdxMessage } from '@wikimedia/codex';
</script>

<template>
	<cdx-message type="error">
		<slot />
	</cdx-message>
</template>
