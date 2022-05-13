import { SearchedItemOption } from '@/data-access/ItemSearcher';

export interface SubmitError {
	type: string;
	message?: string;
}

export default interface RootState {
	lemma: string;
	language: SearchedItemOption | null;
	languageCodeFromLanguageItem: string | undefined | null | false;
	lexicalCategory: SearchedItemOption | null;
	spellingVariant: string;
	globalErrors: SubmitError[];
}
