describe( 'NewLexemeForm', () => {

	it( 'submits form data', () => {
		cy.visit( '/' );

		cy.on( 'window:alert', cy.stub().as( 'alert' ) );

		cy.get( 'input[name=lemma]' )
			.type( 'test lemma' );

		cy.get( 'input[name=lexeme-language]' )
			.type( 'Q123' );

		cy.get( 'input[name=lexicalcategory]' )
			.type( 'Q456' );

		cy.get( '.wbl-snl-form' )
			.submit();

		cy.get( '@alert' ).then( ( spy ) => {
			expect( spy ).to.have.been.calledOnceWith(
				'Create Lexeme "test lemma"@en as Q123 Q456',
			);
		} );
	} );

} );
