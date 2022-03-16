<script setup lang="ts">
import { useMessages } from '@/plugins/MessagesPlugin/Messages';
import ItemLookup from '@/components/ItemLookup.vue';

interface Props {
	modelValue: string | null;
}

defineProps<Props>();

defineEmits( [ 'update:modelValue' ] );

const messages = useMessages();

// ! The following method was entirely written by CoPilot! (except for `origin=*`)
const searchForItems = async ( searchTerm: string, offset: number = 0 ) => {
	const searchResults = await fetch(
		`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${searchTerm}&language=en&format=json&type=item&limit=10&continue=${offset}&origin=*`,
	);
	const searchResultsJson = await searchResults.json();
	return searchResultsJson.search.map( ( result ) => {
		return {
			display: {
				label: {
					language: 'en',
					value: result.label,
				},
				description: {
					language: 'en',
					value: result.description,
				},
			},
			itemId: result.id,
		};
	} );
};

</script>

<script lang="ts">
export default {
	compatConfig: {
		MODE: 3,
	},
};
</script>

<template>
	<div>
		<item-lookup
			:label="messages.get( 'wikibaselexeme-newlexeme-language' )"
			:placeholder="messages.get( 'wikibaselexeme-newlexeme-language-placeholder' )"
			:value="modelValue"
			:search-for-items="searchForItems"
			@update:model-value="$emit( 'update:modelValue', $event )"
		/>
	</div>
</template>
