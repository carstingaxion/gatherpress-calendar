<?php
/**
 * Manages setup for the Calendar block and all of its components.
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use GatherPress\Core\Event;
use GatherPress\Core\Traits\Singleton;
use WP_Block;
use WP_Post;
use WP_REST_Request;
use WP_Query;

/**
 * Class Setup.
 *
 * Manages plugin setup and initialization.
 */
class Setup {
	/**
	 * Enforces a single instance of this class.
	 */
	use Singleton;

	/**
	 * Query parameter name for queries containing calendars.
	 *
	 * @since 0.34.0
	 * @var string
	 */
	const CALENDAR_QUERY_PARAM      = 'gatherpress_calendar_query';
	const CALENDAR_QUERY_VIEW_TYPE  = 'gatherpress_calendar_view_type';
	const CALENDAR_QUERY_START_DATE = 'gatherpress_calendar_start_date';
	const CALENDAR_QUERY_END_DATE   = 'gatherpress_calendar_end_date';
	const CALENDAR_QUERY_HEADING    = 'gatherpress_calendar_heading';

	/**
	 * Constructor for the Setup class.
	 *
	 * Initializes and sets up various components of the plugin.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Set up hooks for various purposes.
	 *
	 * This method adds hooks for different purposes as needed.
	 *
	 * @return void
	 */
	protected function setup_hooks(): void {
		add_action( 'init', array( $this, 'block_init' ) );
		add_filter( 'rest_gatherpress_event_query', array( $this, 'rest_gatherpress_event_query' ), 20, 2 );
		add_filter( 'render_block_data', array( $this, 'allow_core_pagination' ), 10, 3 );
		add_filter( 'render_block_context', array( $this, 'disable_query_pagination_numbers' ), 10, 2 );
		add_filter( 'query_vars', array( $this, 'query_vars' ) );
		add_filter( 'query_loop_block_query_vars', array( $this, 'query_loop_block_query_vars' ), 10, 2 );
	}

	/**
	 * Registers the GatherPress Calendar block and binding sources.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public function block_init(): void {
		// Standard registration (GatherPress core does this in a loop).
		register_block_type( GATHERPRESS_CALENDAR_CORE_PATH . '/build/calendar' );

		if ( file_exists( GATHERPRESS_CALENDAR_CORE_PATH . '/build/calendar-week/' ) ) {
			register_block_type( GATHERPRESS_CALENDAR_CORE_PATH . '/build/calendar-week/' );
		}

		if ( file_exists( GATHERPRESS_CALENDAR_CORE_PATH . '/build/calendar-day/' ) ) {
			register_block_type( GATHERPRESS_CALENDAR_CORE_PATH . '/build/calendar-day/' );
		}

		if ( file_exists( GATHERPRESS_CALENDAR_CORE_PATH . '/build/calendar-entries/' ) ) {
			register_block_type( GATHERPRESS_CALENDAR_CORE_PATH . '/build/calendar-entries/' );
		}

		register_block_bindings_source(
			'gatherpress/calendar-day',
			array(
				'label'              => _x( 'Calendar Day Number', 'Block Bindings Source', 'gatherpress-calendar' ),
				'get_value_callback' => array( $this, 'get_day_number_binding_value' ),
				'uses_context'       => array(
					'gatherpress/dayNumber',
					'gatherpress/isEmpty',
				),
			)
		);

		register_block_bindings_source(
			'gatherpress/calendar-heading',
			array(
				'label'              => _x( 'Calendar Heading', 'Block Bindings Source', 'gatherpress-calendar' ),
				'get_value_callback' => array( $this, 'get_heading_binding_value' ),
				'uses_context'       => array( 'query' ),
			)
		);
	}

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
	public function rest_gatherpress_event_query( array $args, WP_REST_Request $request ): array {
		$parameters = $request->get_params();

		// Only proceed if this is a calendar query (identified by our marker)
		// AND it has year/month parameters for date filtering.
		if ( ! isset( $parameters[ self::CALENDAR_QUERY_PARAM ] ) ) {
			return $args;
		}

		// Remove GatherPress's past/upcoming filter since we're doing specific date range filtering.
		unset( $args[ Event\Query::EVENT_QUERY_PARAM ] );

		// Initialize date_query if it doesn't exist.
		if ( ! isset( $args['date_query'] ) || ! is_array( $args['date_query'] ) ) {
			$args['date_query'] = array();
		}

		$start_date = $parameters['start_date'] ?? $parameters['after'] ?? null;
		$end_date   = $parameters['end_date'] ?? $parameters['before'] ?? null;

		if ( ! empty( $start_date ) && ! empty( $end_date ) ) {
			$args['date_query'][0] = array(
				'after'     => sanitize_text_field( (string) $start_date ) . ' 00:00:00',
				'before'    => sanitize_text_field( (string) $end_date ) . ' 23:59:59',
				'inclusive' => true,
			);
		}

		return $args;
	}

	/**
	 * Recursively find the attrs of the first inner block matching a name.
	 *
	 * @since 0.6.0
	 *
	 * @param string                           $block_name   The block name to search for.
	 * @param array<int, array<string, mixed>> $inner_blocks Array of parsed inner blocks.
	 *
	 * @return array<string, mixed>|null The matching block's attrs or null.
	 */
	public static function gatherpress_find_inner_block_attrs( string $block_name, array $inner_blocks ): ?array {
		foreach ( $inner_blocks as $block ) {
			if ( ( $block['blockName'] ?? '' ) === $block_name ) {
				return is_array( $block['attrs'] ?? null ) ? $block['attrs'] : array();
			}
			if ( ! empty( $block['innerBlocks'] ) ) {
				$found = self::gatherpress_find_inner_block_attrs( $block_name, $block['innerBlocks'] );
				if ( null !== $found ) {
					return $found;
				}
			}
		}
		return null;
	}

