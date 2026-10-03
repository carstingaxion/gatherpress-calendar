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

use DateTimeImmutable;

/**
 * Calendar_Structure_Builder Class
 *
 * Generates the calendar grid structure for month, week, or day view.
 */
class Calendar_Structure_Builder {

	/**
	 * Build complete calendar structure.
	 *
	 * @param array{ view_type: string, unit_count: int, start_date: string, end_date: string, start_date_obj: DateTimeImmutable, end_date_obj: DateTimeImmutable, raw_week_start: DateTimeImmutable, target_date: DateTimeImmutable, year: int, month: int, heading: string } $date_range    Date range array.
	 * @param int                                                                                                                                                                                                                                                              $start_of_week Start of week setting (0-6).
	 * @param array<string, list<int>>                                                                                                                                                                                                                                         $posts_by_date Posts organized by date.
	 * @param bool                                                                                                                                                                                                                                                             $show_weekends Whether to include weekend days.
	 *
	 * @return array{
	 *   heading: string,
	 *   day_names: list<string>,
	 *   weeks: list<list<array<string, mixed>>>,
	 *   view_type: string,
	 *   unit_count: int,
	 *   units: list<array{
	 *     caption: string,
	 *     day_names: list<string>,
	 *     weeks: list<list<array<string, mixed>>>
	 *   }>
	 * }
	 */
	public static function build_structure( array $date_range, int $start_of_week, array $posts_by_date, bool $show_weekends = true ): array {
		$view_type  = $date_range['view_type'];
		$unit_count = max( 1, $date_range['unit_count'] );
		$units      = array();

		if ( 'day' === $view_type ) {
			$weeks     = self::build_consecutive_days( $date_range['start_date_obj'], $unit_count, $posts_by_date );
			$day_names = Date_Calculator::get_view_day_names( $view_type, $date_range['start_date_obj'], $start_of_week, $show_weekends, $unit_count );
			$units[]   = array(
				'caption'   => $date_range['heading'],
				'day_names' => $day_names,
				'weeks'     => $weeks,
			);
		} elseif ( 'week' === $view_type ) {
			$weeks     = self::build_consecutive_weeks( $date_range['raw_week_start'], $unit_count, $posts_by_date, $show_weekends );
			$day_names = Date_Calculator::get_day_names( $start_of_week, $show_weekends );
			$units[]   = array(
				'caption'   => $date_range['heading'],
				'day_names' => $day_names,
				'weeks'     => $weeks,
			);
		} else {
			// Month view: construct unit_count separate month grids.
			for ( $i = 0; $i < $unit_count; $i++ ) {
				$month_date    = $date_range['start_date_obj']->modify( "+{$i} months" );
				$m_year        = (int) $month_date->format( 'Y' );
				$m_month       = (int) $month_date->format( 'n' );
				$days_in_month = (int) $month_date->format( 't' );
				$m_weeks       = self::build_month_weeks( $m_year, $m_month, $start_of_week, $days_in_month, $posts_by_date, $show_weekends );
				$m_day_names   = Date_Calculator::get_day_names( $start_of_week, $show_weekends );

				// Each month grid gets its own name, like "October 2026".
				$units[] = array(
					'caption'   => Date_Calculator::format_heading( 'month', $month_date, $month_date ),
					'day_names' => $m_day_names,
					'weeks'     => $m_weeks,
				);
			}

			$weeks     = $units[0]['weeks'];
			$day_names = $units[0]['day_names'];
		}

		return array(
			'heading'    => $date_range['heading'],
			'day_names'  => $day_names,
			'weeks'      => $weeks,
			'view_type'  => $view_type,
			'unit_count' => $unit_count,
			'units'      => $units,
		);
	}

	/**
	 * Factory to create an active day entry.
	 *
	 * @param int    $day         Day of month.
	 * @param string $date_str    YYYY-MM-DD date string.
	 * @param int    $day_of_week Day of week (0-6).
	 * @param int[]  $posts       Associated post IDs.
	 *
	 * @return array<string, mixed> Day entry.
	 */
	private static function create_day_entry( int $day, string $date_str, int $day_of_week, array $posts = array() ): array {
		return array(
			'day'       => $day,
			'date'      => $date_str,
			'posts'     => $posts,
			'isEmpty'   => false,
			'dayOfWeek' => $day_of_week,
			'weekday'   => Date_Calculator::get_weekday_slug( $day_of_week ),
			'isWeekend' => Date_Calculator::is_weekend_day( $day_of_week ),
		);
	}

	/**
	 * Factory to create an empty padded day entry.
	 *
	 * @param int $day_of_week Day of week (0-6).
	 *
	 * @return array<string, mixed> Empty day entry.
	 */
	private static function create_empty_day_entry( int $day_of_week ): array {
		return array(
			'isEmpty'   => true,
			'posts'     => array(),
			'dayOfWeek' => $day_of_week,
			'weekday'   => Date_Calculator::get_weekday_slug( $day_of_week ),
			'isWeekend' => Date_Calculator::is_weekend_day( $day_of_week ),
		);
	}

	/**
	 * Resolves active days of week based on start of week and weekend toggle.
	 *
	 * @param int  $start_of_week Start of week (0-6).
	 * @param bool $show_weekends Weekend visibility.
	 *
	 * @return list<int> Active day-of-week indices.
	 */
	private static function get_active_week_columns( int $start_of_week, bool $show_weekends ): array {
		$columns = array();
		for ( $i = 0; $i < 7; $i++ ) {
			$dow = ( $start_of_week + $i ) % 7;
			if ( ! $show_weekends && Date_Calculator::is_weekend_day( $dow ) ) {
				continue;
			}
			$columns[] = $dow;
		}
		return $columns;
	}

