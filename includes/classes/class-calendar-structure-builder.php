<?php
/**
 * GatherPress Calendar Structure Builder
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

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
	 * @param int                      $year          Target year.
	 * @param int                      $month         Target month.
	 * @param int                      $start_of_week Start of week setting.
	 * @param array<string, list<int>> $posts_by_date Posts organized by date.
	 * @param bool                     $show_weekends Whether to include weekend days.
	 *
	 * @return array{
	 *   month_name: string,
	 *   day_names: list<string>,
	 *   weeks: list<list<array<string, mixed>>>
	 * } Calendar structure.
	 */
	public static function build_structure( int $year, int $month, int $start_of_week, array $posts_by_date, bool $show_weekends = true ): array {
		$first_day = mktime( 0, 0, 0, $month, 1, $year );
		if ( false === $first_day ) {
			$first_day = time();
		}

		$days_in_month = (int) gmdate( 't', $first_day );
		$month_name    = wp_date( 'F Y', $first_day );
		if ( ! is_string( $month_name ) ) {
			$month_name = '';
		}

		return array(
			'month_name' => $month_name,
			'day_names'  => Date_Calculator::get_day_names( $start_of_week, $show_weekends ),
			'weeks'      => self::build_weeks( $year, $month, $start_of_week, $days_in_month, $posts_by_date, $show_weekends ),
		);
	}

	/**
	 * Build weeks array.
	 *
	 * @since 0.1.0
	 *
	 * @param int                      $year          Target year.
	 * @param int                      $month         Target month.
	 * @param int                      $start_of_week Start of week setting (0-6).
	 * @param int                      $days_in_month Number of days in month.
	 * @param array<string, list<int>> $posts_by_date Posts by date.
	 * @param bool                     $show_weekends Whether to include weekend days.
	 *
	 * @return list<list<array<string, mixed>>> Weeks array.
	 */
	private static function build_weeks( int $year, int $month, int $start_of_week, int $days_in_month, array $posts_by_date, bool $show_weekends = true ): array {
		$active_days_of_week = array();
		for ( $i = 0; $i < 7; $i++ ) {
			$dow = ( $start_of_week + $i ) % 7;
			if ( ! $show_weekends && Date_Calculator::is_weekend_day( $dow ) ) {
				continue;
			}
			$active_days_of_week[] = $dow;
		}

		$days_per_week    = count( $active_days_of_week );
		$weeks            = array();
		$current_week     = array();
		$first_day_placed = false;

		for ( $day = 1; $day <= $days_in_month; $day++ ) {
			$day_timestamp = mktime( 0, 0, 0, $month, $day, $year );
			$day_of_week   = (int) gmdate( 'w', false !== $day_timestamp ? $day_timestamp : time() );
			$is_weekend    = Date_Calculator::is_weekend_day( $day_of_week );
			$weekday_slug  = Date_Calculator::get_weekday_slug( $day_of_week );

			// Skip Saturdays and Sundays when weekends are hidden.
			if ( ! $show_weekends && $is_weekend ) {
				continue;
			}

			// Pre-pad leading empty days before the first visible day of the month.
			if ( ! $first_day_placed ) {
				$first_day_placed = true;
				$start_col        = array_search( $day_of_week, $active_days_of_week, true );
				$empty_days       = false !== $start_col ? (int) $start_col : 0;

				for ( $i = 0; $i < $empty_days; $i++ ) {
					$empty_dow      = $active_days_of_week[ $i ];
					$current_week[] = array(
						'isEmpty'   => true,
						'posts'     => array(),
						'dayOfWeek' => $empty_dow,
						'weekday'   => Date_Calculator::get_weekday_slug( $empty_dow ),
						'isWeekend' => Date_Calculator::is_weekend_day( $empty_dow ),
					);
				}
			}

			$date_str = sprintf( '%04d-%02d-%02d', $year, $month, $day );

			/** @var list<int> $day_posts */
			$day_posts = $posts_by_date[ $date_str ] ?? array();

			$current_week[] = array(
				'day'       => $day,
				'date'      => $date_str,
				'posts'     => $day_posts,
				'isEmpty'   => false,
				'dayOfWeek' => $day_of_week,
				'weekday'   => $weekday_slug,
				'isWeekend' => $is_weekend,
			);

			if ( count( $current_week ) === $days_per_week ) {
				$weeks[]      = $current_week;
				$current_week = array();
			}
		}

		// Trailing empty days after the end of the month.
		$week_count = count( $current_week );
		while ( $week_count > 0 && $week_count < $days_per_week ) {
			$trailing_dow   = $active_days_of_week[ $week_count ];
			$current_week[] = array(
				'isEmpty'   => true,
				'posts'     => array(),
				'dayOfWeek' => $trailing_dow,
				'weekday'   => Date_Calculator::get_weekday_slug( $trailing_dow ),
				'isWeekend' => Date_Calculator::is_weekend_day( $trailing_dow ),
			);
			++$week_count;
		}

		if ( count( $current_week ) > 0 ) {
			$weeks[] = $current_week;
		}

		return $weeks;
	}
}
