import AnonymousEditWarning from '@/components/AnonymousEditWarning.vue';
import { ConfigKey } from '@/plugins/ConfigPlugin/Config';
import { MessagesKey } from '@/plugins/MessagesPlugin/Messages';
import { mount } from '@vue/test-utils';

describe( 'AnonymousEditWarning', () => {

	it( 'does nothing if not anonymous', () => {
		const messages = { get: jest.fn() };
		const warning = mount( AnonymousEditWarning, {
			global: {
				provide: {
					[ ConfigKey as symbol ]: { isAnonymous: false },
					[ MessagesKey as symbol ]: messages,
				},
			},
		} );

		expect( warning.isVisible() ).toBe( false );
		expect( messages.get ).not.toHaveBeenCalled();
	} );

	it( 'matches snapshot if anonymous', () => {
		const messages = { get: jest.fn().mockImplementation( ( key ) => key ) };
		const warning = mount( AnonymousEditWarning, {
			global: {
				provide: {
					[ ConfigKey as symbol ]: { isAnonymous: true },
					[ MessagesKey as symbol ]: messages,
				},
			},
		} );

		expect( warning.html() ).toMatchSnapshot();
		expect( messages.get ).toHaveBeenCalledWith( 'wikibase-anonymouseditwarning' );
	} );

} );
