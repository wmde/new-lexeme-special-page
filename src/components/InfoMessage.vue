<script setup lang="ts">
import { Icon as WikitIcon } from '@wmde/wikit-vue-components';
</script>

<template>
	<div class="wbl-snl-info-message">
		<p class="wbl-snl-info-message__about">
			<wikit-icon type="info" />
			ABOUT_LEXEMES
		</p>
		<p>LEXICOGRAPHICAL_DATA</p>
		<div class="wbl-snl-info-message__example">
			(LEXEME_ID)
			<div>
				<span
					lang="LEMMA_LANGUAGE"
					class="wbl-snl-info-message__example-lemma"
				>
					LEMMA_TEXT
				</span>
				LEMMA_LANGUAGE
			</div>
			<div>
				LANGUAGE_COLON<!---->LANGUAGE_LINK
				LEXICAL_CATEGORY_COLON<!---->LEXICAL_CATEGORY_LINK
			</div>
		</div>
		<p>NO_GENERAL_DATA</p>
	</div>
</template>

<style lang="scss">
@import "@wmde/wikit-tokens/variables";

.wbl-snl-info-message {
	border-style: $border-style-base;
	border-width: $border-width-thin;
	border-radius: $border-radius-base;
	border-color: $border-color-base-subtle;
	background-color: $background-color-base-default;
	padding: $dimension-layout-small;
	block-size: 100%;
	box-sizing: border-box;

	& > :not(:first-child) {
		margin-block-start: $dimension-layout-xsmall;
	}

	&__example {
		display: flex;
		flex-direction: row;

		&-lemma {
			font-weight: bold;
		}
	}
}
</style>
