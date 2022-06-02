import MessageKeys from './MessageKeys';
import MessagesRepository from './MessagesRepository';

const messages: Record<MessageKeys, string> = {
	'wikibaselexeme-newlexeme-lemma': 'Lemma',
	'wikibaselexeme-newlexeme-lemma-empty-error': 'Lemma field is empty; please make an entry.',
	'wikibaselexeme-newlexeme-lemma-placeholder-with-example': 'Base form of a word, e.g. \'$1\'',
	'wikibaselexeme-newlexeme-language': 'Lexeme\'s language',
	'wikibaselexeme-newlexeme-language-empty-error': 'The Lexeme\'s language field is empty; please make an entry.',
	'wikibaselexeme-newlexeme-language-placeholder-with-example': 'The Lexeme\'s language, e.g. \'$1\'',
	'wikibaselexeme-newlexeme-lexicalcategory': 'Lexical category',
	'wikibaselexeme-newlexeme-lexicalcategory-empty-error': 'The Lexical Category field is empty; please make an entry.',
	'wikibaselexeme-newlexeme-lexicalcategory-placeholder-with-example': 'The Lexeme\'s category, e.g. \'$1\'',
	'wikibaselexeme-newlexeme-lemma-language': 'Spelling variant of the Lemma',
	'wikibaselexeme-newlexeme-lemma-language-empty-error': 'The spelling variant field is empty; please make an entry.',
	'wikibaselexeme-newlexeme-lemma-language-placeholder-with-example': 'Language code for the Lemma\'s spelling variant, e.g. \'$1\'',
	'wikibaselexeme-newlexeme-search-existing': 'You can check whether a Lexeme already exists by using <a href="$1">the search</a>. You can also learn more about Lexemes in the help box below.',
	'wikibaselexeme-newlexeme-submit': 'Create Lexeme',
	'wikibaselexeme-newlexeme-submit-error': 'The server encountered a temporary error and could not complete your request. Please try again.',
	'wikibaselexeme-newlexeme-submitting': 'Creating Lexeme...',
	'wikibaselexeme-newlexeme-lemma-too-long-error': 'FIXME (copy is missing!)',
	'wikibaselexeme-newlexeme-invalid-language-code-warning': 'This Item has an unrecognized language code. Please select one below.',
	'wikibase-lexeme-lemma-language-option': '$1 ($2)',
	'wikibase-entityselector-notfound': 'No match was found',
	'wikibase-shortcopyrightwarning': 'By clicking "$1", you agree to the <a href="./$2">terms of use</a>, and you irrevocably agree to release your contribution under the <a href="$3">$4</a>.',
	copyrightpage: 'Project:Copyrights',
};

/** Messages repository for the dev entry point. */
export default class DevMessagesRepository implements MessagesRepository {

	public get( key: MessageKeys, ...params: string[] ): string {
		return messages[ key ] !== undefined ? this.replace( messages[ key ], ...params.map( this.escape ) ) : `⧼${key}⧽`;
	}
	public getText( key: MessageKeys, ...params: string[] ): string {
		return messages[ key ] !== undefined ? this.replace( messages[ key ], ...params ) : `⧼${key}⧽`;
	}

	private replace( message: string, ...args: string[] ) {
		return message.replace(
			/\$(\d+)/g,
			( _, i ) => args[ i - 1 ],
		);
	}

	private escape( s: string ) {
		return s.replace(
			/[^0-9A-Za-z,.: ]/g,
			( c ) => '&#' + c.charCodeAt( 0 ) + ';',
		);
	}
}
