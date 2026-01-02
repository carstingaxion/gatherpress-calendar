<?php
/**
 * Plugin Name:       GatherPress Calendar
 * Plugin URI:        https://wordpress.org/plugins/gatherpress-calendar
 * Description:       A foundational calendar block for GatherPress, designed to display events in an organized and accessible manner.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            carstenbach & WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gatherpress-calendar
 *
 * @package GatherPressCalendar
 */

namespace GatherPress\Calendar;

use WP_REST_Request;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the GatherPress Calendar block.
 *
 * This function handles the initialization and registration of the block type
 * using the metadata loaded from the block.json file. It ensures all assets
 * (JavaScript, CSS) are properly enqueued in both the editor and frontend contexts.
 *
 * The block is a dynamic block, meaning it uses a PHP render callback (render.php)
 * to generate its output on the server side. This allows it to access the full
 * WordPress query context and work seamlessly with the Query Loop block.
 *
 * @since 0.1.0
 *
 * @return void
 */
function block_init(): void {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', __NAMESPACE__ . '\block_init' );


/**
 * Modify GatherPress event queries to support month-based filtering.
 *
 * When the calendar block adds year/month parameters to a REST API request
 * for GatherPress events, this filter removes the conflicting 'gatherpress_event_query'
 * parameter and adds a proper date_query instead. This ensures the calendar can
 * display events from a specific month without interference from GatherPress's
 * default past/upcoming event filtering.
 *
 * The filter runs at priority 20 to execute after GatherPress's own query modifications.
 *
 * Why this is needed:
 * - GatherPress adds 'gatherpress_event_query' to differentiate past/upcoming events
 * - This parameter conflicts with month-specific filtering
 * - The calendar needs precise month control for its date-based display
 * - Without this filter, queries would show all upcoming events, not just the month's events
 *
 * @since 0.1.0
 *
 * @param array           $args    WP_Query arguments that will be used for the REST request.
 * @param WP_REST_Request $request The REST request object containing parameters.
 *
 * @return array Modified query arguments with date_query added and gatherpress_event_query removed.
 */
function rest_gatherpress_event_query( array $args, WP_REST_Request $request ): array {
		$parameters = $request->get_params();
		
		// If both gatherpress_event_query and year parameters exist,
		// remove the GatherPress query and add date filtering
		if ( isset( $parameters['gatherpress_event_query'] ) && isset( $parameters['year'] ) ) {
			// Remove GatherPress's past/upcoming filter since we're doing month-specific filtering
			unset( $args['gatherpress_event_query'] );
	
			// Initialize date_query if it doesn't exist
			if ( ! isset( $args['date_query'] ) ) {
				$args['date_query']    = array();
				$args['date_query'][0] = array();
			}

			// Add date query for year and optional month
			// This limits results to posts published/scheduled within the specified timeframe
			$args['date_query'][0]['year'] = $parameters['year'];
			if ( isset( $parameters['month'] ) ) {
				$args['date_query'][0]['month'] = $parameters['month'];
			}
		}
		return $args;
	}
add_filter( 'rest_gatherpress_event_query', __NAMESPACE__ . '\rest_gatherpress_event_query', 20, 2 );