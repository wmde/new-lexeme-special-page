import { MwUtilGetUrl } from '@/@types/mediawiki';
import AuthenticationLinker from '@/plugins/AuthenticationLinkerPlugin/AuthenticationLinker';

export default class MediaWikiAuthenticationLinker implements AuthenticationLinker {

	public constructor(
		private readonly getUrl: MwUtilGetUrl,
		private readonly currentPage: string,
	) {}

	public getCreateAccountLink(): string {
		return this.getUrl( 'Special:CreateAccount', { returnto: this.currentPage } );
	}

	public getLoginLink(): string {
		return this.getUrl( 'Special:UserLogin', { returnto: this.currentPage } );
	}

}
