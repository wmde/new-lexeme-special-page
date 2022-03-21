export default interface WikiRouter {
	goToTitle( title: string, params?: Record<string, unknown> ): void;
}
