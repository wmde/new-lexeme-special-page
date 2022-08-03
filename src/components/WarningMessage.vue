<script setup lang="ts">
import { Message as WikitMessage } from '@wmde/wikit-vue-components';
</script>

<template>
	<wikit-message type="warning">
		<slot />
	</wikit-message>
</template>
