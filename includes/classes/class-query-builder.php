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
		$query_args['posts_per_page']                   = 99;

		// Inclusive date range prevents boundary clipping across weeks and multi-month periods.
		$query_args['date_query'] = array(
			array(
				'after'     => $date_range['start_date'] . ' 00:00:00',
				'before'    => $date_range['end_date'] . ' 23:59:59',
				'inclusive' => true,
			),
		);

		if ( 1 !== $page ) {
			unset( $query_args['offset'] );
		}

		unset( $query_args['include_unfinished'] );

		return $query_args;
	}
}
