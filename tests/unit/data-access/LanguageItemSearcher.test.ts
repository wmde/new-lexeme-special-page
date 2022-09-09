import LanguageItemSearcher from '@/data-access/LanguageItemSearcher';
import MwApiItemSearcher from '@/data-access/MwApiItemSearcher';
import unusedApi from '../../mocks/unusedApi';

describe( 'LanguageItemSearcher', () => {

	it.each( [
		{
			name: 'passes through the offset',
			availableSearchProfiles: [ 'default' ],
			offset: 42,
			expectedOptionalParams: [ 42, {} ],
		},
		{
			name: 'uses language profile if available',
			availableSearchProfiles: [ 'language', 'default' ],
			offset: undefined,
			expectedOptionalParams: [ undefined, { profile: 'language' } ],
		},
	] )( '$name', async ( { availableSearchProfiles, offset, expectedOptionalParams } ) => {
		const itemSearcher = new MwApiItemSearcher( unusedApi, 'en' );
		const spy = jest.spyOn( itemSearcher, 'searchItems' ).mockImplementation( () => Promise.resolve( [] ) );
		const languageItemSearcher = new LanguageItemSearcher(
			itemSearcher,
			availableSearchProfiles,
		);

		await languageItemSearcher.searchItems( 'search term', offset );

		expect( spy ).toHaveBeenCalledWith( 'search term', ...expectedOptionalParams );
	} );
} );
