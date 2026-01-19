<?php
/**
 * GatherPress Calendar Post Organizer
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress\Calendar;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.

if ( ! class_exists( '\GatherPress\Calendar\Post_Organizer' ) ) {
	/**
	 * Post_Organizer Class
	 *
	 * Fetches posts and organizes them by date for calendar display.
	 *
	 * @since 0.1.0
	 */
	class Post_Organizer {

		/**
		 * Organize posts by date.
		 *
		 * @since 0.1.0
		 *
		 * @param array<string, mixed> $query_args WP_Query arguments.
		 *
		 * @return array<string, list<int>> Posts organized by date.
		 */
		public static function organize_posts_by_date( array $query_args ): array {
			$posts_by_date = array();
			$query_loop    = new \WP_Query( $query_args );

			while ( $query_loop->have_posts() ) {
				$query_loop->the_post();
				$post_id = get_the_ID();
				if ( ! is_int( $post_id ) || 0 === $post_id ) {
					continue;
				}

				$post_date = self::get_post_date( $post_id );
				if ( empty( $post_date ) ) {
					continue;
				}

				if ( ! isset( $posts_by_date[ $post_date ] ) ) {
					$posts_by_date[ $post_date ] = array();
				}
				$posts_by_date[ $post_date ][] = $post_id;
			}

			wp_reset_postdata();

			return $posts_by_date;
		}

		/**
		 * Get the appropriate date for a post.
		 *
		 * @since 0.1.0
		 *
		 * @param int $post_id Post ID.
		 *
		 * @return string Post date in Y-m-d format.
		 */
		private static function get_post_date( int $post_id ): string {
			$post_type = get_post_type( $post_id );

			if ( 'gatherpress_event' === $post_type && class_exists( '\GatherPress\Core\Event' ) ) {
				$event     = new \GatherPress\Core\Event( $post_id );
				$post_date = $event->get_datetime_start( Date_Calculator::DATE_FORMAT );
			} else {
				$post_date = get_the_date( Date_Calculator::DATE_FORMAT, $post_id );
			}

			return is_string( $post_date ) ? $post_date : '';
		}
	}
}
