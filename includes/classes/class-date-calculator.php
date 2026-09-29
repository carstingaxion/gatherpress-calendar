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

use DateTimeImmutable;

/**
 * Date_Calculator Class
 *
 * Handles date-related calculations for month, week, and day calendar views.
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
	 * Calculate the target date range for the calendar based on viewType, selectedDate, dateModifier, and weekend visibility.
	 *
	 * @since 0.5.0
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param int                  $page       Pagination page offset (1-based, default 1).
	 *
	 * @return array{
	 *     view_type: string,
	 *     start_date: string,
	 *     end_date: string,
	 *     start_date_obj: DateTimeImmutable,
	 *     end_date_obj: DateTimeImmutable,
	 *     raw_week_start: DateTimeImmutable,
	 *     target_date: DateTimeImmutable,
	 *     year: int,
	 *     month: int,
	 *     heading: string
	 * }
	 */
	public static function calculate_date_range( array $attributes, int $page = 1 ): array {
		$view_type = isset( $attributes['viewType'] ) && is_string( $attributes['viewType'] ) && in_array( $attributes['viewType'], array( 'month', 'week', 'day' ), true )
			? $attributes['viewType']
			: 'month';

		$selected_date = ! empty( $attributes['selectedDate'] ) && is_string( $attributes['selectedDate'] ) ? $attributes['selectedDate'] : '';
		$date_modifier = isset( $attributes['dateModifier'] ) && is_numeric( $attributes['dateModifier'] ) ? (int) $attributes['dateModifier'] : 0;
		$show_weekends = ! isset( $attributes['showWeekends'] ) || ( false !== $attributes['showWeekends'] && 'false' !== $attributes['showWeekends'] );

		$tz        = wp_timezone();
		$base_date = null;

		if ( ! empty( $selected_date ) ) {
			if ( preg_match( '/^\d{4}-\d{2}-\d{2}$/', $selected_date ) ) {
				$base_date = DateTimeImmutable::createFromFormat( '!Y-m-d', $selected_date, $tz );
			} elseif ( preg_match( '/^\d{4}-\d{2}$/', $selected_date ) ) {
				$base_date = DateTimeImmutable::createFromFormat( '!Y-m-d', $selected_date . '-01', $tz );
			}
		}

		if ( ! $base_date instanceof DateTimeImmutable ) {
			$base_date = current_datetime();
		}

		// Normalize base date to the 1st of the month in month view to prevent overflow (e.g. Jan 31 + 1 month).
		if ( 'month' === $view_type ) {
			$base_date = $base_date->modify( 'first day of this month' );
		}

		// Combine user-defined dateModifier with query pagination offset.
		$offset = $date_modifier + max( 0, $page - 1 );

		if ( 0 !== $offset ) {
			$step_unit = 'month';
			if ( 'week' === $view_type ) {
				$step_unit = 'week';
			} elseif ( 'day' === $view_type ) {
				$step_unit = 'day';
			}

			$base_date = $base_date->modify( sprintf( '%+d %s', $offset, $step_unit ) );
		}

		$start_of_week  = (int) get_option( 'start_of_week', 0 );
		$raw_week_start = null;

		if ( 'week' === $view_type ) {
			$raw_week_start = self::get_week_start( $base_date, $start_of_week );
			$visible_days   = array();

			for ( $i = 0; $i < 7; $i++ ) {
				$day_obj    = $raw_week_start->modify( "+{$i} days" );
				$dow        = (int) $day_obj->format( 'w' );
				$is_weekend = self::is_weekend_day( $dow );

				if ( $show_weekends || ! $is_weekend ) {
					$visible_days[] = $day_obj;
				}
			}

			if ( ! empty( $visible_days ) ) {
				$start_date_obj = $visible_days[0]->setTime( 0, 0, 0 );
				$end_date_obj   = $visible_days[ count( $visible_days ) - 1 ]->setTime( 23, 59, 59 );
			} else {
				$start_date_obj = $raw_week_start->setTime( 0, 0, 0 );
				$end_date_obj   = $raw_week_start->modify( '+6 days' )->setTime( 23, 59, 59 );
			}
		} elseif ( 'day' === $view_type ) {
			$start_date_obj = $base_date->setTime( 0, 0, 0 );
			$end_date_obj   = $base_date->setTime( 23, 59, 59 );
		} else {
			// Month view.
			$start_date_obj = $base_date->modify( 'first day of this month' )->setTime( 0, 0, 0 );
			$end_date_obj   = $base_date->modify( 'last day of this month' )->setTime( 23, 59, 59 );
		}

		$heading = self::format_heading( $view_type, $start_date_obj, $end_date_obj );

		return array(
			'view_type'      => $view_type,
			'start_date'     => $start_date_obj->format( 'Y-m-d' ),
			'end_date'       => $end_date_obj->format( 'Y-m-d' ),
			'start_date_obj' => $start_date_obj,
			'end_date_obj'   => $end_date_obj,
			'raw_week_start' => $raw_week_start ?? $start_date_obj,
			'target_date'    => $base_date,
			'year'           => (int) $base_date->format( 'Y' ),
			'month'          => (int) $base_date->format( 'n' ),
			'heading'        => $heading,
		);
	}

	/**
	 * Get start of the week for a given date and start_of_week setting.
	 *
	 * @since 0.5.0
	 *
	 * @param DateTimeImmutable $date          Given date.
	 * @param int               $start_of_week Start of week (0 = Sunday, 1 = Monday, etc.).
	 *
	 * @return DateTimeImmutable Start of the week date at 00:00:00.
	 */
	public static function get_week_start( DateTimeImmutable $date, int $start_of_week ): DateTimeImmutable {
		$dow  = (int) $date->format( 'w' ); // 0 = Sunday, 6 = Saturday.
		$diff = ( $dow - $start_of_week + 7 ) % 7;

		return $date->modify( "-{$diff} days" )->setTime( 0, 0, 0 );
	}

	/**
	 * Format calendar heading based on view type and date range.
	 *
	 * @since 0.5.0
	 *
	 * @param string            $view_type  View type ('month', 'week', 'day').
	 * @param DateTimeImmutable $start_date Start date.
	 * @param DateTimeImmutable $end_date   End date.
	 *
	 * @return string Formatted heading.
	 */
	public static function format_heading( string $view_type, DateTimeImmutable $start_date, DateTimeImmutable $end_date ): string {
		if ( 'day' === $view_type ) {
			$day_heading = wp_date( 'l, F j, Y', $start_date->getTimestamp() );
			return is_string( $day_heading ) ? $day_heading : '';
		}

		if ( 'week' === $view_type ) {
			if ( $start_date->format( 'Y' ) !== $end_date->format( 'Y' ) ) {
				return sprintf(
					'%s – %s',
					wp_date( 'M j, Y', $start_date->getTimestamp() ),
					wp_date( 'M j, Y', $end_date->getTimestamp() )
				);
			}

			if ( $start_date->format( 'n' ) !== $end_date->format( 'n' ) ) {
				return sprintf(
					'%s – %s',
					wp_date( 'M j', $start_date->getTimestamp() ),
					wp_date( 'M j, Y', $end_date->getTimestamp() )
				);
			}

			return sprintf(
				'%s %s – %s',
				wp_date( 'M', $start_date->getTimestamp() ),
				wp_date( 'j', $start_date->getTimestamp() ),
				wp_date( 'j, Y', $end_date->getTimestamp() )
			);
		}

		$month_heading = wp_date( 'F Y', $start_date->getTimestamp() );
		return is_string( $month_heading ) ? $month_heading : '';
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
