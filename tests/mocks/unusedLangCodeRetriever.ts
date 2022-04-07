import LangCodeRetriever from '@/data-access/LangCodeRetriever';

const unusedLangCodeRetriever: LangCodeRetriever = {
	getLanguageCodeFromItem: jest.fn().mockRejectedValue(
		new Error( 'LangCodeRetriever should not be used in this test' ),
	),
};

export default unusedLangCodeRetriever;
