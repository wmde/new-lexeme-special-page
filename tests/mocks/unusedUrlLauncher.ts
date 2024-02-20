import UrlLauncher from '@/plugins/UrlLauncherPlugin/UrlLauncher';

const unusedUrlLauncher: UrlLauncher = {
	goToURL: jest.fn().mockImplementation( () => {
		throw new Error( 'UrlLauncher should not be used in this test' );
	} ),
};

export default unusedUrlLauncher;
