import MwTracker from '@/data-access/tracking/MwTracker';

describe( 'MwTracker', () => {
	it( 'forwards to the track function with the right prefix', () => {
		const track = jest.fn();
		const tracker = new MwTracker( track );

		tracker.increment( 'some.topic' );

		expect( track ).toHaveBeenCalledTimes( 1 );
		expect( track ).toHaveBeenCalledWith( 'counter.MediaWiki.some.topic', 1 );
	} );
} );
