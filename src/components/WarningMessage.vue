<script setup lang="ts">
import { CdxMessage } from '@wikimedia/codex';
</script>

<template>
	<cdx-message type="warning">
		<slot />
	</cdx-message>
</template>
