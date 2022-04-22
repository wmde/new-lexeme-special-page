export default interface LanguageCodesProvider {
	getLanguages(): Map<string, string>;
	isValid( languageCode: string ): boolean;
}

export class MapLanguageCodesProvider implements LanguageCodesProvider {

	private readonly validLanguages: Map<string, string>;

	public constructor(
		validLanguages: Map<string, string>,
	) {
		this.validLanguages = validLanguages;
	}

	public getLanguages(): Map<string, string> {
		return this.validLanguages;
	}

	public isValid( langCode: string ): boolean {
		return this.validLanguages.has( langCode );
	}
}
