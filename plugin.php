<?php
/**
* Plugin Name:  Query Map
* Plugin URI:   https://wordpress.org/plugins/query-map
* Description:  Display query loop results on an interactive OpenStreetMap showing posts with geodata.
* Version:      0.1.0
* Requires at least: 6.0
* Requires PHP: 7.4
* Author:       WordPress Telex
* License:      GPLv2 or later
* License URI:  https://www.gnu.org/licenses/gpl-2.0.html
* Text Domain:  query-map
*
* @package QueryMap
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
* Registers the Query Map block.
*
* @since 0.1.0
*
* @return void
*/
function query_map_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'query_map_block_init' );

/**
* Enqueue Leaflet assets for the frontend.
*
* Leaflet is loaded from CDN to avoid bundling large dependencies.
* These are only enqueued when the block is actually used on the page.
*
* @since 0.1.0
*
* @return void
*/
function query_map_enqueue_leaflet_assets() {
	if ( ! has_block( 'gatherpress/query-map' ) ) {
		return;
	}

	// Leaflet CSS
	wp_enqueue_style(
		'leaflet',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
		array(),
		'1.9.4'
	);

	// Leaflet JS - must load before view.js
	wp_enqueue_script(
		'leaflet',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
		array(),
		'1.9.4',
		true
	);

	// Make view.js depend on Leaflet
	$view_asset_file = __DIR__ . '/build/view.asset.php';
	if ( file_exists( $view_asset_file ) ) {
		$view_asset = require $view_asset_file;
		wp_script_add_data(
			'gatherpress-query-map-view-script',
			'dependencies',
			array_merge( $view_asset['dependencies'], array( 'leaflet' ) )
		);
	}
}
add_action( 'wp_enqueue_scripts', 'query_map_enqueue_leaflet_assets' );

/**
* Enqueue Leaflet assets for the block editor.
*
* @since 0.1.0
*
* @return void
*/
function query_map_enqueue_editor_assets() {
	// Leaflet CSS
	wp_enqueue_style(
		'leaflet',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
		array(),
		'1.9.4'
	);

	// Leaflet JS - must load before editor script
	wp_enqueue_script(
		'leaflet',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
		array(),
		'1.9.4',
		false
	);

	// Make editor script depend on Leaflet
	$editor_asset_file = __DIR__ . '/build/index.asset.php';
	if ( file_exists( $editor_asset_file ) ) {
		$editor_asset = require $editor_asset_file;
		wp_script_add_data(
			'gatherpress-query-map-editor-script',
			'dependencies',
			array_merge( $editor_asset['dependencies'], array( 'leaflet' ) )
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'query_map_enqueue_editor_assets' );