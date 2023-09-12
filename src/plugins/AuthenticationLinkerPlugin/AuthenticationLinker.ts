import { inject, InjectionKey } from 'vue';

export default interface AuthenticationLinker {
	/**
	 * Return a URL for logging in
	 */
	getLoginLink(): string;

	/**
	 * Return a URL for creating a new account
	 */
	getCreateAccountLink(): string;
}

export const AuthenticationLinkerKey: InjectionKey<AuthenticationLinker> = Symbol( 'AuthenticationLinker' );

export function useAuthenticationLinker(): AuthenticationLinker {
	return inject( AuthenticationLinkerKey, () => {
		throw new Error( 'No AuthenticationLinker provided!' );
	}, true );
}
