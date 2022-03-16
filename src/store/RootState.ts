export default interface RootState {
	lemma: string;
	language: string;
	lexicalCategory: string;
	config: {
		licenseUrl: string;
		licenseName: string;
	};
}
