describe( 'NewLexemeForm', () => {

	it( 'submits form data', () => {
		cy.visit( '/' );

		cy.intercept( 'POST', '/' )
			.as( 'post' );

		cy.get( 'input[name=lemma]' )
			.type( 'test lemma' );

		cy.get( 'input[name=lexeme-language]' )
			.type( 'Q123' );

		cy.get( 'input[name=lexicalcategory]' )
			.type( 'Q456' );

		cy.get( '.wbl-snl-form' )
			.submit();

		cy.wait( '@post' )
			.then( ( { request } ) => {
				const params = new URLSearchParams( request.body );
				expect( params.get( 'lemma' ) ).to.equal( 'test lemma' );
				expect( params.get( 'lemma-language' ) ).to.equal( 'en' );
				expect( params.get( 'lexeme-language' ) ).to.equal( 'Q123' );
				expect( params.get( 'lexicalcategory' ) ).to.equal( 'Q456' );
				expect( params.get( 'wpEditToken' ) ).to.equal( 'dev-token' );
			} );
	} );

} );
