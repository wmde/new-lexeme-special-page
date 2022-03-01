import MessageKeys from './MessageKeys';
import MessagesRepository from './MessagesRepository';

const messages: Record<MessageKeys, string> = {
	'wikibaselexeme-newlexeme-lemma': 'Lemma',
	'wikibaselexeme-newlexeme-lemma-placeholder': 'Short form of a word such as in a dictionary entry, e.g. \'first\'',
	'wikibaselexeme-newlexeme-language': 'Lexeme\'s language',
	'wikibaselexeme-newlexeme-language-placeholder': 'The Lexeme\'s language, e.g. \'English\'',
	'wikibaselexeme-newlexeme-lexicalcategory': 'Lexical category',
	'wikibaselexeme-newlexeme-lexicalcategory-placeholder': 'The Lexeme\'s category, e.g. \'numeral\'',
	'wikibaselexeme-newlexeme-submit': 'Create Lexeme',
	'wikibaselexeme-newlexeme-error-no-lemma': 'Lemma field is empty, please make an entry.',
	'wikibaselexeme-newlexeme-error-lemma-is-too-long': 'FIXME (copy is missing!)',
};

export class MockMessagesRepository implements MessagesRepository {

	public get( key: MessageKeys ): string {
		return messages[ key ] !== undefined ? messages[ key ] : `⧼${key}⧽`;
	}
	public getText( key: MessageKeys ): string {
		return messages[ key ] !== undefined ? messages[ key ] : `⧼${key}⧽`;
	}
}
