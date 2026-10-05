<?php
/**
 * GatherPress Calendar Query Builder
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use DateTimeImmutable;
use GatherPress\Core\Event;
use WP_Block;

/**
 * Query_Builder Class
 *
 * Constructs WP_Query arguments from Query Loop context.
 * Adds date filtering and calendar-specific parameters.
 *
 * @since 0.1.0
 */
class Query_Builder {

	/**
	 * Highest page number a calendar accepts from the URL.
	 *
	 * Date_Calculator multiplies the page by unitCount. A very large page
	 * overflows that integer and causes a fatal TypeError.
	 *
	 * @since 0.8.0
	 */
	const MAX_PAGE = 10000;

	/**
	 * Get the requested page number of a core/query block.
	 *
	 * Reads the same URL parameter, and casts it the same way, as core's Query
	 * Pagination blocks: `query-{$query_id}-page` when the Query block has a
	 * queryId (0 included), and `query-page` when it has none.
	 *
	 * @since 0.8.0
	 *
	 * @param mixed $query_id The Query block's queryId, or null when it has none.
	 *
	 * @return int Page number, from 1 to MAX_PAGE.
	 */
	public static function get_requested_page( $query_id ): int {
		$page_key = is_numeric( $query_id ) ? 'query-' . (int) $query_id . '-page' : 'query-page';

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! isset( $_GET[ $page_key ] ) || ! is_scalar( $_GET[ $page_key ] ) ) {
			return 1;
		}

		$page = (int) $_GET[ $page_key ]; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		return min( self::MAX_PAGE, max( 1, $page ) );
	}

	/**
	 * Build query arguments from block context and resolved date range.
	 *
	 * @since 0.1.0
	 *
	 * @param WP_Block                                                                                                                                                                                                                                        $block      Block instance.
	 * @param array{ view_type: string, start_date: string, end_date: string, start_date_obj: DateTimeImmutable, end_date_obj: DateTimeImmutable, raw_week_start: DateTimeImmutable, target_date: DateTimeImmutable, year: int, month: int, heading: string } $date_range Resolved date range array.
	 *
	 * @return array<string, mixed> WP_Query arguments.
	 */
	public static function build_query_args( WP_Block $block, array $date_range ): array {
		$page = self::get_requested_page( $block->context['queryId'] ?? null );

		/**
		 * Type safety.
		 *
		 * @var array<string, mixed> $query_args
		 */
		$query_args = build_query_vars_from_query_block( $block, $page );

		// Set calendar query markers and range parameters.
		$query_args[ Event\Query::EVENT_QUERY_PARAM ]   = 'all';
		$query_args[ Setup::CALENDAR_QUERY_PARAM ]      = true;
		$query_args[ Setup::CALENDAR_QUERY_VIEW_TYPE ]  = $date_range['view_type'];
		$query_args[ Setup::CALENDAR_QUERY_START_DATE ] = $date_range['start_date'];
		$query_args[ Setup::CALENDAR_QUERY_END_DATE ]   = $date_range['end_date'];
		$query_args['posts_per_page']                   = 99;

		$post_type = $query_args['post_type'] ?? 'post';
		$is_event  = 'gatherpress_event' === $post_type || ( is_array( $post_type ) && in_array( 'gatherpress_event', $post_type, true ) );

		// Inclusive date range prevents boundary clipping across weeks and multi-month periods.
		$date_clause = array(
			'after'     => $date_range['start_date'] . ' 00:00:00',
			'before'    => $date_range['end_date'] . ' 23:59:59',
			'inclusive' => true,
		);

		if ( $is_event ) {
			$date_clause['column'] = 'datetime_start';
		}

		// Inclusive date range prevents boundary clipping across weeks and multi-month periods.
		$query_args['date_query'] = array( $date_clause );

		if ( 1 !== $page ) {
			unset( $query_args['offset'] );
		}

		unset( $query_args['include_unfinished'] );

		return $query_args;
	}
}
