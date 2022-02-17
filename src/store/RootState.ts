export default interface RootState {
	lemma: string;
	language: string;
	lexicalCategory: string;
	token: string;
	config: {
		licenseUrl: string;
		licenseName: string;
	}
}
