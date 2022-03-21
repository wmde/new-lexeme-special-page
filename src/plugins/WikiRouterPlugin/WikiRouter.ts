export default interface WikiRouter {
	getPageUrl( title: string, params?: Record<string, unknown> ): string;
	goToTitle( title: string, params?: Record<string, unknown> ): void;
}
