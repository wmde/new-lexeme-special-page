import { DataValue, Statement, StatementMap } from '@wmde/wikibase-datamodel-types';

export type WbGetClaimsResponse = {
	claims: StatementMap;
};

function getStringValueFromStatement( statement: Statement ): string | false {
	if ( statement.mainsnak.snaktype !== 'value' ) {
		return false;
	}

	if ( statement.mainsnak.datavalue?.type !== 'string' ) {
		throw new Error( `Expected ${statement.mainsnak.property} to have DataValueType "string" but got "${statement.mainsnak.datavalue?.type}"!` );
	}

	return ( statement.mainsnak.datavalue as DataValue ).value;
}

export function processWbGetClaimsResponse(
	response: WbGetClaimsResponse,
	languageCodeProperty: string,
): string | false | null {
	if ( !response.claims[ languageCodeProperty ] ) {
		return null;
	}

	const preferredRankStatements = response.claims[ languageCodeProperty ].filter( ( statement ) => statement.rank === 'preferred' );
	if ( preferredRankStatements.length !== 0 ) {
		return getStringValueFromStatement( preferredRankStatements[ 0 ] );
	}

	const normalRankStatements = response.claims[ languageCodeProperty ].filter( ( statement ) => statement.rank === 'normal' );
	if ( normalRankStatements.length !== 0 ) {
		return getStringValueFromStatement( normalRankStatements[ 0 ] );
	}

	return null;
}
