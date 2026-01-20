<?php
/**
 * GatherPress Calendar Query Builder
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress\Calendar;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.

if ( ! class_exists( '\GatherPress\Calendar\Query_Builder' ) ) {
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
		 * Build query arguments from block context.
		 *
		 * @since 0.1.0
		 *
		 * @param \WP_Block $block Block instance.
		 * @param int       $year  Target year.
		 * @param int       $month Target month.
		 *
		 * @return array<string, mixed> WP_Query arguments.
		 */
		public static function build_query_args( \WP_Block $block, int $year, int $month ): array {
			$query_id   = isset( $block->context['queryId'] ) && is_int( $block->context['queryId'] ) ? $block->context['queryId'] : 0;
			$page_param = 'query-' . $query_id . '-page';
			$page       = isset( $_GET[ $page_param ] ) && is_numeric( $_GET[ $page_param ] ) ? max( 1, (int) $_GET[ $page_param ] ) : 1; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

			/**
			 * Type safety.
			 *
			 * @var array<string, mixed> $query_args
			 */
			$query_args = build_query_vars_from_query_block( $block, $page );

			// Add calendar query marker and date filtering.
			$query_args['gatherpress_calendar_query'] = true;
			$query_args['date_query']                 = array(
				array(
					'year'  => $year,
					'month' => $month,
				),
			);
			$query_args['posts_per_page']             = 99;

			// Remove conflicting parameters.
			unset( $query_args['paged'] );
			unset( $query_args['orderby'] );
			unset( $query_args['gatherpress_event_query'] );
			unset( $query_args['include_unfinished'] );

			return $query_args;
		}
	}
}
