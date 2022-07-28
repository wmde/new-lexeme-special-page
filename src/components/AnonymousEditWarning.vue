<script setup lang="ts">
import { useConfig } from '@/plugins/ConfigPlugin/Config';
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import { computed } from 'vue';

const messages = useMessages();
const warning = computed(
	() => messages.get( 'wikibase-anonymouseditwarning' ) );
const config = useConfig();

</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<p
		v-if="config.isAnonymous"
		class="wbl-snl-anonymous-edit-warning"
		v-html="warning"
	/>
	<!-- eslint-enable -->
</template>

<style lang="scss" scoped>
@import "@wmde/wikit-tokens/variables";
@import "@wmde/wikit-vue-components/src/styles/mixins/Typography";

.wbl-snl-anonymous-edit-warning {
	@include body;
}
</style>
