<script setup lang="ts">
import { useStore } from 'vuex';
import { Button as WikitButton } from '@wmde/wikit-vue-components';
import { computed } from 'vue';
import { INCREMENT } from '@/store/mutations';

defineProps<{ msg: string }>();

const store = useStore();
const count = computed( () => store.state.count );
const increment = () => store.commit( INCREMENT );
</script>

<template>
	<h1>{{ msg }}</h1>

	<p>See <code>README.md</code> for more information.</p>

	<p>
		<a href="https://vitejs.dev/guide/features.html" target="_blank">
			Vite Docs
		</a>
		|
		<a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
	</p>

	<wikit-button @click.native="increment">
		count is: {{ count }}
	</wikit-button>
	<p>
		Edit
		<code>components/HelloWorld.vue</code> to test hot module replacement.
	</p>
</template>

<style lang="scss" scoped>
a {
	color: #42b983;
}

p {
	code {
		background-color: #eee;
		padding: 2px 4px;
		border-radius: 4px;
		color: #304455;
	}
}
</style>
