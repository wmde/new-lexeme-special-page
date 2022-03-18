import { MwApi } from '@/@types/mediawiki';

const unusedApi: MwApi = {
	get: jest.fn().mockRejectedValue(
		new Error( 'api.get() should not be used in this test' ) ),
	assertCurrentUser: jest.fn().mockRejectedValue(
		new Error( 'api.assertCurrentUser() should not be used in this test' ) ),
	postWithEditToken: jest.fn().mockRejectedValue(
		new Error( 'api.postWithEditToken() should not be used in this test' ) ),
};

export default unusedApi;
