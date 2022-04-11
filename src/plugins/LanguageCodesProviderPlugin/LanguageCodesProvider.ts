import {
	inject,
	InjectionKey,
} from 'vue';
import LanguageCodesProvider from '@/data-access/LanguageCodesProvider';

export const LanguageCodesProviderKey: InjectionKey<LanguageCodesProvider> = Symbol( 'LanguageCodesProvider' );

export function useLanguageCodesProvider(): LanguageCodesProvider {
	return inject( LanguageCodesProviderKey, () => {
		throw new Error( 'No LanguageCodesProvider provided!' );
	}, true );
}
