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
	 * Retrieves the maximum number of posts to query for calendar display.
	 *
	 * This filter allows sites to adapt the number of posts fetched
	 * for calendar rendering to match their specific performance and event volume needs.
	 *
	 * @since 0.8.0
	 *
	 * @return int Number of posts to query.
	 */
	public static function get_posts_per_page(): int {
		$default_posts_per_page = 500;

		/**
		 * Filters the maximum number of posts queried for calendar display.
		 *
		 * Defaults to 500.
		 *
		 * @since 0.8.0
		 *
		 * @param int $default_posts_per_page Default number of posts to query.
		 */
		$posts_per_page = apply_filters( 'gatherpress_calendar_posts_per_page', $default_posts_per_page );

		return is_numeric( $posts_per_page ) ? max( 1, (int) $posts_per_page ) : $default_posts_per_page;
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
		$query_id   = isset( $block->context['queryId'] ) && is_int( $block->context['queryId'] ) ? $block->context['queryId'] : 0;
		$page_param = 'query-' . $query_id . '-page';
		$page       = isset( $_GET[ $page_param ] ) && is_numeric( $_GET[ $page_param ] ) ? max( 1, (int) $_GET[ $page_param ] ) : 1; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

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
		$query_args['posts_per_page']                   = self::get_posts_per_page();

		$post_type = $query_args['post_type'] ?? 'post';
		$is_event  = ( is_string( $post_type ) && post_type_supports( $post_type, 'gatherpress-event-date' ) )
			|| ( is_array( $post_type ) && in_array( 'gatherpress_event', $post_type, true ) );

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
