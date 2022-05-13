# New Lexeme Special Page form

This repository holds the form for the new version of the [NewLexeme special page](https://www.wikidata.org/wiki/Special:NewLexeme) on Wikidata.

Please report bugs on [phabricator](https://phabricator.wikimedia.org/project/view/5674/).

## Local Development

_**Prerequisites: This repository requires node v14+ and npm v7+**_

### Initial setup

1. Clone this repository
2. Install dependecies with `npm i`

This will also install some Git pre-commit hooks that check any modified files against the configured linters.
(Use `git commit -n` to skip these hooks, e.g. to create some work-in-progress commits that will be cleaned up later.)

### Regular development

TL;DR: All checks are run with:
```sh
npm t
```
#### Dev Entry point

To run the development entry point also known as the dev server:
```sh
npm run dev
```
You can visit the dev entry point at <http://localhost:3000/>.
Changes to the source files will be applied automatically,
so you can start this once and then leave it running in the background.

For instructions to see the form in the context of the special page,
see the [WikibaseLexeme readme](https://gerrit.wikimedia.org/g/mediawiki/extensions/WikibaseLexeme/+/master/README.md).

The dev entry point can also read some parameters from the URL,
as a single JSON-serialized `initParams` object in the same format as the special page passes to the app.
Here are some useful links:
- [no params](http://localhost:3000/)
- [empty params](http://localhost:3000/?initParams=%7B%7D)
- [full params](http://localhost:3000/?initParams=%7B%22lemma%22%3A%22lemma%22%2C%22spellVarCode%22%3A%22en%22%2C%22language%22%3A%7B%22id%22%3A%22Q1860%22%2C%22display%22%3A%7B%22label%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22English%22%7D%2C%22description%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22language%22%7D%7D%2C%22languageCode%22%3A%22en%22%7D%2C%22lexicalCategory%22%3A%7B%22id%22%3A%22Q1064%22%2C%22display%22%3A%7B%22label%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22noun%22%7D%2C%22description%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22lexical%20category%22%7D%7D%7D%7D)
- [lemma](http://localhost:3000/?initParams=%7B%22lemma%22%3A%22lemma%22%7D)
- [language item with language code](http://localhost:3000/?initParams=%7B%22language%22%3A%7B%22id%22%3A%22Q1860%22%2C%22display%22%3A%7B%22label%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22English%22%7D%2C%22description%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22language%22%7D%7D%2C%22languageCode%22%3A%22en%22%7D%7D)
- [language item without language code](http://localhost:3000/?initParams=%7B%22language%22%3A%7B%22id%22%3A%22Q1860%22%2C%22display%22%3A%7B%22label%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22English%22%7D%2C%22description%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22language%22%7D%7D%2C%22languageCode%22%3Anull%7D%7D)
- [language item with invalid language code](http://localhost:3000/?initParams=%7B%22language%22%3A%7B%22id%22%3A%22Q1860%22%2C%22display%22%3A%7B%22label%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22English%22%7D%2C%22description%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22language%22%7D%7D%2C%22languageCode%22%3Afalse%7D%7D)
- [lexical category](http://localhost:3000/?initParams=%7B%22lexicalCategory%22%3A%7B%22id%22%3A%22Q1064%22%2C%22display%22%3A%7B%22label%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22noun%22%7D%2C%22description%22%3A%7B%22language%22%3A%22en%22%2C%22value%22%3A%22lexical%20category%22%7D%7D%7D%7D)

#### Linting
The linters, except for TypeScript type checking, can be run with:
```sh
npm run lint
```

Many linter errors can be fixed automatically:
```sh
npm run fix
```

Static type checking is executed with
```sh
npm run check-types
```

#### Testing

Several npm scripts are available to only run a subset of tests, such as:
```sh
npm run test-only # only tests without linters
npm run test:unit
npm run test:integration
```

Unit tests (in `tests/unit/`) focus on excercising a self-contained piece of code, while integration tests in (`tests/integration/`) are designed to test the interaction between several components and the store.

Finally, browser tests in `cypress/integration/` are designed to test this application end-to-end with actual browser interaction.
They are also the main place for the automated accessiblity tests.

Cypress tests are run against the dev entry point (see above) and thus use `/index.html` to provide the scaffolding.
After you've started the dev server, you can open the interactive browser tests environment with:
```sh
npm run cypress:open
```
