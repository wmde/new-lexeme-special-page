export interface SubmitError {
	type: string;
	message?: string;
}

export default interface RootState {
	lemma: string;
	language: string;
	languageCodeFromLanguageItem: string | undefined | null | false;
	lexicalCategory: string;
	spellingVariant: string;
	globalErrors: SubmitError[];
}
