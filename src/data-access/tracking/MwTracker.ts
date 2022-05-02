import { MwTrack } from '@/@types/mediawiki';
import Tracker from '@/data-access/tracking/Tracker';

export default class MwTracker implements Tracker {
	public constructor(
		private trackFunction: MwTrack,
	) {}

	public increment( name: string ): void {
		this.trackFunction( `counter.MediaWiki.${name}`, 1 );
	}
}
