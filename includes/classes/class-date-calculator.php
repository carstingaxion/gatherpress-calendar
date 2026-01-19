<?php
/**
 * GatherPress Calendar Date Calculator
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress\Calendar;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.


if ( ! class_exists( '\GatherPress\Calendar\Date_Calculator' ) ) {
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
			$now = current_time( 'timestamp' );
			if ( ! is_int( $now ) ) {
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
		 * Get translated day names based on start_of_week setting.
		 *
		 * @since 0.1.0
		 *
		 * @param int $start_of_week Start of week (0=Sunday, 1=Monday, etc.).
		 *
		 * @return list<string> Array of translated day names.
		 */
		public static function get_day_names( int $start_of_week ): array {
			$day_names = array();

			for ( $i = 0; $i < 7; $i++ ) {
				$day_of_week = ( $start_of_week + $i ) % 7;
				$base_sunday = strtotime( '2024-01-07' );
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
}
