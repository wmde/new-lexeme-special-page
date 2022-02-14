# New Lexeme Special Page form

This repository holds the form for the new version of [NewLexme special page](https://www.wikidata.org/wiki/Special:NewLexeme) on Wikidata.

Please report bugs on [phabricator](https://phabricator.wikimedia.org/project/view/5674/).

## Local Development

_**Prerequisits: This repository requires node v16 and up**_

1. Clone this repository
2. Install dependecies with `npm i`
3. Test and lint with `npm test`

## Manual Deployment

Before making a deploy make sure you make a build locally of the content that should be deployed by running `npm run buildPreview`.

Afterwards, run `netlify deploy` to run manual deployments to a unique address that will be generated at the time of deploy. 
To deploy to [https://new-lexeme-special-page.netlify.app](https://new-lexeme-special-page.netlify.app) run `netlify deploy --prod`. 

To be able to run the netlify commands you will need to run `netlify login` once after installing netlify to authenticate and obtain a token.

Note: If you get `netlify: command not found` when running these commands you can call the binaries directly. Example: `./node_modules/netlify-cli/bin/run deploy`
