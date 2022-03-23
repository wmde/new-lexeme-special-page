import WikiRouter from '@/plugins/WikiRouterPlugin/WikiRouter';

const unusedWikiRouter: WikiRouter = {
	goToTitle: jest.fn().mockImplementation( () => { throw new Error( 'WikiRouter should not be used in this test' ); } ),
};

export default unusedWikiRouter;
