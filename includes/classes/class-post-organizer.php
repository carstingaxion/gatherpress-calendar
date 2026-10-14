<?php
/**
 * GatherPress Calendar Post Organizer
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use DateTimeImmutable;
use WP_Query;

/**
 * Post_Organizer Class
 *
 * Fetches posts, computes multi-day spans, and organizes them by date and slot.
 *
 * @since 0.1.0
 */
class Post_Organizer {

	/**
	 * Maximum number of days an event can span to prevent memory exhaustion from invalid dates.
	 *
	 * @var int
	 */
	const MAX_EVENT_SPAN_DAYS = 366;

	/**
	 * Public entry point: queries posts and organizes them by date and time grid.
	 *
	 * @param array<string, mixed> $query_args  WP_Query arguments.
	 * @param array<string, mixed> $grid_config Time grid configuration.
	 *
	 * @return array<string, list<array<string, mixed>>> Slotted calendar entries grouped by date.
	 */
	public static function organize_posts_by_date( array $query_args, array $grid_config = array() ): array {
		$post_ids = self::fetch_post_ids_from_query( $query_args );

		return self::organize_posts( $post_ids, $grid_config );
	}

	/**
	 * Transforms an array of post IDs into slotted date-grouped entries.
	 *
	 * @param int[]                $post_ids    Array of post IDs.
	 * @param array<string, mixed> $grid_config Time grid configuration.
	 *
	 * @return array<string, list<array<string, mixed>>>
	 */
	public static function organize_posts( array $post_ids, array $grid_config = array() ): array {
		if ( empty( $post_ids ) ) {
			return array();
		}

		$spans         = self::resolve_post_spans( $post_ids );
		$sorted_events = self::sort_events_for_slotting( $spans );

		return self::build_slotted_calendar_entries( $sorted_events, $grid_config );
	}

	/**
	 * Extracts valid post IDs from a WP_Query loop.
	 *
	 * @param array<string, mixed> $query_args WP_Query arguments.
	 *
	 * @return list<int>
	 */
	public static function fetch_post_ids_from_query( array $query_args ): array {
		// Ensure we only query IDs regardless of caller arguments.
		$query_args['fields'] = 'ids';
		$query                = new WP_Query( $query_args );

		if ( empty( $query->posts ) ) {
			return array();
		}

		$post_ids = array_map( 'intval', $query->posts );

		// Batch-prime caches so subsequent get_post() and get_post_meta() calls are memory hits.
		_prime_post_caches( $post_ids, true, true );

		return $post_ids;
	}

	/**
	 * Resolves active date spans for a list of post IDs.
	 *
	 * @param int[] $post_ids Array of post IDs.
	 *
	 * @return list<array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int, is_all_day: bool}>
	 */
	public static function resolve_post_spans( array $post_ids ): array {
		$spans = array();

		foreach ( $post_ids as $post_id ) {
			$dates = self::get_post_dates( $post_id );
			if ( empty( $dates['start'] ) ) {
				continue;
			}

			$span = self::calculate_date_span( $dates['start'], $dates['end'] );
			if ( null === $span ) {
				continue;
			}

			$is_all_day_meta = get_post_meta( $post_id, 'gatherpress_is_all_day', true );
			$is_all_day      = ! empty( $is_all_day_meta );
			$spans[]         = array(
				'id'         => $post_id,
				'start_obj'  => $span['start_obj'],
				'start_date' => $dates['start'],
				'total_days' => $span['total_days'],
				'is_all_day' => $is_all_day,
			);
		}

		return $spans;
	}

