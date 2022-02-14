// TODO: Remove this test once the example component is no longer needed.

import { mount } from '@vue/test-utils';
import { Button as WikitButton } from '@wmde/wikit-vue-components';

import store from '@/store';

import HelloWorld from '@/components/HelloWorld.vue';

beforeAll( () => {
	process.env = Object.assign( process.env, { VUE_APP_VUE3COMPAT: '1' } );
} );

describe( 'HelloWorld', () => {
	it( 'has a WikitButton', () => {
		const wrapper = mount( HelloWorld, {
			global: { plugins: [ store ] },
		} );
		const button = wrapper.findComponent( WikitButton );

		expect( button.exists() ).toBe( true );
	} );
} );
