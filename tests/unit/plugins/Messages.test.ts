import MessagesRepository from '@/plugins/MessagesPlugin/MessagesRepository';
import Messages from '@/plugins/MessagesPlugin/Messages';
import MessageKeys from '@/plugins/MessagesPlugin/MessageKeys';

describe( 'Messages', () => {

	it( 'forwards to the MessagesRepository', () => {
		const messagesRepository: MessagesRepository = {
			get: jest.fn( ( key ) => `test ${key}` ),
			getText: jest.fn( ( key ) => `test text ${key}` ),
		};
		const messages = new Messages( messagesRepository );

		const message = messages.get( 'key' as MessageKeys );
		const messageText = messages.getUnescaped( 'key' as MessageKeys );

		expect( messagesRepository.get ).toHaveBeenCalledTimes( 1 );
		expect( messagesRepository.get ).toHaveBeenCalledWith( 'key' );
		expect( message ).toBe( 'test key' );
		expect( messageText ).toBe( 'test text key' );

		const parameter = 'something';
		messages.get( 'key' as MessageKeys, parameter );
		expect( messagesRepository.get ).toHaveBeenCalledWith( 'key', parameter );
	} );
} );