	/**
	 * Calculates day duration and start DateTime object from start and end date strings.
	 *
	 * Pure date math decoupled from WordPress post data.
	 *
	 * @param string $start_date Y-m-d start date string.
	 * @param string $end_date   Y-m-d end date string.
	 *
	 * @return array{start_obj: DateTimeImmutable, total_days: int}|null
	 */
	public static function calculate_date_span( string $start_date, string $end_date ): ?array {
		$start_obj = DateTimeImmutable::createFromFormat( '!Y-m-d', $start_date, wp_timezone() );
		$end_obj   = DateTimeImmutable::createFromFormat( '!Y-m-d', $end_date, wp_timezone() );

		if ( ! $start_obj instanceof DateTimeImmutable || ! $end_obj instanceof DateTimeImmutable ) {
			return null;
		}

		if ( $end_obj < $start_obj ) {
			$end_obj = $start_obj;
		}

		$total_days = (int) $start_obj->diff( $end_obj )->days + 1;
		$total_days = min( self::MAX_EVENT_SPAN_DAYS, max( 1, $total_days ) );

		return array(
			'start_obj'  => $start_obj,
			'total_days' => $total_days,
		);
	}

	/**
	 * Comparison callback for sorting events for slotting.
	 *
	 * Multi-day events first (descending duration), then start date, then ID.
	 *
	 * @param array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int, is_all_day: bool} $a First event.
	 * @param array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int, is_all_day: bool} $b Second event.
	 *
	 * @return int Comparison result (-1, 0, 1).
	 */
	private static function compare_events_for_slotting( array $a, array $b ): int {
		$a_promoted = ( $a['total_days'] > 1 || ! empty( $a['is_all_day'] ) ) ? 1 : 0;
		$b_promoted = ( $b['total_days'] > 1 || ! empty( $b['is_all_day'] ) ) ? 1 : 0;
		if ( $a_promoted !== $b_promoted ) {
			return $b_promoted <=> $a_promoted;
		}
		if ( $a['total_days'] !== $b['total_days'] ) {
			return $b['total_days'] <=> $a['total_days'];
		}
		if ( $a['start_date'] !== $b['start_date'] ) {
			return strcmp( $a['start_date'], $b['start_date'] );
		}
		return $a['id'] <=> $b['id'];
	}

	/**
	 * Sorts events for slotting: multi-day events first (descending duration), then start date, then ID.
	 *
	 * @param array<int, array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int, is_all_day: bool}> $events List of event descriptors.
	 *
	 * @return list<array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int, is_all_day: bool}>
	 */
	public static function sort_events_for_slotting( array $events ): array {
		usort( $events, array( self::class, 'compare_events_for_slotting' ) );

		return $events;
	}

	/**
	 * Generates an array of Y-m-d date strings covered by an event.
	 *
	 * @param DateTimeImmutable $start_obj  Start date object.
	 * @param int               $total_days Total days duration.
	 *
	 * @return list<string>
	 */
	public static function get_span_dates( DateTimeImmutable $start_obj, int $total_days ): array {
		$dates = array();
		for ( $i = 0; $i < $total_days; $i++ ) {
			$dates[] = $start_obj->modify( "+{$i} days" )->format( Date_Calculator::DATE_FORMAT );
		}

		return $dates;
	}

	/**
	 * Finds the lowest 0-indexed vertical slot free across all dates of an event's span.
	 *
	 * @param string[]                        $dates          Dates occupied by the event.
	 * @param array<string, array<int, bool>> $occupied_slots Map of date strings to occupied slots.
	 *
	 * @return int Lowest available slot index.
	 */
	public static function find_available_slot( array $dates, array $occupied_slots ): int {
		$slot = 0;

		while ( true ) {
			$is_free = true;
			foreach ( $dates as $date_str ) {
				if ( isset( $occupied_slots[ $date_str ][ $slot ] ) ) {
					$is_free = false;
					break;
				}
			}

			if ( $is_free ) {
				return $slot;
			}

			++$slot;
		}
	}

	/**
	 * Classifies the span position for a day within a multi-day event.
	 *
	 * @param int $day_index  1-based day index.
	 * @param int $total_days Total days of the event.
	 *
	 * @return string 'single', 'start', 'middle', or 'end'.
	 */
	public static function determine_span_type( int $day_index, int $total_days ): string {
		if ( $total_days <= 1 ) {
			return 'single';
		}

		if ( 1 === $day_index ) {
			return 'start';
		}

		if ( $total_days === $day_index ) {
			return 'end';
		}

		return 'middle';
	}

