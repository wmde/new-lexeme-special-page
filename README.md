# New Lexeme Special Page form

This repository holds the form for the new version of [NewLexme special page](https://www.wikidata.org/wiki/Special:NewLexeme) on Wikidata.

Please report bugs on [phabricator](https://phabricator.wikimedia.org/project/view/5674/).

## Local Development

_**Prerequisits: This repository requires node v16 and up**_

1. Clone this repository
2. Install dependecies with `npm i`
3. Test and lint with `npm test`

## Deploy Local Commits

### The first time you run a deploy

To be able to run the netlify commands locally you will need to run `npx netlify login` once after `npm install` to authenticate and obtain a token.

### Every time when doing a deploy

To create a deploy of the current commit, run `npm run deployCommit`. This will create a build in the `./dist` folder and create a manual deployment to a unique address that will be generated at the time of deploy. 
To deploy to [https://new-lexeme-special-page.netlify.app](https://new-lexeme-special-page.netlify.app) run `npx netlify deploy --prod`.


