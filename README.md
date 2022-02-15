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

To be able to run the netlify commands you will need to run `npm run netlify login` once after installing netlify to authenticate and obtain a token.

### Every time when doing a deploy

Before making a deploy make sure you make a build locally of the content that should be deployed by running `npm run buildPreview`, this command will create a bundle of the project inside a `/dist` folder.

Afterwards, run `npm run netlify deploy --dir="./dist"` to run manual deployments to a unique address that will be generated at the time of deploy. 
To deploy to [https://new-lexeme-special-page.netlify.app](https://new-lexeme-special-page.netlify.app) run `npm run netlify deploy --prod --dir="./dist`. 


