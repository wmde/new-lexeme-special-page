import AnonymousEditWarning from '@/components/AnonymousEditWarning.vue';
import { ConfigKey } from '@/plugins/ConfigPlugin/Config';
import { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import { mount } from '@vue/test-utils';
import { AuthenticationLinkerKey } from '@/plugins/AuthenticationLinkerPlugin/AuthenticationLinker';

describe( 'AnonymousEditWarning', () => {

	it( 'does nothing if not anonymous', () => {
		const messages = { get: jest.fn() };
		const authenticationLinker = {
			getLoginLink: jest.fn(),
			getCreateAccountLink: jest.fn(),
		};
		const warning = mount( AnonymousEditWarning, {
			global: {
				provide: {
					[ ConfigKey as symbol ]: { isAnonymous: false },
					[ MessagesKey as symbol ]: messages,
					[ AuthenticationLinkerKey as symbol ]: authenticationLinker,
				},
			},
		} );

		expect( warning.isVisible() ).toBe( false );
		expect( messages.get ).not.toHaveBeenCalled();
		expect( authenticationLinker.getLoginLink ).not.toHaveBeenCalled();
		expect( authenticationLinker.getCreateAccountLink ).not.toHaveBeenCalled();
	} );

	it( 'matches snapshot if anonymous', () => {
		const messages = { get: jest.fn().mockImplementation( ( ...params ) =>
			`(${params.join( ', ' )})`,
		) };
		const authenticationLinker = {
			getLoginLink: jest.fn().mockReturnValue( 'loginLink' ),
			getCreateAccountLink: jest.fn().mockReturnValue( 'createAccountLink' ),
		};
		const warning = mount( AnonymousEditWarning, {
			global: {
				provide: {
					[ ConfigKey as symbol ]: { isAnonymous: true },
					[ MessagesKey as symbol ]: messages,
					[ AuthenticationLinkerKey as symbol ]: authenticationLinker,
				},
			},
		} );

		expect( warning.html() ).toMatchSnapshot();
		expect( messages.get ).toHaveBeenCalledWith( 'wikibase-anonymouseditwarning', 'loginLink', 'createAccountLink' );
	} );

} );
