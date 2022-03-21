import WikiRouter from '@/plugins/WikiRouterPlugin/WikiRouter';

const unusedWikiRouter: WikiRouter = {
	goToTitle: jest.fn().mockRejectedValue( new Error( 'WikiRouter should not be used in this test' ) ),
};

export default unusedWikiRouter;
