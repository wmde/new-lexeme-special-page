import { SearchedItemOption } from '@/data-access/ItemSearcher';
import MessageKeys from '@/plugins/MessagesPlugin/MessageKeys';

export interface SubmitError {
	type: string;
	message?: string;
}

interface PerFieldError {
	messageKey: MessageKeys;
}

export default interface RootState {
	lemma: string;
	language: SearchedItemOption | null;
	languageSearchInput: string;
	languageCodeFromLanguageItem: string | undefined | null | false;
	lexicalCategory: SearchedItemOption | null;
	lexicalCategorySearchInput: string;
	spellingVariant: string;
	spellingVariantSearchInput: string;
	globalErrors: SubmitError[];
	perFieldErrors: {
		lemmaErrors: PerFieldError[];
		languageErrors: PerFieldError[];
		lexicalCategoryErrors: PerFieldError[];
		spellingVariantErrors: PerFieldError[];
	};
}