	/**
	 * Injects calendar pagination arguments onto the parent core/query block.
	 *
	 * @param array<string, mixed> $parsed_block Parsed query block data.
	 *
	 * @return array<string, mixed> Updated block data.
	 */
	private function paginate_query_block( array $parsed_block ): array {
		$calendar_attrs = self::gatherpress_find_inner_block_attrs( 'gatherpress/calendar', $parsed_block['innerBlocks'] ?? array() );

		if ( null !== $calendar_attrs && is_array( $parsed_block['attrs'] ) && is_array( $parsed_block['attrs']['query'] ) ) {
			$parsed_block['attrs']['query'][ self::CALENDAR_QUERY_PARAM ] = true;

			$query_id = is_numeric( $parsed_block['attrs']['queryId'] ?? null ) ? (int) $parsed_block['attrs']['queryId'] : 0;
			$page_key = $query_id > 0 ? "query-{$query_id}-page" : 'query-page';
			$page     = ! empty( $_GET[ $page_key ] ) ? absint( $_GET[ $page_key ] ) : 1; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

			$range = Date_Calculator::calculate_date_range( $calendar_attrs, $page );

			$parsed_block['attrs']['query'][ self::CALENDAR_QUERY_VIEW_TYPE ]  = $range['view_type'];
			$parsed_block['attrs']['query'][ self::CALENDAR_QUERY_START_DATE ] = $range['start_date'];
			$parsed_block['attrs']['query'][ self::CALENDAR_QUERY_END_DATE ]   = $range['end_date'];
			$parsed_block['attrs']['query'][ self::CALENDAR_QUERY_HEADING ]    = $range['heading'];
		}

		return $parsed_block;
	}

	/**
	 * Injects paginated range attributes onto the child calendar block.
	 *
	 * @param array<string, mixed> $parsed_block Parsed calendar block data.
	 * @param WP_Block|null        $parent_block Parent block instance.
	 *
	 * @return array<string, mixed> Updated block data.
	 */
	private function paginate_calendar_block( array $parsed_block, ?WP_Block $parent_block ): array {
		$query = ( $parent_block instanceof WP_Block ) ? ( $parent_block->attributes['query'] ?? null ) : null;

		if ( is_array( $query ) && isset( $query[ self::CALENDAR_QUERY_START_DATE ] ) ) {
			$parsed_block['attrs']['selectedDate'] = $query[ self::CALENDAR_QUERY_START_DATE ];
			$parsed_block['attrs']['viewType']     = $query[ self::CALENDAR_QUERY_VIEW_TYPE ] ?? ( $parsed_block['attrs']['viewType'] ?? 'month' );
		}

		return $parsed_block;
	}

