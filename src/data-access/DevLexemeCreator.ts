import { SubmitError } from '@/store/RootState';
import { nextTick } from 'vue';
import LexemeCreator from './LexemeCreator';

/** Lexeme creator for the dev entry point. */
export default class DevLexemeCreator implements LexemeCreator {

	public async createLexeme(
		lemma: string,
		lemmaLanguageCode: string,
		lexemeLanguageItemId: string,
		lexicalCategoryItemId: string,
	): Promise<string> {

		await nextTick(); // let Vue update the DOM before blocking alert()
		// eslint-disable-next-line no-alert
		alert( `Create Lexeme "${lemma}"@${lemmaLanguageCode} as ${lexemeLanguageItemId} ${lexicalCategoryItemId}` );
		// for testing, enter 'error' in the lemma
		if ( lemma === 'error' ) {
			const errors: SubmitError[] = [ {
				type: 'dev',
				message: '<em>dev error message</em>',
			} ];
			return Promise.reject( errors );
		}
		return 'L1';
	}

}
