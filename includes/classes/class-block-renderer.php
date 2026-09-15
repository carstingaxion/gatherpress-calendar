<?php
/**
 * GatherPress Calendar Block Render
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress\Calendar;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.

if ( ! class_exists( '\GatherPress\Calendar\Block_Renderer' ) ) {
	/**
	 * Block_Renderer Class
	 *
	 * Singleton class that orchestrates the rendering process by coordinating
	 * all the specialized classes.
	 *
	 * @since 0.1.0
	 */
	class Block_Renderer {

		/**
		 * Singleton instance.
		 *
		 * @since 0.1.0
		 * @var Block_Renderer|null
		 */
		private static ?Block_Renderer $instance = null;

		/**
		 * Start of week setting.
		 *
		 * @since 0.1.0
		 * @var int
		 */
		private int $start_of_week = 0;

		/**
		 * Constructor.
		 *
		 * @since 0.1.0
		 */
		private function __construct() {
			$start_of_week_option = get_option( 'start_of_week', 0 );
			$this->start_of_week  = is_numeric( $start_of_week_option ) ? (int) $start_of_week_option : 0;
		}

		/**
		 * Get singleton instance.
		 *
		 * @since 0.1.0
		 *
		 * @return Block_Renderer Singleton instance.
		 */
		public static function get_instance(): Block_Renderer {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Prevent cloning.
		 *
		 * @since 0.1.0
		 *
		 * @return void
		 */
		private function __clone() {}

		/**
		 * Prevent unserialization.
		 *
		 * @since 0.1.0
		 *
		 * @return void
		 * @throws \Exception Always.
		 */
		public function __wakeup(): void {
			throw new \Exception( 'Cannot unserialize singleton' );
		}

		/**
		 * Render the calendar block.
		 *
		 * @since 0.1.0
		 *
		 * @param array<string, mixed> $attributes Block attributes.
		 * @param string               $content    Block content.
		 * @param \WP_Block            $block      Block instance.
		 *
		 * @return string Rendered HTML.
		 */
		public function render( array $attributes, string $content, \WP_Block $block ): string {


			/**
			 * Validate query context.
			 *
			 * @var array<string, mixed>|null $query
			 */
			$query = $block->context['query'] ?? null;
			if ( ! is_array( $query ) || empty( $query ) ) {
				return '';
			}

			// Calculate target date.
			$target_date = Date_Calculator::calculate_target_date( $attributes );
			$year        = $target_date['year'];
			$month       = $target_date['month'];

			// Build query and fetch posts.
			$query_args     = Query_Builder::build_query_args( $block, $year, $month );
			$posts_by_date  = Post_Organizer::organize_posts_by_date( $query_args );
			$event_contents = array();
			foreach ( $posts_by_date as $date => $post_ids ) {
				foreach ( $post_ids as $post_id ) {
					if ( ! isset( $event_contents[ $post_id ] ) ) {
						$event_contents[ (int) $post_id ] = $this->render_inner_blocks( (int) $post_id, $block );
					}
				}
			}
			// Build calendar structure.
			$calendar_data = Calendar_Structure_Builder::build_structure( $year, $month, $this->start_of_week, $posts_by_date );

			// Prepare styles.
			$popover_styles = Style_Processor::prepare_popover_styles( $attributes );

			// Enable Interactivity API for this block
			wp_interactivity_state(
				'gatherpress/calendar',
				array(
					'popoverOpen'     => false,
					'popoverContent'  => '',
					'popoverStyles'   => array(),
					'popoverPosition' => array(
						'top'  => 0,
						'left' => 0,
					),
					'activeEventId'   => null,
					'eventContents' => $event_contents,
				)
			);

			// Generate HTML.
			$renderer = new HTML_Renderer();
			return $renderer->generate_calendar_html( $attributes, $calendar_data, $popover_styles, $block );
		}
	
		/**
		 * Renders the block's inner blocks for a specific post.
		 *
		 * @param int      $post_id The post/event ID.
		 * @param \WP_Block $block   The parent block instance (passed from render_callback).
		 * @return string Rendered HTML content.
		 */
		protected function render_inner_blocks( int $post_id, \WP_Block $block ): string {
			$target_post = get_post( $post_id );
			if ( ! $target_post ) {
				return '';
			}
	
			// Check if there are any inner blocks defined in the template
			if ( empty( $block->parsed_block['innerBlocks'] ) ) {
				return '';
			}
	
			// 1. Setup global post data for legacy/standard template tags
			global $post;
			$previous_post = $post;
			$post          = $target_post;
			setup_postdata( $post );
	
			$rendered_content = '';
	
			// 2. Render each inner block with the current post context
			foreach ( $block->parsed_block['innerBlocks'] as $inner_block_data ) {
				$inner_block = new \WP_Block(
					$inner_block_data,
					array(
						'postId'   => $post_id,
						'postType' => get_post_type( $post_id ),
					)
				);
	
				$rendered_content .= $inner_block->render();
			}
	
			// 3. Restore the original global post data
			$post = $previous_post;
			if ( $previous_post ) {
				setup_postdata( $previous_post );
			} else {
				wp_reset_postdata();
			}

			return $rendered_content;
		}

	}

}
