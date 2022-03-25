// note: trivial mutations aren’t tested

import mutations, {
	ADD_ERRORS,
	CLEAR_ERRORS,
} from '@/store/mutations';
import RootState, { SubmitError } from '@/store/RootState';

it( `${ADD_ERRORS} + ${CLEAR_ERRORS}`, () => {
	const state = {
		globalErrors: [],
	} as Partial<RootState> as RootState;
	const error1: SubmitError = {
		type: 'error1',
	};
	const error2: SubmitError = {
		type: 'error2',
		message: 'message two',
	};
	const error3: SubmitError = {
		type: 'error3',
	};

	mutations[ ADD_ERRORS ]( state, [ error1, error2 ] );
	expect( state.globalErrors ).toStrictEqual( [ error1, error2 ] );

	mutations[ ADD_ERRORS ]( state, [ error3 ] );
	expect( state.globalErrors ).toStrictEqual( [ error1, error2, error3 ] );

	mutations[ CLEAR_ERRORS ]( state );
	expect( state.globalErrors ).toStrictEqual( [] );

	mutations[ ADD_ERRORS ]( state, [ error1 ] );
	expect( state.globalErrors ).toStrictEqual( [ error1 ] );
} );
