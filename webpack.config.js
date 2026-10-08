/**
 * Webpack configuration extending WordPress scripts with GatherPress dependency extraction.
 *
 * @see https://github.com/GatherPress/gatherpress/tree/6b796e07abb438f91536b73d7567dfc894160b91/docs/developer/blocks/slot-fills#importing-instead-of-reading-the-global
 */

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

const GATHERPRESS = '@gatherpress/';
const surface = ( request ) => request.slice( GATHERPRESS.length );
const camelCase = ( name ) =>
	name.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() );

// Swap wp-scripts' extraction plugin for one that also resolves GatherPress surfaces.
const withGatherPress = ( config ) => ( {
	...config,
	plugins: [
		...config.plugins.filter(
			( plugin ) =>
				'DependencyExtractionWebpackPlugin' !== plugin.constructor.name
		),
		new DependencyExtractionWebpackPlugin( {
			requestToExternal: ( request ) =>
				request.startsWith( GATHERPRESS )
					? [ 'gatherpress', camelCase( surface( request ) ) ]
					: undefined,
			requestToHandle: ( request ) =>
				request.startsWith( GATHERPRESS )
					? `gatherpress-${ surface( request ) }`
					: undefined,
		} ),
	],
} );

// Handle both standard configuration and experimental module configurations.
module.exports = Array.isArray( defaultConfig )
	? [ withGatherPress( defaultConfig[ 0 ] ), ...defaultConfig.slice( 1 ) ]
	: withGatherPress( defaultConfig );
