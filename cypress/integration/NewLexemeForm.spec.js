describe( 'NewLexemeForm', () => {

	it( 'adds a hidden input with the CSRF token', () => {
		cy.visit( '/' );

		cy.get( 'input[name=wpEditToken]' )
			.should( 'have.value', 'dev-token' )
			.should( 'be.hidden' );
	} );

} );
