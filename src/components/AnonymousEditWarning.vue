<script setup lang="ts">
import WarningMessage from '@/components/WarningMessage.vue';
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { computed } from 'vue';
import { useAuthenticationLinker } from '@/plugins/AuthenticationLinkerPlugin/AuthenticationLinker';
import MessageKeys from '@/plugins/MessagesPlugin/MessageKeys';

const authenticationLinker = useAuthenticationLinker();
const messages = useMessages();
const config = useConfig();
let messageKey: MessageKeys = 'wikibase-anonymouseditwarning';
if ( config.tempUserEnabled ) {
	messageKey = 'wikibase-anonymouseditnotificationtempuser';
}
const warning = computed(
	() => messages.get(
		messageKey,
		authenticationLinker.getLoginLink(),
		authenticationLinker.getCreateAccountLink(),
	) );

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
@import '@/styles/custom-variables.css';

.wbl-snl-anonymous-edit-warning {
	margin: var( --dimension-layout-xsmall ) 0;
}
</style>
