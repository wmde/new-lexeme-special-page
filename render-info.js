const { open } = require( 'fs/promises' );
const { createSSRApp } = require( 'vue' );
const { pipeToNodeWritable } = require( 'vue/server-renderer' );
const InfoMessage = require( './dist/info.cjs' );

const app = createSSRApp( InfoMessage );
open( 'dist/info.html', 'w' ).then( ( file ) => {
	pipeToNodeWritable( app, {}, file.createWriteStream() );
} );
