export default class LanguageCodesProvider {
	public constructor(
		private readonly validLanguageCodes: string[],
	) {}

	public getLanguageCodes(): readonly string[] {
		return this.validLanguageCodes;
	}

	public isValid( langCode: string ): boolean {
		return this.validLanguageCodes.includes( langCode );
	}
}
