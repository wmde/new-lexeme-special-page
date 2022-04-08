import { DataValue, Statement, StatementMap } from '@wmde/wikibase-datamodel-types';

export type WbGetClaimsResponse = {
	claims: StatementMap;
};

function getStringFromClaim( claim: Statement ): string | false {
	if ( claim.mainsnak.snaktype !== 'value' ) {
		return false;
	}

	if ( claim.mainsnak.datavalue?.type !== 'string' ) {
		throw new Error( `Expected ${claim.mainsnak.property} to have DataValueType "string" but got "${claim.mainsnak.datavalue?.type}"!` );
	}

	return ( claim.mainsnak.datavalue as DataValue ).value;
}

export function processWbGetClaimsResponse(
	response: WbGetClaimsResponse,
	languageCodeProperty: string,
): string | false | null {
	if ( !response.claims[ languageCodeProperty ] ) {
		return null;
	}

	const preferredRankStatements = response.claims[ languageCodeProperty ].filter( ( claim ) => claim.rank === 'preferred' );
	if ( preferredRankStatements.length !== 0 ) {
		return getStringFromClaim( preferredRankStatements[ 0 ] );
	}

	const normalRankStatements = response.claims[ languageCodeProperty ].filter( ( claim ) => claim.rank === 'normal' );
	if ( normalRankStatements.length !== 0 ) {
		return getStringFromClaim( normalRankStatements[ 0 ] );
	}

	return null;
}
