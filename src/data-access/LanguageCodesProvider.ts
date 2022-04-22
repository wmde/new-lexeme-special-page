export default interface LanguageCodesProvider {
	getLanguages(): Map<string, string>;
	isValid( languageCode: string ): boolean;
}

export class ListLanguageCodesProvider implements LanguageCodesProvider {

	private readonly validLanguageCodes: Map<string, string>;

	public constructor(
		validLanguageCodes: Record<string, string>,
	) {
		this.validLanguageCodes = new Map( Object.entries( validLanguageCodes ) );
	}

	public getLanguages(): Map<string, string> {
		return this.validLanguageCodes;
	}

	public isValid( langCode: string ): boolean {
		return this.validLanguageCodes.has( langCode );
	}
}
