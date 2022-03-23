import { inject, InjectionKey } from 'vue';

export default interface WikiRouter {
	goToTitle( title: string ): void;
}

export const WikiRouterKey: InjectionKey<WikiRouter> = Symbol( 'WikiRouter' );

export function useWikiRouter(): WikiRouter {
	return inject( WikiRouterKey, () => {
		throw new Error( 'No WikiRouter provided!' );
	}, true );
}