	/**
	 * Dynamically set date range and attributes based on core pagination query vars.
	 *
	 * @since 0.4.0
	 *
	 * @param array<string, mixed> $parsed_block The parsed block data.
	 * @param array<string, mixed> $source_block The original block data.
	 * @param WP_Block|null        $parent_block The parent block instance (if any).
	 *
	 * @return array<string, mixed> The updated parsed block data.
	 */
	public function allow_core_pagination( array $parsed_block, array $source_block, ?WP_Block $parent_block ): array {
		$block_name = $parsed_block['blockName'] ?? '';

		if ( 'core/query' === $block_name ) {
			return $this->paginate_query_block( $parsed_block );
		}

		if ( 'gatherpress/calendar' === $block_name ) {
			return $this->paginate_calendar_block( $parsed_block, $parent_block );
		}

		if ( in_array( $block_name, array( 'core/query-pagination-next', 'core/query-pagination-previous' ), true ) ) {
			add_filter( 'the_posts', array( $this, 'gatherpress_force_pagination_max_pages' ), 10, 2 );
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
	public function gatherpress_force_pagination_max_pages( array $posts, WP_Query $query ): array {
		if ( isset( $query->query[ self::CALENDAR_QUERY_PARAM ] ) ) {
			$query->max_num_pages = 200;
		}

		// Immediately remove the filter so it only affects this single block query.
		remove_filter( 'the_posts', array( $this, 'gatherpress_force_pagination_max_pages' ), 10 );

		return $posts;
	}

	/**
	 * Disable `core/query-pagination-numbers` rendering.
	 *
	 * @see https://developer.wordpress.org/reference/hooks/render_block_context/
	 *
	 * @since 0.4.0
	 *
	 * @param array<string, mixed> $context      Default context.
	 * @param array                $parsed_block {
	 *                    An associative array of the block being rendered. See WP_Block_Parser_Block.
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
	public function disable_query_pagination_numbers( array $context, array $parsed_block ): array {
		if ( ! isset( $context['query'] ) || ! is_array( $context['query'] ) || ! isset( $context['query'][ self::CALENDAR_QUERY_PARAM ] ) ) {
			return $context;
		}

		if ( 'core/query-pagination-numbers' === ( $parsed_block['blockName'] ?? '' ) ) {
			// This line alone makes the query-pagination-numbers silently disapear,
			// without interferencing with the other blocks.
			// Looks ugly, but works.
			$context['query']['perPage'] = 0;
		}

		return $context;
	}

	/**
	 * Register allowed calendar query vars.
	 *
	 * @param string[] $query_vars Allowed query variables.
	 *
	 * @return string[]
	 */
	public function query_vars( array $query_vars ): array {
		$query_vars[] = self::CALENDAR_QUERY_PARAM;
		$query_vars[] = self::CALENDAR_QUERY_VIEW_TYPE;
		$query_vars[] = self::CALENDAR_QUERY_START_DATE;
		$query_vars[] = self::CALENDAR_QUERY_END_DATE;
		return $query_vars;
	}

	/**
	 * Inject custom parameters into the Query Loop WP_Query args.
	 *
	 * @param array<string, mixed> $query WP_Query arguments.
	 * @param WP_Block             $block Block instance.
	 *
	 * @return array<string, mixed>
	 */
	public function query_loop_block_query_vars( array $query, WP_Block $block ): array {
		$block_query = $block->context['query'] ?? null;

		if ( ! is_array( $block_query ) || ! isset( $block_query[ self::CALENDAR_QUERY_PARAM ] ) ) {
			return $query;
		}

		$query_args = array(
			self::CALENDAR_QUERY_PARAM => $block_query[ self::CALENDAR_QUERY_PARAM ],
		);

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

	/**
	 * Day number binding value callback.
	 *
	 * @param array<string, mixed> $source_args    Source arguments.
	 * @param WP_Block             $block_instance Block instance.
	 * @param string               $attribute_name Attribute name.
	 *
	 * @return string|null
	 */
	public function get_day_number_binding_value( array $source_args, WP_Block $block_instance, string $attribute_name ): ?string {
		if ( 'content' !== $attribute_name ) {
			return null;
		}

		if ( ! empty( $block_instance->context['gatherpress/isEmpty'] ) ) {
			return '';
		}

		$day_number = $block_instance->context['gatherpress/dayNumber'] ?? null;

		return null !== $day_number ? (string) $day_number : null;
	}

	/**
	 * Calendar heading binding value callback. Supports month, week, and day views.
	 *
	 * Reads the same core Query pagination that `allow_core_pagination()`
	 * uses to paginate the `gatherpress/calendar` block, so a heading bound
	 * to this source (placed anywhere inside the same Query block) always
	 * shows the date-range currently displayed by the calendar.
	 *
	 * @param array<string, mixed> $source_args    Source arguments.
	 * @param WP_Block             $block_instance Block instance.
	 * @param string               $attribute_name Attribute name.
	 *
	 * @return string|null Localized heading string or null.
	 */
	public function get_heading_binding_value( array $source_args, WP_Block $block_instance, string $attribute_name ): ?string {
		if ( 'content' !== $attribute_name ) {
			return null;
		}

		$query = $block_instance->context['query'] ?? null;

		if ( is_array( $query ) ) {
			$range = Date_Calculator::get_range_from_query( $query );
			return $range['heading'];
		}

		$now          = current_datetime();
		$date_heading = wp_date( 'F Y', $now->getTimestamp() );

		return is_string( $date_heading ) ? $date_heading : null;
	}
}
