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
	 * Public entry point: queries posts and organizes them by date.
	 *
	 * @since 0.1.0
	 *
	 * @param array<string, mixed> $query_args WP_Query arguments.
	 *
	 * @return array<string, list<array{id: int, span: string, day_index: int, total_days: int, slot: int}>>
	 */
	public static function organize_posts_by_date( array $query_args ): array {
		$post_ids = self::fetch_post_ids_from_query( $query_args );

		return self::organize_posts( $post_ids );
	}

	/**
	 * Core orchestrator: transforms an array of post IDs into slotted date-grouped entries.
	 *
	 * @since 0.9.0
	 *
	 * @param list<int> $post_ids Array of post IDs.
	 *
	 * @return array<string, list<array{id: int, span: string, day_index: int, total_days: int, slot: int}>>
	 */
	public static function organize_posts( array $post_ids ): array {
		if ( empty( $post_ids ) ) {
			return array();
		}

		$spans         = self::resolve_post_spans( $post_ids );
		$sorted_events = self::sort_events_for_slotting( $spans );

		return self::build_slotted_calendar_entries( $sorted_events );
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

		if ( empty( $query->posts ) || ! is_array( $query->posts ) ) {
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
	 * @param list<int> $post_ids Array of post IDs.
	 *
	 * @return list<array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int}>
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
			$is_all_day      = ! empty( $is_all_day_meta ) && '0' !== $is_all_day_meta && false !== $is_all_day_meta;

			$spans[] = array(
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
	 * Sorts events for slotting: multi-day events first (descending duration), then start date, then ID.
	 *
	 * @param list<array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int}> $events
	 *
	 * @return list<array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int}>
	 */
	public static function sort_events_for_slotting( array $events ): array {
		usort(
			$events,
			static function ( array $a, array $b ): int {
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
		);

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
	 * @param list<string>                    $dates          Dates occupied by the event.
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
	 * @param list<array{id: int, start_obj: DateTimeImmutable, start_date: string, total_days: int}> $sorted_events
	 *
	 * @return array<string, list<array{id: int, span: string, day_index: int, total_days: int, slot: int}>>
	 */
	public static function build_slotted_calendar_entries( array $sorted_events ): array {
		$occupied_slots = array();
		$posts_by_date  = array();

		foreach ( $sorted_events as $event ) {
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
					'slot'       => $slot,
				);
			}
		}

		// Sort daily lists by slot ascending for consistent vertical order across cells.
		foreach ( $posts_by_date as &$day_entries ) {
			usort(
				$day_entries,
				static function ( array $a, array $b ): int {
					return ( $a['slot'] ?? 0 ) <=> ( $b['slot'] ?? 0 );
				}
			);
		}
		unset( $day_entries );

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
}
