export interface SubmitError {
	type: string;
	message?: string;
}

export default interface RootState {
	lemma: string;
	language: string;
	lexicalCategory: string;
	spellingVariant: string;
	globalErrors: SubmitError[];
}
