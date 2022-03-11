import LexemeCreator from '@/data-access/LexemeCreator';

const unusedLexemeCreator: LexemeCreator = {
	createLexeme: jest.fn().mockRejectedValue(
		new Error( 'LexemeCreator should not be used in this test' ) ),
};

export default unusedLexemeCreator;
