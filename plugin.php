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
 * The filter only runs when the request includes the 'gatherpress_calendar_query' marker.
 * This marker is set by the calendar block in both edit.js (editor) and render.php (frontend)
 * to indicate "this is a calendar query, please optimize it for month-based display."
 *
 * Why this approach is safe and precise:
 * - Only affects queries explicitly marked by the calendar block
 * - Other GatherPress event queries (lists, archives, etc.) remain unchanged
 * - No side effects on other plugins or custom queries
 * - Clear contract between calendar block and query filter
 *
 * The filter runs at priority 20 to execute after GatherPress's own query modifications.
 *
 * @since 0.1.0
 *
 * @param array           $args    WP_Query arguments that will be used for the REST request.
 * @param WP_REST_Request $request The REST request object containing parameters.
 *
 * @return array Modified query arguments with date_query added and gatherpress_event_query removed.
 *
 * @example
 * // Request from calendar block (edit.js or render.php):
 * // GET /wp-json/wp/v2/gatherpress_event?gatherpress_calendar_query=1&year=2025&month=1
 *
 * // This filter will:
 * // 1. See the gatherpress_calendar_query marker
 * // 2. Remove gatherpress_event_query (past/upcoming filter)
 * // 3. Add date_query for year=2025, month=1
 * // 4. Result: Only events from January 2025
 */
function rest_gatherpress_event_query( array $args, WP_REST_Request $request ): array {
		$parameters = $request->get_params();
		
		// Only proceed if this is a calendar query (identified by our marker)
		// AND it has year/month parameters for date filtering
		if ( isset( $parameters['gatherpress_calendar_query'] ) && isset( $parameters['year'] ) ) {
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


/**
 * Filter SQL WHERE clause to use GatherPress event dates instead of post dates.
 *
 * The exact same filter exists in GatherPress/Statistics to enable date queries.
 *
 * @since 0.1.0
 *
 * @global \wpdb $wpdb WordPress database abstraction object.
 * @param string    $where The WHERE clause of the query.
 * @param \WP_Query $query The WP_Query instance.
 * @return string Modified WHERE clause.
 */
function posts_where( string $where, \WP_Query $query ): string {
	global $wpdb;

	if ( empty( $query->query_vars['date_query'] ) ) {
		return $where;
	}

	$post_type = $query->get( 'post_type' );
	if ( 'gatherpress_event' !== $post_type && ! in_array( 'gatherpress_event', (array) $post_type, true ) ) {
		return $where;
	}

	$date_query = $query->query_vars['date_query'];
	if ( ! is_array( $date_query ) || empty( $date_query ) ) {
		return $where;
	}

	$date_filter = is_array( $date_query[0] ) ? $date_query[0] : array();

	$date_conditions = array();

	if ( ! empty( $date_filter['year'] ) ) {
		$year = absint( $date_filter['year'] );
		$date_conditions[] = $wpdb->prepare( 'YEAR(ge.datetime_start_gmt) = %d', $year );
	}

	if ( ! empty( $date_filter['month'] ) ) {
		$month = absint( $date_filter['month'] );
		$date_conditions[] = $wpdb->prepare( 'MONTH(ge.datetime_start_gmt) = %d', $month );
	}

	if ( empty( $date_conditions ) ) {
		return $where;
	}

	$where = preg_replace(
		'/AND\s*\(\s*\(\s*YEAR\(\s*[^)]+\s*\)\s*=\s*\d+(?:\s+AND\s+MONTH\(\s*[^)]+\s*\)\s*=\s*\d+)?\s*\)\s*\)/',
		'',
		$where
	);

	$events_table = $wpdb->prefix . 'gatherpress_events';
	$date_where = implode( ' AND ', $date_conditions );

	$where .= " AND {$wpdb->posts}.ID IN (
		SELECT ge.post_id 
		FROM {$events_table} ge 
		WHERE {$date_where}
	)";

	return $where;
}
add_filter( 'posts_where', __NAMESPACE__ . '\posts_where', 10, 2 );