	/**
	 * Allocates slots and groups entries into the daily map.
	 *
	 * @param array<int, array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int, is_all_day: bool}> $sorted_events Sorted event descriptors.
	 * @param array<string, mixed>                                                                                            $grid_config   Time grid configuration.
	 *
	 * @return array<string, list<array<string, mixed>>> Slotted entries by date.
	 */
	public static function build_slotted_calendar_entries( array $sorted_events, array $grid_config = array() ): array {
		$occupied_slots = array();
		$posts_by_date  = array();
		$is_time_grid   = ! empty( $grid_config['enabled'] );

		foreach ( $sorted_events as $event ) {
			$is_multi_day = $event['total_days'] > 1 || ! empty( $event['is_all_day'] );

			// In time-grid mode, single-day timed events skip ribbon slot allocation
			if ( $is_time_grid && ! $is_multi_day ) {
				$tracks = self::calculate_timed_event_tracks( $event['id'], $grid_config );
				if ( null === $tracks ) {
					continue; // Outside visible day hours
				}

				$date_str = $event['start_date'];
				if ( ! isset( $posts_by_date[ $date_str ] ) ) {
					$posts_by_date[ $date_str ] = array();
				}

				$posts_by_date[ $date_str ][] = array(
					'id'             => $event['id'],
					'span'           => 'single',
					'day_index'      => 1,
					'total_days'     => 1,
					'is_all_day'     => false,
					'is_timed'       => true,
					'time_row_start' => $tracks['row_start'],
					'time_row_end'   => $tracks['row_end'],
					'slot'           => 0,
				);
				continue;
			}

			// Standard Ribbon Slot Allocation for All-day / Multi-day events
			$event_dates = self::get_span_dates( $event['start_obj'], $event['total_days'] );
			$slot        = self::find_available_slot( $event_dates, $occupied_slots );

			foreach ( $event_dates as $i => $date_str ) {
				$occupied_slots[ $date_str ][ $slot ] = true;

				$day_index = $i + 1;
				$span_type = self::determine_span_type( $day_index, $event['total_days'] );

				if ( ! isset( $posts_by_date[ $date_str ] ) ) {
					$posts_by_date[ $date_str ] = array();
				}

				$posts_by_date[ $date_str ][] = array(
					'id'         => $event['id'],
					'span'       => $span_type,
					'day_index'  => $day_index,
					'total_days' => $event['total_days'],
					'is_all_day' => ! empty( $event['is_all_day'] ),
					'is_timed'   => false,
					'slot'       => $slot,
				);
			}
		}

		// Resolve concurrent overlapping columns for timed entries in each day
		if ( $is_time_grid ) {
			foreach ( $posts_by_date as &$day_entries ) {
				$timed_indices = array();
				foreach ( $day_entries as $idx => $entry ) {
					if ( ! empty( $entry['is_timed'] ) ) {
						$timed_indices[] = $idx;
					}
				}

				foreach ( $timed_indices as $curr_idx ) {
					$curr        = $day_entries[ $curr_idx ];
					$overlaps    = 0;
					$overlap_idx = 0;

					foreach ( $timed_indices as $other_idx ) {
						$other          = $day_entries[ $other_idx ];
						$is_overlapping = ( $curr['time_row_start'] < $other['time_row_end'] ) && ( $curr['time_row_end'] > $other['time_row_start'] );
						if ( $is_overlapping ) {
							++$overlaps;
							if ( $other_idx < $curr_idx ) {
								++$overlap_idx;
							}
						}
					}

					$day_entries[ $curr_idx ]['overlap_total'] = max( 1, $overlaps );
					$day_entries[ $curr_idx ]['overlap_index'] = $overlap_idx;
				}
			}
			unset( $day_entries );
		}

		return $posts_by_date;
	}

	/**
	 * Resolves start and end dates for a post.
	 *
	 * @since 0.9.0
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return array{start: string, end: string}
	 */
	public static function get_post_dates( int $post_id ): array {
		$post_type = get_post_type( $post_id );

		if ( Query_Builder::is_event_post_type( $post_type ) ) {
			$event_dates = Date_Calculator::get_post_event_dates( $post_id );
			if ( null !== $event_dates ) {
				return $event_dates;
			}
		}

		$post_date = get_the_date( Date_Calculator::DATE_FORMAT, $post_id );
		$date_str  = is_string( $post_date ) ? $post_date : '';

		return array(
			'start' => $date_str,
			'end'   => $date_str,
		);
	}

