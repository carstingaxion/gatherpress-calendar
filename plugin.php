<?php
/**
 * Plugin Name:       GatherPress Calendar
 * Plugin URI:        https://wordpress.org/plugins/gatherpress-calendar
 * Description:       A calendar block that displays Query Loop results in a monthly calendar format. Works with any post type, with specialized support for GatherPress events.
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

declare(strict_types=1);

namespace GatherPress\Calendar;

use WP_REST_Request;
use WP_Query;
use wpdb;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

// Constants.
define( 'GATHERPRESS_CALENDAR_VERSION', current( get_file_data( __FILE__, array( 'Version' ), 'plugin' ) ) );
define( 'GATHERPRESS_CALENDAR_CORE_PATH', __DIR__ );

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



	$pattern = '<!-- wp:query {"queryId":1,"query":{"perPage":5,"pages":0,"offset":0,"postType":"gatherpress_event","gatherpress_event_query":"upcoming","include_unfinished":1,"order":"asc","orderBy":"datetime","inherit":false},"namespace":"gatherpress-event-query","align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-query alignwide"><!-- wp:gatherpress/calendar {"align":"wide","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-gatherpress-calendar alignwide gatherpress-calendar-block" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="gatherpress-calendar-template"><!-- wp:group {"style":{"border":{"bottom":{"color":"var:preset|color|accent-5","width":"1px"},"top":{},"right":{},"left":{}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group" style="border-bottom-color:var(--wp--preset--color--accent-5);border-bottom-width:1px"><!-- wp:gatherpress/event-date {"displayType":"start","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}}},"textColor":"contrast","fontSize":"large","fontFamily":"system-serif"} /-->

<!-- wp:post-title {"level":3,"isLink":true} /--></div>
<!-- /wp:group -->

<!-- wp:post-excerpt /--></div></div>
<!-- /wp:gatherpress/calendar --></div>
<!-- /wp:query -->';

	register_block_pattern(
		'gatherpress/calendar',
		array(
			'title'         => __( 'Event Calendar', 'gatherpress-calendar' ),
			'description'   => _x( 'Show GatherPress events in a monthly calendar format.', 'Block pattern description', 'gatherpress-calendar' ),
			'content'       => $pattern,
			'categories'    => array( 'gatherpress' ),
			'keywords'      => array( 'calendar', 'event', 'query' ),
			'viewportWidth' => 1400,
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\\block_init' );


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
 * @param array<string, mixed>                                                                          $args    WP_Query arguments that will be used for the REST request.
 * @param WP_REST_Request<array{gatherpress_calendar_query:string|null, year:int|null, month:int|null}> $request Request object which may contain gatherpress_calendar_query filter marker, year and month.
 *
 * @return array<string, mixed> Modified query arguments with date_query added and gatherpress_event_query removed.
 *
 * @example
 * // Request from calendar block (edit.js):
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
	// AND it has year/month parameters for date filtering.
	if ( ! isset( $parameters['gatherpress_calendar_query'] )
		|| ! isset( $parameters['year'] ) 
		|| empty( $parameters['year'] )
	) {
		return $args;
	}

	// Remove GatherPress's past/upcoming filter since we're doing month-specific filtering.
	unset( $args['gatherpress_event_query'] );

	// Initialize date_query if it doesn't exist.
	if ( ! isset( $args['date_query'] ) || ! is_array( $args['date_query'] ) ) {
		$args['date_query'] = array();
	}

	// Add date query for year and optional month.
	// This limits results to posts published/scheduled within the specified timeframe.
	$args['date_query'][0] = array(
		'year' => (int) $parameters['year'],
	);

	if ( isset( $parameters['month'] ) && ! empty( $parameters['month'] ) ) {
		$args['date_query'][0]['month'] = (int) $parameters['month'];
	}

	return $args;
}
add_filter( 'rest_gatherpress_event_query', __NAMESPACE__ . '\\rest_gatherpress_event_query', 20, 2 );


/**
 * Filter SQL WHERE clause to use GatherPress event dates instead of post dates.
 *
 * The exact same filter exists in GatherPress/Statistics to enable date queries.
 *
 * @since 0.1.0
 *
 * @global wpdb $wpdb WordPress database abstraction object.
 *
 * @param string   $where The WHERE clause of the query.
 * @param WP_Query $query The WP_Query instance.
 *
 * @return string Modified WHERE clause.
 */
function posts_where( string $where, WP_Query $query ): string {
	global $wpdb;

	if ( ! ( $wpdb instanceof wpdb ) ) {
		return $where;
	}

	if ( empty( $query->query_vars['date_query'] ) || ! is_array( $query->query_vars['date_query'] ) ) {
		return $where;
	}

	if ( 'gatherpress_event' !== $query->get( 'post_type' ) && ! in_array( 'gatherpress_event', (array) $query->get( 'post_type' ), true ) ) {
		return $where;
	}

	$date_filter_raw = $query->query_vars['date_query'][0] ?? array();
	$date_filter     = is_array( $date_filter_raw ) ? $date_filter_raw : array();

	$date_conditions = array();

	if ( ! empty( $date_filter['year'] ) && is_numeric( $date_filter['year'] ) ) {
		$year              = absint( $date_filter['year'] );
		$date_conditions[] = $wpdb->prepare( 'YEAR(ge.datetime_start_gmt) = %d', $year );
	}

	if ( ! empty( $date_filter['month'] ) && is_numeric( $date_filter['month'] ) ) {
		$month             = absint( $date_filter['month'] );
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

	if ( ! is_string( $where ) ) {
		$where = '';
	}

	$events_table = $wpdb->prefix . 'gatherpress_events';
	$date_where   = implode( ' AND ', $date_conditions );

	$where .= " AND {$wpdb->posts}.ID IN (
		SELECT ge.post_id 
		FROM {$events_table} ge 
		WHERE {$date_where}
	)";

	return $where;
}
add_filter( 'posts_where', __NAMESPACE__ . '\\posts_where', 10, 2 );
