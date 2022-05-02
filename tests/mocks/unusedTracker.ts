import Tracker from '@/data-access/tracking/Tracker';

const unusedTracker: Tracker = {
	increment: jest.fn().mockImplementation( () => { throw new Error( 'Tracker should not be used in this test' ); } ),
};

export default unusedTracker;
