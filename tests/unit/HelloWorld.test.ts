import { mount } from '@vue/test-utils';
import { Button as WikitButton } from '@wmde/wikit-vue-components';
import HelloWorld from '@/components/HelloWorld.vue';

beforeAll( () => {
	process.env = Object.assign( process.env, { VUE_APP_VUE3COMPAT: '1' } );
} );

describe( 'HelloWorld', () => {
	it( 'has a WikitButton', () => {
		const wrapper = mount( HelloWorld );
		const button = wrapper.findComponent( WikitButton );

		expect( button.exists() ).toBe( true );
	} );
} );
