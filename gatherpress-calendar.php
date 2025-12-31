<?php
/**
 * Plugin Name:       GatherPress Calendar
 * Plugin URI:        https://wordpress.org/plugins/gatherpress-calendar
 * Description:       A foundational calendar block for GatherPress, designed to display events in an organized and accessible manner.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gatherpress-calendar
 *
 * @package GatherPressCalendar
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the GatherPress Calendar block.
 *
 * This function handles the initialization and registration of the block type
 * using the metadata loaded from the block.json file. It ensures all assets
 * are properly enqueued in both the editor and frontend contexts.
 *
 * @since 0.1.0
 *
 * @return void
 */
function gatherpress_calendar_block_init(): void {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'gatherpress_calendar_block_init' );


/**
 * runs on 20 to be later than GatherPress itself
 */
add_filter( 'rest_gatherpress_event_query', function ( $args, $request ) {
	$parameters = $request->get_params();

	if ( ! isset( $args['date_query'] ) ) {
		$args['date_query'] = array();
		$args['date_query'][0] = array();
	}

	if ( isset( $parameters['gatherpress_event_query'] ) && isset( $parameters['year'] ) ) {
		// 
		unset( $args['gatherpress_event_query'] );
		
		// Add date query for year and optional month
		$args['date_query'][0]['year'] = $parameters['year'];
		if ( isset( $parameters['month'] ) ) {
			$args['date_query'][0]['month'] = $parameters['month'];
		}
	}
	return $args;
}, 20, 2 );
