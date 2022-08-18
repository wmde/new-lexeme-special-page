<script setup lang="ts">
import { Message as WikitMessage } from '@wmde/wikit-vue-components';
</script>

<template>
	<wikit-message type="warning">
		<slot />
	</wikit-message>
</template>

<style lang="scss" scoped>
.wbl-snl-anonymous-edit-warning {
	margin-top: 1rem;
	margin-bottom: 1rem;
}
</style>
