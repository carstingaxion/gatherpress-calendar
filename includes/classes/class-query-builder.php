<?php
/**
 * GatherPress Calendar Query Builder
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use DateTimeImmutable;
use GatherPress\Core\Event;
use WP_Block;

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
	 * Retrieves the maximum number of posts to query for calendar display.
	 *
	 * This filter allows sites to adapt the number of posts fetched
	 * for calendar rendering to match their specific performance and event volume needs.
	 *
	 * @since 0.8.0
	 *
	 * @return int Number of posts to query.
	 */
	public static function get_posts_per_page(): int {
		$default_posts_per_page = 500;

		/**
		 * Filters the maximum number of posts queried for calendar display.
		 *
		 * Defaults to 500.
		 *
		 * @since 0.8.0
		 *
		 * @param int $default_posts_per_page Default number of posts to query.
		 */
		$posts_per_page = apply_filters( 'gatherpress_calendar_posts_per_page', $default_posts_per_page );

		// @phpstan-ignore-next-line
		return is_numeric( $posts_per_page ) ? max( 1, (int) $posts_per_page ) : $default_posts_per_page;
	}

	/**
		* Highest page number a calendar accepts from the URL.
		*
		* Date_Calculator multiplies the page by unitCount. A very large page
		* overflows that integer and causes a fatal TypeError.
		*
		* @since 0.8.0
		*/
	const MAX_PAGE = 10000;

	/**
	 * Get the requested page number of a core/query block.
	 *
	 * Reads the same URL parameter, and casts it the same way, as core's Query
	 * Pagination blocks: `query-{$query_id}-page` when the Query block has a
	 * queryId (0 included), and `query-page` when it has none.
	 *
	 * @since 0.8.0
	 *
	 * @param mixed $query_id The Query block's queryId, or null when it has none.
	 *
	 * @return int Page number, from 1 to MAX_PAGE.
	 */
	public static function get_requested_page( $query_id ): int {
		$page_key = is_numeric( $query_id ) ? 'query-' . (int) $query_id . '-page' : 'query-page';

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! isset( $_GET[ $page_key ] ) || ! is_scalar( $_GET[ $page_key ] ) ) {
			return 1;
		}

		$page = (int) $_GET[ $page_key ]; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		return min( self::MAX_PAGE, max( 1, $page ) );
	}

	/**
	 * Checks whether a given post type (or list of post types) supports event dates.
	 *
	 * When an array is provided, returns true only if all post types support 'gatherpress-event-date'.
	 *
	 * @param mixed $post_type Post type slug or array of slugs.
	 *
	 * @return bool True if all post types support 'gatherpress-event-date'.
	 */
	public static function is_event_post_type( $post_type ): bool {
		if ( is_string( $post_type ) ) {
			return post_type_supports( $post_type, 'gatherpress-event-date' );
		}

		if ( is_array( $post_type ) && ! empty( $post_type ) ) {
			foreach ( $post_type as $type ) {
				if ( ! is_string( $type ) || ! post_type_supports( $type, 'gatherpress-event-date' ) ) {
					return false;
				}
			}

			return true;
		}

		return false;
	}

	/**
	 * Build query arguments from block context and resolved date range.
	 *
	 * @since 0.1.0
	 *
	 * @param WP_Block                                                                                                                                                                                                                                        $block      Block instance.
	 * @param array{ view_type: string, start_date: string, end_date: string, start_date_obj: DateTimeImmutable, end_date_obj: DateTimeImmutable, raw_week_start: DateTimeImmutable, target_date: DateTimeImmutable, year: int, month: int, heading: string } $date_range Resolved date range array.
	 *
	 * @return array<string, mixed> WP_Query arguments.
	 */
	public static function build_query_args( WP_Block $block, array $date_range ): array {
		$page = self::get_requested_page( $block->context['queryId'] ?? null );

		/**
		 * Type safety.
		 *
		 * @var array<string, mixed> $query_args
		 */
		$query_args = build_query_vars_from_query_block( $block, $page );

		// Set calendar query markers and range parameters.
		$query_args[ Event\Query::EVENT_QUERY_PARAM ]   = 'all';
		$query_args[ Setup::CALENDAR_QUERY_PARAM ]      = true;
		$query_args[ Setup::CALENDAR_QUERY_VIEW_TYPE ]  = $date_range['view_type'];
		$query_args[ Setup::CALENDAR_QUERY_START_DATE ] = $date_range['start_date'];
		$query_args[ Setup::CALENDAR_QUERY_END_DATE ]   = $date_range['end_date'];
		$query_args['posts_per_page']                   = self::get_posts_per_page();

		/*
		 * Core sets no post_status here, so WP_Query shows published posts, plus
		 * private ones to users who may read them. Listing statuses by hand drops
		 * that private check, so 'perm' => 'readable' puts it back. The check is
		 * done per post type here because, with more than one post type, WP_Query
		 * tests a 'read_private_multiple_post_types' capability that no role has.
		 * A user who can read private posts of only some of the types sees just
		 * their own private posts, which errs on the side of showing less.
		 */
		if ( true === ( $block->attributes['showScheduled'] ?? false ) ) {
			$query_args['post_status'] = array( 'publish', 'future', 'private' );

			foreach ( (array) ( $query_args['post_type'] ?? 'post' ) as $type ) {
				$type_object  = is_string( $type ) ? get_post_type_object( $type ) : null;
				$read_private = $type_object ? $type_object->cap->read_private_posts : null;

				if ( ! is_string( $read_private ) || ! current_user_can( $read_private ) ) {
					$query_args['perm'] = 'readable';
					break;
				}
			}
		}

		$post_type = $query_args['post_type'] ?? 'post';
		$is_event  = self::is_event_post_type( $post_type );

		// Inclusive date range prevents boundary clipping across weeks and multi-month periods.
		$date_clause = array(
			'after'     => $date_range['start_date'] . ' 00:00:00',
			'before'    => $date_range['end_date'] . ' 23:59:59',
			'inclusive' => true,
		);

		if ( $is_event ) {
			$date_clause['column'] = 'datetime_start';
		}

		// Inclusive date range prevents boundary clipping across weeks and multi-month periods.
		$query_args['date_query'] = array( $date_clause );

		if ( 1 !== $page ) {
			unset( $query_args['offset'] );
		}

		unset( $query_args['include_unfinished'] );

		return $query_args;
	}
}
