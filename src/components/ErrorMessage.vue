<script setup lang="ts">
import { Message as WikitMessage } from '@wmde/wikit-vue-components';

</script>

<template>
	<wikit-message type="error">
		<slot />
	</wikit-message>
</template>
