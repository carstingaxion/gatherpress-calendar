<?php
/**
 * Plugin Name:       GatherPress Calendar
 * Plugin URI:        https://wordpress.org/plugins/gatherpress-calendar
 * Description:       A calendar block that displays Query Loop results in a monthly calendar format. Works with any post type, with specialized support for GatherPress events.
 * Version:           0.3.1
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

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

// Constants.
define( 'GATHERPRESS_CALENDAR_VERSION', current( get_file_data( __FILE__, array( 'Version' ), 'plugin' ) ) );
define( 'GATHERPRESS_CALENDAR_CORE_PATH', __DIR__ );

/**
 * Adds the GatherPress_Awesome namespace to the autoloader.
 *
 * This function hooks into the 'gatherpress_autoloader' filter and adds the
 * GatherPress_Awesome namespace to the list of namespaces with its core path.
 *
 * @param array $namespace An associative array of namespaces and their paths.
 * @return array Modified array of namespaces and their paths.
 */
function gatherpress_calendar_autoloader( array $namespace ): array {
	$namespace['GatherPress_Calendar'] = GATHERPRESS_CALENDAR_CORE_PATH;

	return $namespace;
}
add_filter( 'gatherpress_autoloader', 'gatherpress_calendar_autoloader' );

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



	$pattern = '<!-- wp:query {"queryId":null,"query":{"perPage":5,"pages":0,"offset":0,"postType":"gatherpress_event","order":"asc","orderBy":"datetime","inherit":false,"excludeCurrent":null,"parents":[],"sticky":"","format":[],"gatherpress_event_query":"upcoming","include_unfinished":1},"namespace":"gatherpress-event-query","enhancedPagination":true,"metadata":{"name":"Upcoming Events"},"className":"gatherpress-event-query"} -->
