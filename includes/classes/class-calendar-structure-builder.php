<?php
/**
 * GatherPress Calendar Structure Builder
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress\Calendar;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.


if ( ! class_exists( '\GatherPress\Calendar\Calendar_Structure_Builder' ) ) {
	/**
	 * Calendar_Structure_Builder Class
	 *
	 * Generates the calendar grid structure with weeks and days.
	 *
	 * @since 0.1.0
	 */
	class Calendar_Structure_Builder {

		/**
		 * Build complete calendar structure.
		 *
		 * @since 0.1.0
		 *
		 * @param int                      $year           Target year.
		 * @param int                      $month          Target month.
		 * @param int                      $start_of_week  Start of week setting.
		 * @param array<string, list<int>> $posts_by_date  Posts organized by date.
		 *
		 * @return array{
		 *   month_name: string,
		 *   day_names: list<string>,
		 *   weeks: list<list<array<string, mixed>>>
		 * } Calendar structure.
		 */
		public static function build_structure( int $year, int $month, int $start_of_week, array $posts_by_date ): array {
			$first_day = mktime( 0, 0, 0, $month, 1, $year );
			if ( false === $first_day ) {
				$first_day = time();
			}

			$days_in_month  = (int) gmdate( 't', $first_day );
			$start_day_week = (int) gmdate( 'w', $first_day );
			$month_name     = wp_date( 'F Y', $first_day );
			if ( ! is_string( $month_name ) ) {
				$month_name = '';
			}

			$start_day_week = ( $start_day_week - $start_of_week + 7 ) % 7;

			return array(
				'month_name' => $month_name,
				'day_names'  => Date_Calculator::get_day_names( $start_of_week ),
				'weeks'      => self::build_weeks( $year, $month, $start_day_week, $days_in_month, $posts_by_date ),
			);
		}

		/**
		 * Build weeks array.
		 *
		 * @since 0.1.0
		 *
		 * @param int                      $year           Target year.
		 * @param int                      $month          Target month.
		 * @param int                      $start_day_week Empty days before month.
		 * @param int                      $days_in_month  Number of days in month.
		 * @param array<string, list<int>> $posts_by_date  Posts by date.
		 *
		 * @return list<list<array<string, mixed>>> Weeks array.
		 */
		private static function build_weeks( int $year, int $month, int $start_day_week, int $days_in_month, array $posts_by_date ): array {
			$weeks        = array();
			$current_week = array();

			// Empty days before month.
			for ( $i = 0; $i < $start_day_week; $i++ ) {
				$current_week[] = array(
					'isEmpty' => true,
					'posts'   => array(),
				);
			}

			// Days with posts.
			for ( $day = 1; $day <= $days_in_month; $day++ ) {
				$date_str = sprintf( '%04d-%02d-%02d', $year, $month, $day );
				/** @var list<int> $day_posts */
				$day_posts = $posts_by_date[ $date_str ] ?? array();

				$current_week[] = array(
					'day'     => $day,
					'date'    => $date_str,
					'posts'   => $day_posts,
					'isEmpty' => false,
				);

				if ( 7 === count( $current_week ) ) {
					$weeks[]      = $current_week;
					$current_week = array();
				}
			}

			// Empty days after month.
			while ( count( $current_week ) > 0 && count( $current_week ) < 7 ) {
				$current_week[] = array(
					'isEmpty' => true,
					'posts'   => array(),
				);
			}

			if ( count( $current_week ) > 0 ) {
				$weeks[] = $current_week;
			}

			return $weeks;
		}
	}
}
