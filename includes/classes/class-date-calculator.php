<?php
/**
 * GatherPress Calendar Date Calculator
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

/**
 * Date_Calculator Class
 *
 * Handles all date-related calculations for the calendar including:
 * - Target month/year determination
 * - Day name localization
 * - Date formatting
 *
 * @since 0.1.0
 */
class Date_Calculator {

	/**
	 * The date format used throughout the calendar.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	const DATE_FORMAT = 'Y-m-d';

	/**
	 * Calculate target year and month from attributes.
	 *
	 * Logic:
	 * 1. If selectedMonth is set: use that specific month
	 * 2. Otherwise: use current month + monthModifier
	 *
	 * @since 0.1.0
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array{year: int, month: int} Target year and month.
	 */
	public static function calculate_target_date( array $attributes ): array {
		$selected_month = isset( $attributes['selectedMonth'] ) && is_string( $attributes['selectedMonth'] ) ? $attributes['selectedMonth'] : '';
		$month_modifier = isset( $attributes['monthModifier'] ) && is_numeric( $attributes['monthModifier'] ) ? (int) $attributes['monthModifier'] : 0;

		if ( ! empty( $selected_month ) && preg_match( '/^\d{4}-\d{2}$/', $selected_month ) ) {
			// Use selected month.
			$parts = explode( '-', $selected_month );
			if ( count( $parts ) === 2 ) {
				return array(
					'year'  => (int) $parts[0],
					'month' => (int) $parts[1],
				);
			}
		}

		// Use current month with modifier.
		$local_time = current_datetime();
		$now        = $local_time->getTimestamp() + $local_time->getOffset();
		if ( ! $now ) {
			$now = time();
		}

		if ( 0 !== $month_modifier ) {
			$target_timestamp = strtotime( sprintf( '%+d months', $month_modifier ), $now );
			if ( false !== $target_timestamp ) {
				return array(
					'year'  => (int) gmdate( 'Y', $target_timestamp ),
					'month' => (int) gmdate( 'n', $target_timestamp ),
				);
			}
		}

		return array(
			'year'  => (int) gmdate( 'Y', $now ),
			'month' => (int) gmdate( 'n', $now ),
		);
	}

	/**
	 * Retrieves the days of the week considered weekend days.
	 *
	 * This filter allows sites to adapt the calendar grid, classes, and weekend-hiding toggle
	 * to match local cultural and regional norms.
	 *
	 * @since 0.4.0
	 *
	 * @return int[] Array of day-of-week integers (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
	 */
	public static function get_weekend_days(): array {
		$default_weekends = array( 0, 6 ); // Sunday and Saturday.

		/**
		 * Filters which days of the week are considered weekend days.
		 *
		 * Defaults to Sunday (0) and Saturday (6).
		 *
		 * Across different cultures, religions, and regions, the weekend days vary significantly:
		 * - Western standard: Saturday (6) and Sunday (0).
		 * - Middle East & North Africa (e.g., Egypt, Saudi Arabia, Jordan): Friday (5) and Saturday (6).
		 * - Israel: Friday (5) and Saturday (6) (observing Shabbat).
		 * - Iran: Friday (5) as the sole official weekend day.
		 * - Nepal: Saturday (6) as the sole official weekend day.
		 *
		 * @since 0.4.0
		 *
		 * @param int[] $default_weekends Array of day numbers where 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
		 */
		$weekend_days = apply_filters( 'gatherpress_calendar_weekend_days', $default_weekends );

		return is_array( $weekend_days ) ? array_map( 'absint', $weekend_days ) : $default_weekends;
	}

	/**
	 * Checks whether a given day of the week is considered a weekend.
	 *
	 * @since 0.4.0
	 *
	 * @param int $day_of_week Day of week (0 = Sunday through 6 = Saturday).
	 *
	 * @return bool True if weekend, false otherwise.
	 */
	public static function is_weekend_day( int $day_of_week ): bool {
		return in_array( $day_of_week, self::get_weekend_days(), true );
	}

	/**
	 * Converts a day-of-week integer (0-6) into a lowercase English slug.
	 *
	 * @since 0.4.0
	 *
	 * @param int $day_of_week Day of week (0 = Sunday through 6 = Saturday).
	 *
	 * @return string Lowercase weekday slug (e.g. 'monday', 'saturday').
	 */
	public static function get_weekday_slug( int $day_of_week ): string {
		$slugs = array(
			0 => 'sunday',
			1 => 'monday',
			2 => 'tuesday',
			3 => 'wednesday',
			4 => 'thursday',
			5 => 'friday',
			6 => 'saturday',
		);

		return $slugs[ $day_of_week ] ?? '';
	}

	/**
	 * Get translated day names based on start_of_week setting and weekend visibility.
	 *
	 * @since 0.1.0
	 *
	 * @param int  $start_of_week Start of week (0=Sunday, 1=Monday, etc.).
	 * @param bool $show_weekends Whether to include weekend days.
	 *
	 * @return list<string> Array of translated day names.
	 */
	public static function get_day_names( int $start_of_week, bool $show_weekends = true ): array {
		$day_names = array();

		for ( $i = 0; $i < 7; $i++ ) {
			$day_of_week = ( $start_of_week + $i ) % 7;

			if ( ! $show_weekends && self::is_weekend_day( $day_of_week ) ) {
				continue;
			}

			$base_sunday = strtotime( '2024-01-07' );
			// @phpstan-ignore-next-line
			if ( false === $base_sunday ) {
				continue;
			}
			$day_timestamp = $base_sunday + ( $day_of_week * DAY_IN_SECONDS );
			$day_name      = wp_date( 'D', $day_timestamp );
			if ( is_string( $day_name ) ) {
				$day_names[] = $day_name;
			}
		}

		return $day_names;
	}

	/**
	 * Get today's date in standard format.
	 *
	 * @since 0.1.0
	 *
	 * @return string Today's date (Y-m-d format).
	 */
	public static function get_today(): string {
		$today = wp_date( self::DATE_FORMAT );
		return is_string( $today ) ? $today : '';
	}
}
