# New Lexeme Special Page form

This repository holds the form for the new version of [NewLexme special page](https://www.wikidata.org/wiki/Special:NewLexeme) on Wikidata.

Please report bugs on [phabricator](https://phabricator.wikimedia.org/project/view/5674/).

## Local Development

_**Prerequisits: This repository requires node v16 and up**_

1. Clone this repository
2. Install dependecies with `npm i`
3. Test and lint with `npm test`

## Manual Deployment

Run `netlify deploy` to run manual deployments to [https://new-lexeme-special-page.netlify.app](https://new-lexeme-special-page.netlify.app). If you haven't done so you may need to run `netlify login` the first time you do this to authenticate and obtain a token.

Note: If you get `netlify: command not found` when running these commands you can call the binaries directly. Example: `./node_modules/netlify-cli/bin/run deploy`
