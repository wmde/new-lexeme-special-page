# New Lexeme Special Page form

This repository holds the form for the [NewLexeme special page](https://www.wikidata.org/wiki/Special:NewLexeme) on Wikidata.

Please report bugs on [phabricator](https://phabricator.wikimedia.org/project/view/5674/).

## Local Development

_**Prerequisites: This repository requires node v16 and up**_

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

You can run individual unit or integration tests using `npx jest`, for example:
```sh
npx jest tests/unit/store/actions.test.ts
npx jest tests/integration/App.test.ts
```

Finally, browser tests in `cypress/integration/` are designed to test this application end-to-end with actual browser interaction.
They are also the main place for the automated accessiblity tests.

Cypress tests are run against the dev entry point (see above) and thus use `/index.html` to provide the scaffolding.
After you've started the dev server, you can open the interactive browser tests environment with:
```sh
npm run cypress:open
```

### Chore: Dependency Updates

You can see which dependencies have new releases by first making sure your local dependencies are up-to-date by executing `npm ci` and then running `npm outdated`.
The following dependencies should be ignored:

- Vue and Vuex:
  in production, we use the versions shipped by MediaWiki core,
  so we should use the same versions for testing.
  The current versions shipped by MediaWiki core are listed in [foreign-resources.yaml](https://gerrit.wikimedia.org/g/mediawiki/core/+/master/resources/lib/foreign-resources.yaml).
- Node.js version:
  The GitHub Workflows here should use the same Node.js version as the `mwgate-nodeXX-docker` CI job in WikibaseLexeme,
  because that job builds this app for the `test:snl-distnodiff` script. This version is currently Node 18.
  The upgrade to Node 20 there is tracked in [T343827](https://phabricator.wikimedia.org/T343827).
- ESLint and related dependencies (i.e. `@typescript-eslint/eslint-plugin`, `eslint-plugin-cypress`):
  ESLint v9 requires flat config, which is currently incompatible with some MediaWiki repos.
  Migration to ESLint v9 is tracked in [T364065](https://phabricator.wikimedia.org/T364065).
  Until this migration is complete, we can't update to versions of dependencies that require v9 or higher.
  

All other dependencies should generally be updated to the latest version.
If you discover that a dependency should not be updated for some reason, please add it to the above list.
If a dependency can only be updated with substantial manual work,
you can create a new task for it and skip it in the context of the current chore.

The recommended way to update dependencies is to collect related dependency updates into grouped commits;
this keeps the number of commits to review manageable (compared to having one commit for every update),
while keeping the scope of each commit limited and increasing reviewability and debuggability (compared to combining all updates in a single commit).
For example, this can be one commit for each of:

- all ESLint-related dependency updates
- all Jest-related dependency updates
- all Vue-related dependency updates
- all PostCSS/Stylelint-related dependency updates
- `npm update` for all other dependency updates

Make sure that all checks still pass for every commit.

If you’re working with dependabot,
and it ran into the limit of open pull requests or its PRs are otherwise outdated,
you can trigger a new run at
[Insights > Dependency graph > Dependabot](https://github.com/wmde/new-lexeme-special-page/network/updates) > Recent update jobs > Check for updates.

Once all dependency updates are merged, update the submodule version in WikibaseLexeme (see below).

## Updating the submodule version in WikibaseLexeme

This repository is a git submodule in WikibaseLexeme.
That submodule needs to be updated there for changes here to be deployed to production.

To update the submodule version in WikibaseLexeme run `npm run bump-special-new-lexeme` there.
See [New Lexeme Special Page in the WikibaseLexeme dev README](https://github.com/wikimedia/mediawiki-extensions-WikibaseLexeme/blob/master/README-dev.md#new-lexeme-special-page) for more details.