	/**
	 * Generates leading empty padding days before the first day of the month.
	 *
	 * @param int   $first_day_dow First day of month day-of-week.
	 * @param int[] $columns       Ordered active columns.
	 *
	 * @return list<array<string, mixed>>
	 */
	private static function pad_leading_empty_days( int $first_day_dow, array $columns ): array {
		$start_col  = array_search( $first_day_dow, $columns, true );
		$empty_days = false !== $start_col ? (int) $start_col : 0;
		$padding    = array();

		for ( $i = 0; $i < $empty_days; $i++ ) {
			$padding[] = self::create_empty_day_entry( $columns[ $i ] );
		}

		return $padding;
	}

	/**
	 * Build weeks array for a full month (with leading/trailing empty cells).
	 *
	 * @param int                      $year          Target year.
	 * @param int                      $month         Target month.
	 * @param int                      $start_of_week Start of week setting (0-6).
	 * @param int                      $days_in_month Number of days in month.
	 * @param array<string, list<int>> $posts_by_date Posts by date.
	 * @param bool                     $show_weekends Whether to include weekend days.
	 *
	 * @return list<list<array<string, mixed>>>
	 */
	private static function build_month_weeks( int $year, int $month, int $start_of_week, int $days_in_month, array $posts_by_date, bool $show_weekends = true ): array {
		$columns          = self::get_active_week_columns( $start_of_week, $show_weekends );
		$days_per_week    = count( $columns );
		$weeks            = array();
		$current_week     = array();
		$first_day_placed = false;

		for ( $day = 1; $day <= $days_in_month; $day++ ) {
			$day_timestamp = mktime( 0, 0, 0, $month, $day, $year );
			$day_of_week   = (int) gmdate( 'w', false !== $day_timestamp ? $day_timestamp : time() );

			if ( ! $show_weekends && Date_Calculator::is_weekend_day( $day_of_week ) ) {
				continue;
			}

			if ( ! $first_day_placed ) {
				$first_day_placed = true;
				$current_week     = self::pad_leading_empty_days( $day_of_week, $columns );
			}

			$date_str       = sprintf( '%04d-%02d-%02d', $year, $month, $day );
			$day_posts      = $posts_by_date[ $date_str ] ?? array();
			$current_week[] = self::create_day_entry( $day, $date_str, $day_of_week, $day_posts );

			if ( count( $current_week ) === $days_per_week ) {
				$weeks[]      = $current_week;
				$current_week = array();
			}
		}

		$week_count = count( $current_week );
		while ( $week_count > 0 && $week_count < $days_per_week ) {
			$current_week[] = self::create_empty_day_entry( $columns[ $week_count ] );
			++$week_count;
		}

		if ( count( $current_week ) > 0 ) {
			$weeks[] = $current_week;
		}

		return $weeks;
	}

	/**
	 * Build weeks array for a single week view (continuous days, no isEmpty padding).
	 *
	 * @param DateTimeImmutable        $week_start    Start of the week.
	 * @param int                      $unit_count    Number of units to show.
	 * @param array<string, list<int>> $posts_by_date Posts by date.
	 * @param bool                     $show_weekends Whether to include weekend days.
	 *
	 * @return list<list<array<string, mixed>>>
	 */
	private static function build_consecutive_weeks( DateTimeImmutable $week_start, int $unit_count, array $posts_by_date, bool $show_weekends = true ): array {
		$weeks = array();

		for ( $w = 0; $w < $unit_count; $w++ ) {
			$current_week_start = $week_start->modify( sprintf( '+%d weeks', $w ) );
			$week_days          = array();

			for ( $i = 0; $i < 7; $i++ ) {
				$day_obj     = $current_week_start->modify( "+{$i} days" );
				$day_of_week = (int) $day_obj->format( 'w' );

				if ( ! $show_weekends && Date_Calculator::is_weekend_day( $day_of_week ) ) {
					continue;
				}

				$date_str    = $day_obj->format( 'Y-m-d' );
				$week_days[] = self::create_day_entry(
					(int) $day_obj->format( 'j' ),
					$date_str,
					$day_of_week,
					$posts_by_date[ $date_str ] ?? array()
				);
			}

			$weeks[] = $week_days;
		}

		return $weeks;
	}

	/**
	 * Build single day view.
	 *
	 * @param DateTimeImmutable        $start_day_obj Target day.
	 * @param int                      $unit_count    Number of units to show.
	 * @param array<string, list<int>> $posts_by_date Posts by date.
	 *
	 * @return list<list<array<string, mixed>>>
	 */
	private static function build_consecutive_days( DateTimeImmutable $start_day_obj, int $unit_count, array $posts_by_date ): array {
		$days = array();

		for ( $i = 0; $i < $unit_count; $i++ ) {
			$day_obj  = $start_day_obj->modify( "+{$i} days" );
			$date_str = $day_obj->format( 'Y-m-d' );
			$days[]   = self::create_day_entry(
				(int) $day_obj->format( 'j' ),
				$date_str,
				(int) $day_obj->format( 'w' ),
				$posts_by_date[ $date_str ] ?? array()
			);
		}

		return array( $days );
	}
}