	/**
	 * Resolves event start and end time minutes past midnight for a given date.
	 *
	 * @since 0.9.0
	 *
	 * @param int    $post_id  Post ID.
	 * @param string $date_str Date string (Y-m-d).
	 *
	 * @return array{start_min: int, end_min: int}|null Minutes past midnight or null.
	 */
	public static function get_event_minute_range( int $post_id, string $date_str ): ?array {
		$post_type = get_post_type( $post_id );
		if ( ! Query_Builder::is_event_post_type( $post_type ) ) {
			return null;
		}

		$event     = new \GatherPress\Core\Event\Event( $post_id );
		$datetimes = $event->get_datetime();
		$start_raw = isset( $datetimes['datetime_start'] ) && is_string( $datetimes['datetime_start'] ) ? $datetimes['datetime_start'] : '';
		$end_raw   = isset( $datetimes['datetime_end'] ) && is_string( $datetimes['datetime_end'] ) ? $datetimes['datetime_end'] : '';

		if ( '' === $start_raw ) {
			return null;
		}

		$start_ts = strtotime( $start_raw );
		if ( false === $start_ts ) {
			return null;
		}

		$end_ts = '' !== $end_raw ? strtotime( $end_raw ) : false;
		if ( false === $end_ts || $end_ts <= $start_ts ) {
			$end_ts = $start_ts + HOUR_IN_SECONDS;
		}

		$start_min = ( (int) gmdate( 'G', $start_ts ) * 60 ) + (int) gmdate( 'i', $start_ts );
		$end_min   = ( (int) gmdate( 'G', $end_ts ) * 60 ) + (int) gmdate( 'i', $end_ts );

		return array(
			'start_min' => $start_min,
			'end_min'   => max( $start_min + 15, $end_min ),
		);
	}

	/**
	 * Compute quarter-slot row tracks for a timed event within configured day boundaries.
	 *
	 * @param int                  $post_id     Post ID.
	 * @param array<string, mixed> $grid_config Time grid configuration.
	 *
	 * @return array{row_start: int, row_end: int}|null Row track coordinates or null if outside visible range.
	 */
	public static function calculate_timed_event_tracks( int $post_id, array $grid_config ): ?array {
		$datetimes = Date_Calculator::get_post_event_datetimes( $post_id );
		if ( null === $datetimes ) {
			return null;
		}

		$start_hour   = isset( $grid_config['start_hour'] ) && is_numeric( $grid_config['start_hour'] ) ? (int) $grid_config['start_hour'] : 8;
		$end_hour     = isset( $grid_config['end_hour'] ) && is_numeric( $grid_config['end_hour'] ) ? (int) $grid_config['end_hour'] : 20;
		$quarter_mins = isset( $grid_config['quarter_mins'] ) && is_numeric( $grid_config['quarter_mins'] ) ? max( 1, (int) $grid_config['quarter_mins'] ) : 15;

		$day_start_min = $start_hour * 60;
		$day_end_min   = $end_hour * 60;

		// Skip events ending before day starts or starting after day ends
		// and clamp event to visible day window
		$clamped_start = max( $day_start_min, $datetimes['start_min'] );
		$clamped_end   = min( $day_end_min, $datetimes['end_min'] );

		// Round to 1/4 of slot duration
		$rounded_start = Date_Calculator::round_to_quarter_slot( $clamped_start, $quarter_mins, false );
		$rounded_end   = Date_Calculator::round_to_quarter_slot( $clamped_end, $quarter_mins, true );

		if ( $rounded_end <= $rounded_start ) {
			$rounded_end = $rounded_start + $quarter_mins;
		}

		$start_track = (int) ( ( $rounded_start - $day_start_min ) / $quarter_mins ) + 1;
		$end_track   = (int) ( ( $rounded_end - $day_start_min ) / $quarter_mins ) + 1;

		return array(
			'row_start' => $start_track,
			'row_end'   => max( $start_track + 1, $end_track ),
		);
	}
}
