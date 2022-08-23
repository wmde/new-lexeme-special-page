<script setup lang="ts">
import WarningMessage from '@/components/WarningMessage.vue';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { computed } from 'vue';

const messages = useMessages();
const warning = computed(
	() => messages.get( 'wikibase-anonymouseditwarning' ) );
const config = useConfig();

</script>

<template>
	<warning-message
		v-if="config.isAnonymous"
		class="wbl-snl-anonymous-edit-warning"
	>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<span v-html="warning" />
	</warning-message>
</template>

<style lang="scss" scoped>
.wbl-snl-anonymous-edit-warning {
	margin: 1rem 0;
}
</style>
