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
use DateTimeZone;

/**
 * Date_Calculator Class
 *
 * Single Source of Truth for calendar date ranges, week calculations,
 * localized headings, and column layouts.
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
	 * Resolves the baseline target date applying date modifiers.
	 *
	 * @param string $selected_date Selected date string.
	 * @param string $view_type     View type.
	 * @param int    $offset        Offset count.
	 *
	 * @return DateTimeImmutable
	 */
	private static function resolve_base_date( string $selected_date, string $view_type, int $offset ): DateTimeImmutable {
		$tz        = wp_timezone();
		$base_date = null;

		if ( '' !== $selected_date ) {
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

		if ( 0 !== $offset ) {
			$step_unit = 'month';
			if ( 'week' === $view_type ) {
				$step_unit = 'week';
			} elseif ( 'day' === $view_type ) {
				$step_unit = 'day';
			}
			$base_date = $base_date->modify( sprintf( '%+d %s', $offset, $step_unit ) );
		}

		return $base_date;
	}

	/**
	 * Computes visible week bounds for 1 or more consecutive weeks.
	 *
	 * @param DateTimeImmutable $base_date     Target base date.
	 * @param int               $start_of_week Start of week setting (0-6).
	 * @param bool              $show_weekends Weekend visibility.
	 * @param int               $unit_count    Number of weeks.
	 *
	 * @return array{0: DateTimeImmutable, 1: DateTimeImmutable, 2: DateTimeImmutable} [start, end, raw_start].
	 */
	private static function calculate_week_bounds( DateTimeImmutable $base_date, int $start_of_week, bool $show_weekends, int $unit_count ): array {
		$raw_week_start = self::get_week_start( $base_date, $start_of_week );
		$total_days     = $unit_count * 7;
		$visible_days   = array();

		for ( $i = 0; $i < $total_days; $i++ ) {
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
			$end_date_obj   = $raw_week_start->modify( sprintf( '+%d days', $total_days - 1 ) )->setTime( 23, 59, 59 );
		}

		return array( $start_date_obj, $end_date_obj, $raw_week_start );
	}

	/**
	 * Computes the start date, end date, and raw week start for a given view type.
	 *
	 * @param string            $view_type     View type ('month', 'week', 'day').
	 * @param DateTimeImmutable $base_date     Baseline target date.
	 * @param int               $unit_count    Number of units.
	 * @param int               $start_of_week Start of week (0-6).
	 * @param bool              $show_weekends Whether weekends are visible.
	 *
	 * @return array{0: DateTimeImmutable, 1: DateTimeImmutable, 2: DateTimeImmutable} [start, end, raw_start].
	 */
	private static function calculate_view_bounds( string $view_type, DateTimeImmutable $base_date, int $unit_count, int $start_of_week, bool $show_weekends ): array {
		if ( 'week' === $view_type ) {
			return self::calculate_week_bounds( $base_date, $start_of_week, $show_weekends, $unit_count );
		}

		if ( 'day' === $view_type ) {
			$start = $base_date->setTime( 0, 0, 0 );
			$end   = $base_date->modify( sprintf( '+%d days', $unit_count - 1 ) )->setTime( 23, 59, 59 );
			return array( $start, $end, $start );
		}

		// Month view: spans from Month 1's first day to Month N's last day.
		$start = $base_date->modify( 'first day of this month' )->setTime( 0, 0, 0 );
		$end   = $base_date->modify( sprintf( '+%d months', $unit_count - 1 ) )->modify( 'last day of this month' )->setTime( 23, 59, 59 );

		return array( $start, $end, $start );
	}

	/**
	 * Builds a standardized date range result array.
	 *
	 * @param string            $view_type      View type ('month', 'week', 'day').
	 * @param int               $unit_count     Number of units.
	 * @param DateTimeImmutable $start_date_obj Start date object.
	 * @param DateTimeImmutable $end_date_obj   End date object.
	 * @param DateTimeImmutable $raw_week_start Raw week start date object.
	 * @param DateTimeImmutable $target_date    Baseline target date object.
	 * @param string|null       $heading        Optional formatted heading override.
	 *
	 * @return array{
	 *     view_type: string,
	 *     unit_count: int,
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
	private static function build_range_payload(
		string $view_type,
		int $unit_count,
		DateTimeImmutable $start_date_obj,
		DateTimeImmutable $end_date_obj,
		DateTimeImmutable $raw_week_start,
		DateTimeImmutable $target_date,
		?string $heading = null
	): array {
		return array(
			'view_type'      => $view_type,
			'unit_count'     => $unit_count,
			'start_date'     => $start_date_obj->format( self::DATE_FORMAT ),
			'end_date'       => $end_date_obj->format( self::DATE_FORMAT ),
			'start_date_obj' => $start_date_obj,
			'end_date_obj'   => $end_date_obj,
			'raw_week_start' => $raw_week_start,
			'target_date'    => $target_date,
			'year'           => (int) $target_date->format( 'Y' ),
			'month'          => (int) $target_date->format( 'n' ),
			'heading'        => $heading ?? self::format_heading( $view_type, $start_date_obj, $end_date_obj ),
		);
	}

	/**
	 * Resolves and validates the view type from attributes.
	 *
	 * @param array<string, mixed> $attributes Attributes array.
	 * @param string               $fallback   Default view type.
	 *
	 * @return string Validated view type ('month', 'week', 'day').
	 */
	public static function resolve_view_type( array $attributes, string $fallback = 'month' ): string {
		$view_type = $attributes['viewType'] ?? $fallback;
		if ( is_string( $view_type ) && in_array( $view_type, array( 'month', 'week', 'day' ), true ) ) {
			return $view_type;
		}

		return 'month';
	}

	/**
	 * Resolves clamped unit count for a given view type and attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $view_type  View type.
	 *
	 * @return int Clamped unit count.
	 */
	public static function resolve_unit_count( array $attributes, string $view_type ): int {
		$max_units  = self::get_max_unit_count( $view_type );
		$unit_count = isset( $attributes['unitCount'] ) && is_numeric( $attributes['unitCount'] )
			? (int) $attributes['unitCount']
			: 1;

		return min( $max_units, max( 1, $unit_count ) );
	}

	/**
	 * Determines whether weekends should be shown based on attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return bool True if weekends should be shown.
	 */
	public static function show_weekends( array $attributes ): bool {
		return ! isset( $attributes['showWeekends'] ) || ( false !== $attributes['showWeekends'] && 'false' !== $attributes['showWeekends'] );
	}

	/**
	 * Retrieves the configured start of week setting as an integer.
	 *
	 * @return int Start of week (0 = Sunday, 1 = Monday, etc.).
	 */
	public static function get_start_of_week(): int {
		$start_of_week = get_option( 'start_of_week', 0 );

		return is_numeric( $start_of_week ) ? (int) $start_of_week : 0;
	}

	/**
	 * Parses a Y-m-d date string into a DateTimeImmutable, falling back to current datetime.
	 *
	 * @param string $date_str Date string in Y-m-d format.
	 *
	 * @return DateTimeImmutable Parsed date object.
	 */
	private static function parse_date_or_current( string $date_str ): DateTimeImmutable {
		$tz   = wp_timezone();
		$date = DateTimeImmutable::createFromFormat( '!Y-m-d', $date_str, $tz );

		return ( $date instanceof DateTimeImmutable ) ? $date : current_datetime();
	}

	/**
	 * Calculate the target date range for the calendar based on viewType, unitCount, selectedDate, dateModifier, and weekend visibility.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param int                  $page       Pagination page offset (1-based, default 1).
	 *
	 * @return array{
	 *     view_type: string,
	 *     unit_count: int,
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
		$view_type     = self::resolve_view_type( $attributes );
		$unit_count    = self::resolve_unit_count( $attributes, $view_type );
		$selected_date = isset( $attributes['selectedDate'] ) && is_string( $attributes['selectedDate'] ) ? $attributes['selectedDate'] : '';
		$date_modifier = isset( $attributes['dateModifier'] ) && is_numeric( $attributes['dateModifier'] ) ? (int) $attributes['dateModifier'] : 0;
		$show_weekends = self::show_weekends( $attributes );

		// Step offset multiplies pagination by unitCount.
		$offset    = $date_modifier + ( max( 0, $page - 1 ) * $unit_count );
		$base_date = self::resolve_base_date( $selected_date, $view_type, $offset );

		[ $start_date_obj, $end_date_obj, $raw_week_start ] = self::calculate_view_bounds(
			$view_type,
			$base_date,
			$unit_count,
			self::get_start_of_week(),
			$show_weekends
		);

		return self::build_range_payload(
			$view_type,
			$unit_count,
			$start_date_obj,
			$end_date_obj,
			$raw_week_start,
			$base_date
		);
	}

	/**
	 * Resolves a date range from query block context, falling back to calculation.
	 *
	 * @param array<string, mixed> $query               The query array from context.
	 * @param array<string, mixed> $fallback_attributes  Block attributes if context is incomplete.
	 * @param int                  $page                Page number.
	 *
	 * @return array{
	 *     view_type: string,
	 *     unit_count: int,
	 *     start_date: string,
	 *     end_date: string,
	 *     start_date_obj: DateTimeImmutable,
	 *     end_date_obj: DateTimeImmutable,
	 *     raw_week_start: DateTimeImmutable,
	 *     target_date: DateTimeImmutable,
	 *     year: int,
	 *     month: int,
	 *     heading: string
	 * } Date range array.
	 */
	public static function get_range_from_query( array $query, array $fallback_attributes = array(), int $page = 1 ): array {
		$start_date_raw = isset( $query[ Setup::CALENDAR_QUERY_START_DATE ] ) && is_string( $query[ Setup::CALENDAR_QUERY_START_DATE ] ) ? $query[ Setup::CALENDAR_QUERY_START_DATE ] : '';
		$end_date_raw   = isset( $query[ Setup::CALENDAR_QUERY_END_DATE ] ) && is_string( $query[ Setup::CALENDAR_QUERY_END_DATE ] ) ? $query[ Setup::CALENDAR_QUERY_END_DATE ] : '';

		if ( '' === $start_date_raw || '' === $end_date_raw ) {
			return self::calculate_date_range( $fallback_attributes, $page );
		}

		$start_date_obj = self::parse_date_or_current( $start_date_raw );
		$end_date_obj   = self::parse_date_or_current( $end_date_raw );

		$view_type_raw = isset( $query[ Setup::CALENDAR_QUERY_VIEW_TYPE ] ) && is_string( $query[ Setup::CALENDAR_QUERY_VIEW_TYPE ] )
			? $query[ Setup::CALENDAR_QUERY_VIEW_TYPE ]
			: ( $fallback_attributes['viewType'] ?? 'month' );
		$view_type     = self::resolve_view_type( array( 'viewType' => $view_type_raw ) );
		$unit_count    = self::resolve_unit_count( $fallback_attributes, $view_type );

		$heading = isset( $query[ Setup::CALENDAR_QUERY_HEADING ] ) && is_string( $query[ Setup::CALENDAR_QUERY_HEADING ] )
			? $query[ Setup::CALENDAR_QUERY_HEADING ]
			: null;

		return self::build_range_payload(
			$view_type,
			$unit_count,
			$start_date_obj,
			$end_date_obj,
			$start_date_obj,
			$start_date_obj,
			$heading
		);
	}

	/**
	 * Compute the grid column count based on viewType and weekend visibility.
	 *
	 * @param string $view_type     View type ('month', 'week', 'day').
	 * @param bool   $show_weekends Weekend visibility.
	 * @param int    $unit_count    Number of units to show.
	 *
	 * @return int Grid column count.
	 */
	public static function get_columns_count( string $view_type, bool $show_weekends, int $unit_count = 1 ): int {
		if ( 'day' === $view_type ) {
			return max( 1, $unit_count );
		}

		return $show_weekends ? 7 : ( 7 - count( self::get_weekend_days() ) );
	}

	/**
	 * Resolve localized header day names based on the active view.
	 *
	 * @param string            $view_type      View type ('month', 'week', 'day').
	 * @param DateTimeImmutable $start_date_obj Starting date.
	 * @param int               $start_of_week  Start of week setting.
	 * @param bool              $show_weekends  Weekend visibility.
	 * @param int               $unit_count     Number of units to show.
	 *
	 * @return list<string> Localized day name labels.
	 */
	public static function get_view_day_names( string $view_type, DateTimeImmutable $start_date_obj, int $start_of_week, bool $show_weekends, int $unit_count = 1 ): array {
		if ( 'day' === $view_type ) {
			$day_names = array();
			for ( $i = 0; $i < $unit_count; $i++ ) {
				$day_name = wp_date( 'D', $start_date_obj->modify( "+{$i} days" )->getTimestamp() );
				if ( is_string( $day_name ) ) {
					$day_names[] = $day_name;
				}
			}
			return $day_names;
		}

		return self::get_day_names( $start_of_week, $show_weekends );
	}

	/**
	 * Get start of the week for a given date.
	 *
	 * @param DateTimeImmutable $date          Target date.
	 * @param int               $start_of_week Start of week (0 = Sunday, 1 = Monday).
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
		if ( 'day' === $view_type && $start_date->format( 'Y-m-d' ) === $end_date->format( 'Y-m-d' ) ) {
			$day_heading = wp_date( 'l, F j, Y', $start_date->getTimestamp() );
			return is_string( $day_heading ) ? $day_heading : '';
		}

		// Multi-day or week spans.
		if ( 'day' === $view_type || 'week' === $view_type ) {
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

		// Month view (single or multi-month).
		if ( $start_date->format( 'Y-m' ) === $end_date->format( 'Y-m' ) ) {
			$month_heading = wp_date( 'F Y', $start_date->getTimestamp() );
			return is_string( $month_heading ) ? $month_heading : '';
		}

		if ( $start_date->format( 'Y' ) !== $end_date->format( 'Y' ) ) {
			return sprintf(
				'%s – %s',
				wp_date( 'M Y', $start_date->getTimestamp() ),
				wp_date( 'M Y', $end_date->getTimestamp() )
			);
		}

		return sprintf(
			'%s – %s',
			wp_date( 'F', $start_date->getTimestamp() ),
			wp_date( 'F Y', $end_date->getTimestamp() )
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
		// @phpstan-ignore-next-line
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

			$base_sunday = strtotime( '2024-01-07 12:00:00 UTC' );
			// @phpstan-ignore-next-line
			if ( false === $base_sunday ) {
				continue;
			}
			$day_timestamp = $base_sunday + ( $day_of_week * DAY_IN_SECONDS );
			$day_name      = wp_date( 'D', $day_timestamp, new DateTimeZone( 'UTC' ) );
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

	/**
	 * Get maximum allowed unit count for a given view type.
	 *
	 * @since 0.6.0
	 *
	 * @param string $view_type View type ('month', 'week', 'day').
	 *
	 * @return int Maximum units allowed.
	 */
	public static function get_max_unit_count( string $view_type ): int {
		$max_units = array(
			'month' => 12,
			'week'  => 5,
			'day'   => 7,
		);

		return $max_units[ $view_type ] ?? 12;
	}
}