<div class="wp-block-query gatherpress-event-query"><!-- wp:query-pagination {"paginationArrow":"chevron","layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:query-pagination-previous {"label":"Previous Month"} /-->

<!-- wp:query-pagination-next {"label":"Next Month"} /-->
<!-- /wp:query-pagination -->

<!-- wp:gatherpress/calendar {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-gatherpress-calendar gatherpress-calendar-block" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="gatherpress-calendar-template"><!-- wp:group {"style":{"border":{"bottom":{"color":"var:preset|color|accent-5","width":"1px"},"top":[],"right":[],"left":[]}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group" style="border-bottom-color:var(--wp--preset--color--accent-5);border-bottom-width:1px"><!-- wp:gatherpress/event-date {"displayType":"start","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}}},"textColor":"contrast","fontSize":"large","fontFamily":"system-serif"} /-->

<!-- wp:post-title {"level":3,"isLink":true} /--></div>
<!-- /wp:group -->

<!-- wp:post-excerpt /-->
<!-- wp:gatherpress/rsvp {"patternPicked":true} -->
<div class="wp-block-gatherpress-rsvp"></div>
<!-- /wp:gatherpress/rsvp --></div></div>
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


/**
 * Recursively search inner blocks for a specific block name.
 *
 * @param string $block_name The block name to search for (e.g. 'gatherpress/calendar').
 * @param array<int, array<string, string|int|bool>>  $inner_blocks Array of parsed inner blocks.
 * @return bool
 */
function gatherpress_has_inner_block( string $block_name, array $inner_blocks ): bool {
	foreach ( $inner_blocks as $block ) {
		if ( ( $block['blockName'] ?? '' ) === $block_name ) {
			return true;
		}
		if ( ! empty( $block['innerBlocks'] ) && gatherpress_has_inner_block( $block_name, $block['innerBlocks'] ) ) {
			return true;
		}
	}
	return false;
}


add_filter( 'render_block_data', __NAMESPACE__ . '\\allow_core_pagination', 10, 3 );
/**
 * Dynamically set `selectedMonth` on `gatherpress/calendar` based on core pagination query vars.
 *
 * @param array<string, mixed> $parsed_block The parsed block data.
 * @param array<string, mixed> $source_block The original block data.
 * @param \WP_Block|null       $parent_block The parent block instance (if any).
 * @return array<string, mixed> The (maybe updated) parsed block data.
 */
function allow_core_pagination( array $parsed_block, array $source_block, ?\WP_Block $parent_block ): array {
	$block_name = $parsed_block['blockName'] ?? '';

	// -------------------------------------------------------------
	// 1. Target parent `core/query`: Set `pages` if calendar is inside
	// -------------------------------------------------------------
	if ( $block_name === 'core/query' ) {
		$has_calendar = gatherpress_has_inner_block( 'gatherpress/calendar', $parsed_block['innerBlocks'] ?? [] );

		if ( $has_calendar ) {

			// This could also be sset in JS, but it works here, too.
			$parsed_block['attrs']['query']['gatherpress_calendar_query'] = true;

		}

		return $parsed_block;
	}

	// -------------------------------------------------------------
	// 2. Target child `gatherpress/calendar`: Compute `selectedMonth`
	// -------------------------------------------------------------
	if ( $block_name === 'gatherpress/calendar' ) {
		// Read queryId from context (supports any nesting level, e.g. Query -> Group -> Calendar).
		$query_id = 0;
		if ( $parent_block instanceof \WP_Block ) {
			$query_id = $parent_block->context['queryId'] ?? ( $parent_block->parsed_block['attrs']['queryId'] ?? 0 );
		}

		// Only paginate if inside a Query Loop.
		if ( $query_id === 0 && ! isset( $parent_block->context['queryId'] ) ) {
			return $parsed_block;
		}

		$page_key = $query_id > 0 ? "query-{$query_id}-page" : 'query-page';
		$page     = ! empty( $_GET[ $page_key ] ) ? absint( $_GET[ $page_key ] ) : 1; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		// An existing "?query-1-page=4" does not match our queryId
		// or it is indeed page 1.
		if ( $page === 1 ) {
			return $parsed_block;
		}

		// Determine baseline starting month (defaults to current site month).
		$initial_month = ! empty( $parsed_block['attrs']['selectedMonth'] )
			? $parsed_block['attrs']['selectedMonth']
			: current_datetime()->format( 'Y-m' );

		$base_date = \DateTimeImmutable::createFromFormat( '!Y-m', $initial_month, wp_timezone() );
		if ( ! $base_date ) {
			$base_date = current_datetime();
		}

		// Page 1 = offset 0, Page 2 = +1 month, Page 3 = +2 months, etc.
		$offset = $page - 1;
		// Keep for later re-enabling, maybe!
		// $forward     = '+' . $offset;
		// $backward    = '-' . $offset;
		// $offset_      = ( $page >= 1 ) ? $forward : $backward; // !

		$target_date = $base_date->modify( "{$offset} month" );

		// Assign calculated month back to attributes.
		$parsed_block['attrs']['selectedMonth'] = $target_date->format( 'Y-m' );

		return $parsed_block;
	}

	// -------------------------------------------------------------
	// 3. Target `query-pagination-next` and `query-pagination-previous`
	// -------------------------------------------------------------
	if ( in_array( $block_name, array( 'core/query-pagination-next', 'core/query-pagination-previous' ), true ) ) {
		// Attach the hook right before new WP_Query() is executed inside core.
		add_filter( 'the_posts', __NAMESPACE__ . '\\gatherpress_force_pagination_max_pages', 10, 2 );
	}

	return $parsed_block;
}


/**
 * Force max_num_pages on the WP_Query instance created by the next block.
 * 
 * @param WP_Post[] $posts Array of post objects.
 * @param WP_Query  $query The WP_Query instance (passed by reference).
 *
 * @return WP_Post[] Array of post objects.
 */
function gatherpress_force_pagination_max_pages( array $posts, WP_Query $query ) {

	if ( isset( $query->query['gatherpress_calendar_query'] ) ) {
		// Ensure max_num_pages > $page so `$custom_query_max_pages !== $page` evaluates to true.
		$query->max_num_pages = 200;
	}

	// Immediately remove the filter so it only affects this single block query.
	remove_filter( 'the_posts', __NAMESPACE__ . '\\gatherpress_force_pagination_max_pages', 10 );

	return $posts;
}



add_filter( 'render_block_context', __NAMESPACE__ . '\\disable_query_pagination_numbers', 10, 2 );
/**
 * Change query variable in context to disable `core/query-pagination-numbers` rendering.
 *
 * @see https://developer.wordpress.org/reference/hooks/render_block_context/
 *
 * @param array<string, mixed> $context      Default context.
 * @param array $parsed_block {
 *     An associative array of the block being rendered. See WP_Block_Parser_Block.
 *
 *     @type string|null $blockName    Name of block.
 *     @type array       $attrs        Attributes from block comment delimiters.
 *     @type array[]     $innerBlocks  List of inner blocks. An array of arrays that
 *                                     have the same structure as this one.
 *     @type string      $innerHTML    HTML from inside block comment delimiters.
 *     @type array       $innerContent List of string fragments and null markers where
 *                                     inner blocks were found.
 * }
 *
 * @return array<string, mixed> Updated block context.
 */
function disable_query_pagination_numbers( array $context, array $parsed_block ) {
	if ( ! isset( $context['query'] ) || ! is_array( $context['query'] ) || ! isset( $context['query']['gatherpress_calendar_query'] ) ) {
		return $context;
	}

	if ( $parsed_block['blockName'] === 'core/query-pagination-numbers' ) {
		// This line alone makes the query-pagination-numbers silently disapear,
		// without interferencing with the other blocks.
		// Looks ugly, but works.
		$context['query']['perPage'] = 0;
	}

	return $context;
}


add_filter( 'query_vars', __NAMESPACE__ . '\\query_vars' );
/**
 * Allow a new calendar specific query variable.
 *
 * @param  string[] $query_vars The array of allowed query variable names.
 *
 * @return string[]
 */
function query_vars( array $query_vars ): array {
	$query_vars[] = 'gatherpress_calendar_query';
	return $query_vars;
}




add_filter( 'query_loop_block_query_vars', __NAMESPACE__ . '\\query_loop_block_query_vars', 10, 2 );
/**
 * Filters the arguments which will be passed to `WP_Query` for the Query Loop Block.
 *
 * @since 0.33.0
 *
 * @param array<string, mixed> $query Array containing parameters for <code>WP_Query</code> as parsed by the
 *                                    block context.
 * @param WP_Block             $block Block instance.
 *
 * @return array<string, mixed> Array containing parameters for <code>WP_Query</code> as parsed by the block
 *                              context.
 */
function query_loop_block_query_vars( array $query, WP_Block $block ) :array {
	// Retrieve the query from the passed block context.
	$block_query = $block->context['query'];

	if ( ! is_array( $block_query ) ) {
		return $query;
	}

	if ( isset( $block_query['gatherpress_calendar_query'] ) ) {
		$calendar_query_type = $block_query['gatherpress_calendar_query'];
	} else {
		return $query;
	}

	// Generate a new custom query with all potential query vars.
	$query_args = array();

	// Type of event list: 'upcoming', 'past', or 'all',
	// @see wp-content/plugins/gatherpress/includes/core/classes/class-event-query.php.
	$query_args['gatherpress_calendar_query'] = $calendar_query_type;

	/** This filter is documented in includes/query-loop.php */
	$filtered_query_args = apply_filters(
		'gatherpress_query_vars',
		$query_args,
		$block_query,
		false
	);

	$filtered_query_args = is_array( $filtered_query_args ) ? $filtered_query_args : $query_args;

	// Return the merged query.
	return array_merge(
		$query,
		$filtered_query_args
	);
}
