describe( 'NewLexemeForm', () => {

	it( 'submits form data', () => {
		cy.visit( '/' );

		cy.on( 'window:alert', cy.stub().as( 'alert' ) );

		cy.get( 'input[name=lemma]' )
			.type( 'test lemma' );

		cy.get( '.wbl-snl-language-lookup input' )
			.type( '=Q123', { delay: 0 } );

		cy.get( '.wbl-snl-language-lookup .wikit-OptionsMenu__item' ).click();

		cy.get( 'input[name=lexicalcategory]' )
			.type( 'Q456' );

		cy.get( '.wbl-snl-form' )
			.submit();

		cy.get( '@alert' ).then( ( spy ) => {
			expect( spy ).to.have.been.calledWith(
				'Create Lexeme "test lemma"@en as Q123 Q456',
			);
			expect( spy ).to.have.been.calledWith(
				'Navigating to: Special:EntityPage/L1',
			);
		} );
	} );

} );
