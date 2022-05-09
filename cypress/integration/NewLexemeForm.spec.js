import 'cypress-axe';

function terminalLog( violations ) {
	cy.task(
		'log',
		`${violations.length} accessibility violation${
			violations.length === 1 ? '' : 's'
		} ${violations.length === 1 ? 'was' : 'were'} detected`,
	);
	// pluck specific keys to keep the table readable
	const violationData = violations.map(
		( { id, impact, description, nodes } ) => ( {
			id,
			impact,
			description,
			nodes: nodes.length,
		} ),
	);

	cy.task( 'table', violationData );
}

describe( 'NewLexemeForm', () => {

	it( 'submits form data with inferred language code', () => {
		cy.visit( '/' );

		cy.on( 'window:alert', cy.stub().as( 'alert' ) );

		cy.intercept( { query: { action: 'wbgetclaims' } }, {
			claims: {
				P218: [ {
					mainsnak: {
						snaktype: 'value',
						property: 'P218',
						hash: 'faa942355921695b9fa30805f0bb66bc7ed5a433',
						datavalue: {
							value: 'en-gb',
							type: 'string',
						},
						datatype: 'external-id',
					},
					type: 'statement',
					id: 'Q123$c5c5b451-38a0-4d7c-99b9-af4fdf893d08',
					rank: 'normal',
				} ],
			},
		} ).as( 'LanguageCodeRetrieval' );

		cy.get( 'input[name=lemma]' )
			.type( 'test lemma' );

		cy.get( '.wbl-snl-language-lookup input' )
			.type( '=Q123', { delay: 0 } );
		cy.get( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).click();

		cy.wait( '@LanguageCodeRetrieval' );

		cy.get( '.wbl-snl-lexical-category-lookup input' )
			.type( '=Q456', { delay: 0 } );
		cy.get( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).click();

		cy.get( '.wbl-snl-form' )
			.submit();

		cy.get( '@alert' ).then( ( spy ) => {
			expect( spy ).to.have.been.calledWith(
				'Create Lexeme "test lemma"@en-gb as Q123 Q456',
			);
			expect( spy ).to.have.been.calledWith(
				'Navigating to: Special:EntityPage/L1',
			);
		} );
	} );

	it( 'submits form data with explicitly set spelling variant', () => {
		cy.visit( '/' );

		cy.on( 'window:alert', cy.stub().as( 'alert' ) );

		cy.intercept( { query: { action: 'wbgetclaims' } }, {
			claims: {},
		} ).as( 'LanguageCodeRetrieval' );

		cy.get( 'input[name=lemma]' )
			.type( 'test lemma' );

		cy.get( '.wbl-snl-language-lookup input' )
			.type( '=Q123', { delay: 0 } );
		cy.get( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).click();

		cy.get( '.wbl-snl-lexical-category-lookup input' )
			.type( '=Q456', { delay: 0 } );
		cy.get( '.wbl-snl-lexical-category-lookup .wikit-OptionsMenu__item' ).click();

		cy.wait( '@LanguageCodeRetrieval' );

		cy.get( '.wbl-snl-spelling-variant-lookup input' )
			.type( 'en-ca', { delay: 0 } );
		cy.get( '.wbl-snl-spelling-variant-lookup .wikit-OptionsMenu__item' ).click();

		cy.get( '.wbl-snl-form' )
			.submit();

		cy.get( '@alert' ).then( ( spy ) => {
			expect( spy ).to.have.been.calledWith(
				'Create Lexeme "test lemma"@en-ca as Q123 Q456',
			);
			expect( spy ).to.have.been.calledWith(
				'Navigating to: Special:EntityPage/L1',
			);
		} );
	} );

	it( 'should be accessible', () => {
		cy.visit( '/' );
		cy.injectAxe();
		cy.checkA11y( null, null, terminalLog );
	} );

} );
