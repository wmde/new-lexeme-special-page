import SearchLinker from '@/plugins/SearchLinkerPlugin/SearchLinker';

const mockSearchLinker: SearchLinker = {
	getSearchUrlForLexeme: jest.fn().mockImplementation( () => {
		throw new Error( 'SearchLinker should not be used in this test' );
	} ),
};

export default mockSearchLinker;
