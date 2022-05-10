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
