import LanguageCodesProvider from '@/data-access/LanguageCodesProvider';

const unusedLanguageCodesProvider: LanguageCodesProvider = {
	getLanguageCodes: (): never => {
		throw new Error( 'This test should not use LanguageCodesProvider!' );
	},
	isValid: (): never => {
		throw new Error( 'This test should not use LanguageCodesProvider!' );
	},
};

export default unusedLanguageCodesProvider;
