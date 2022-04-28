# New Lexeme Special Page form

This repository holds the form for the new version of [NewLexme special page](https://www.wikidata.org/wiki/Special:NewLexeme) on Wikidata.

Please report bugs on [phabricator](https://phabricator.wikimedia.org/project/view/5674/).

## Local Development

_**Prerequisits: This repository requires node v16 and up**_

### One-time setup

1. Clone this repository
2. Install dependecies with `npm i`

This will also install some Git pre-commit hooks that check any modified files against the configured linters.
(Use `git commit -n` to skip these hooks, e.g. to create some work-in-progress commits that will be cleaned up later.)

### Regular development

Run `npm t` to run all tests and linters.
Other npm scripts are also available to run a subset of these,
e.g. `npm run test-only` to run only the tests without the linters,
or `npm run test:unit` to run only the unit tests.
Use `npm run fix` to have the linters fix any fixable errors.

Run `npm run dev` to run the dev entry point, then visit it at <http://localhost:3000/>.
Changes to the source files will be applied automatically,
so you can start this once and then leave it running in the background.

For instructions to see the form in the context of the special page,
see the [WikibaseLexeme readme](https://gerrit.wikimedia.org/g/mediawiki/extensions/WikibaseLexeme/+/master/README.md).

## Deploy Local Commits

### The first time you run a deploy

To be able to run the netlify commands locally you will need to run `npx netlify login` once after `npm install` to authenticate and obtain a token.

### Every time when doing a deploy

To create a deploy of the current commit, run `npm run deployCommit`. This will create a build in the `./dist` folder and create a manual deployment to a unique address that will be generated at the time of deploy. 


[Development on this project powered by Netlify](https://www.netlify.com/)
