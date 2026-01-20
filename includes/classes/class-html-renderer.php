<?php
/**
 * GatherPress Calendar HTML Renderer
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress\Calendar;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.


if ( ! class_exists( '\GatherPress\Calendar\HTML_Renderer' ) ) {
	/**
	 * HTML_Renderer Class
	 *
	 * Generates HTML output for the calendar.
	 *
	 * - Event dots are now simple links
	 * - InnerBlocks content renders in hidden containers
	 * - JavaScript shows content in popover on click
	 * - This creates valid HTML
	 *
	 * @since 0.1.0
	 */
	class HTML_Renderer {

		/**
		 * Original global post.
		 *
		 * @since 0.1.0
		 * @var \WP_Post|null
		 */
		private ?\WP_Post $original_post = null;

		/**
		 * Today's date.
		 *
		 * @since 0.1.0
		 * @var string
		 */
		private string $today = '';

		/**
		 * Constructor.
		 *
		 * @since 0.1.0
		 */
		public function __construct() {
			$this->original_post = ( isset( $GLOBALS['post'] ) && $GLOBALS['post'] instanceof \WP_Post ) ? $GLOBALS['post'] : null;
			$this->today         = Date_Calculator::get_today();
		}

		/**
		 * Generate complete calendar HTML.
		 *
		 * @since 0.1.0
		 *
		 * @param array<string, mixed>                                                                      $attributes     Block attributes.
		 * @param array{month_name: string,day_names: list<string>,weeks: list<list<array<string, mixed>>>} $calendar_data  Calendar structure.
		 * @param string                                                                                    $popover_styles Popover styles.
		 * @param \WP_Block                                                                                 $block          Block instance.
		 *
		 * @return string Calendar HTML.
		 */
		public function generate_calendar_html( array $attributes, array $calendar_data, string $popover_styles, \WP_Block $block ): string {
			$wrapper_attributes  = get_block_wrapper_attributes( array( 'class' => 'gatherpress-calendar-block' ) );
			$show_month_heading  = isset( $attributes['showMonthHeading'] ) && is_bool( $attributes['showMonthHeading'] ) ? $attributes['showMonthHeading'] : true;
			$month_heading_level = isset( $attributes['monthHeadingLevel'] ) && is_numeric( $attributes['monthHeadingLevel'] ) ? (int) $attributes['monthHeadingLevel'] : 2;

			ob_start();
			?>
			<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped --- get_block_wrapper_attributes() runs esc_attr() on every return ?>>
				<div class="gatherpress-calendar">
					<?php if ( $show_month_heading ) { ?>
						<?php
						$heading_level = max( 1, min( 6, $month_heading_level ) );
						$heading_tag   = 'h' . $heading_level;
						?>
						<<?php echo esc_attr( $heading_tag ); ?> class="gatherpress-calendar__month wp-block-heading"><?php echo esc_html( $calendar_data['month_name'] ); ?></<?php echo esc_attr( $heading_tag ); ?>>
					<?php } ?>
					<table class="gatherpress-calendar__table">
						<thead>
							<tr>
								<?php foreach ( $calendar_data['day_names'] as $day_name ) { ?>
									<th><?php echo esc_html( $day_name ); ?></th>
								<?php } ?>
							</tr>
						</thead>
						<tbody>
							<?php echo wp_kses_post( $this->render_calendar_weeks( $calendar_data['weeks'], $popover_styles, $block ) ); ?>
						</tbody>
					</table>
				</div>
			</div>
			<?php
			return (string) ob_get_clean();
		}

		/**
		 * Render calendar weeks.
		 *
		 * @since 0.1.0
		 *
		 * @param list<list<array<string, mixed>>> $weeks          Weeks array.
		 * @param string                           $popover_styles Popover styles.
		 * @param \WP_Block                        $block          Block instance.
		 *
		 * @return string Weeks HTML.
		 */
		private function render_calendar_weeks( array $weeks, string $popover_styles, \WP_Block $block ): string {
			ob_start();

			foreach ( $weeks as $week ) {
				echo '<tr>';
				foreach ( $week as $day ) {
					echo wp_kses_post( $this->render_day_cell( $day, $popover_styles, $block ) );
				}
				echo '</tr>';
			}

			return (string) ob_get_clean();
		}

		/**
		 * Render single day cell.
		 *
		 * @since 0.1.0
		 *
		 * @param array<string, mixed> $day            Day data.
		 * @param string               $popover_styles Popover styles.
		 * @param \WP_Block            $block          Block instance.
		 *
		 * @return string Day cell HTML.
		 */
		private function render_day_cell( array $day, string $popover_styles, \WP_Block $block ): string {
			$classes = array( 'gatherpress-calendar__day' );
			if ( ! empty( $day['isEmpty'] ) ) {
				$classes[] = 'is-empty';
			}
			if ( ! empty( $day['posts'] ) ) {
				$classes[] = 'has-posts';
			}
			if ( isset( $day['date'] ) && is_string( $day['date'] ) && $day['date'] === $this->today ) {
				$classes[] = 'is-today';
			}
			$should_render = ( empty( $day['isEmpty'] ) && isset( $day['date'] ) && is_string( $day['date'] ) && isset( $day['day'] ) && is_int( $day['day'] ) );

			ob_start();
			?>
			<td class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
				<?php if ( $should_render ) { ?>
					<div class="gatherpress-calendar__day-content">
						<div class="gatherpress-calendar__day-number">
							<?php // @phpstan-ignore-next-line cast.string ?>
							<?php echo esc_html( (string) $day['day'] ); ?>
						</div>
						<?php
						$day_posts = isset( $day['posts'] ) && is_array( $day['posts'] ) ? $day['posts'] : array();
						if ( ! empty( $day_posts ) ) {
							?>
							<div class="gatherpress-calendar__events">
								<?php echo wp_kses_post( $this->render_event_dots( $day_posts, $popover_styles, $block ) ); ?>
							</div>
							<?php
						}
						?>
					</div>
				<?php } ?>
			</td>
			<?php
			return (string) ob_get_clean();
		}

		/**
		 * Render event dots and hidden content containers.
		 *
		 * - Renders simple event dot links (no nested content)
		 * - Renders hidden containers with post content
		 * - JavaScript will show content in popover on click
		 *
		 * @since 0.1.0
		 *
		 * @param array<mixed> $post_ids       Post IDs.
		 * @param string       $popover_styles Popover styles.
		 * @param \WP_Block    $block          Block instance.
		 *
		 * @return string Event dots and hidden content HTML.
		 */
		private function render_event_dots( array $post_ids, string $popover_styles, \WP_Block $block ): string {
			ob_start();

			foreach ( $post_ids as $post_id ) {
				if ( is_int( $post_id ) ) {
					echo wp_kses_post( $this->render_single_event_dot( $post_id, $popover_styles, $block ) );
				}
			}

			$output = ob_get_clean();
			return is_string( $output ) ? $output : '';
		}

		/**
		 * Render single event dot with hidden content container.
		 *
		 * NEW STRUCTURE:
		 * <a class="gatherpress-calendar__event" href="..." data-event-id="post-123">
		 *   <!-- Empty dot, just the link -->
		 * </a>
		 * <div class="gatherpress-calendar__event-content" id="event-content-123" hidden>
		 *   <!-- InnerBlocks content here -->
		 * </div>
		 *
		 * @since 0.1.0
		 *
		 * @param int       $post_id        Post ID.
		 * @param string    $popover_styles Popover styles.
		 * @param \WP_Block $block          Block instance.
		 *
		 * @return string Event dot HTML with hidden content.
		 */
		private function render_single_event_dot( int $post_id, string $popover_styles, \WP_Block $block ): string {
			$post = get_post( $post_id );
			if ( ! $post instanceof \WP_Post ) {
				return '';
			}

			if ( isset( $GLOBALS['post'] ) ) {
				// "Overriding WordPress globals is prohibited."
				//
				// I know! But as found out a lot of times,
				// the core/post-title block does not take care about the context postId, instead it uses hardcoded global $post.
				$GLOBALS['post'] = $post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			}
			setup_postdata( $post );

			$post_type = get_post_type( $post );
			if ( ! is_string( $post_type ) ) {
				$post_type = 'post';
			}

			$post_url = get_permalink( $post_id );
			if ( ! is_string( $post_url ) ) {
				$post_url = '';
			}

			$post_title = the_title_attribute(
				array(
					'echo' => false,
					'post' => $post,
				) 
			);
			if ( ! is_string( $post_title ) ) {
				$post_title = '';
			}

			// Render inner blocks content.
			$filter_block_context = static function ( array $context ) use ( $post_id, $post_type ): array {
				$context['postType'] = $post_type;
				$context['postId']   = $post_id;
				return $context;
			};

			add_filter( 'render_block_context', $filter_block_context, 1 );

			$block_instance = $this->prepare_inner_blocks_instance( $block );
			$inner_content  = ( new \WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );

			remove_filter( 'render_block_context', $filter_block_context, 1 );

			wp_reset_postdata();
			if ( isset( $GLOBALS['post'] ) ) {
				// "Overriding WordPress globals is prohibited."
				//
				// I know! But as found out a lot of times,
				// the core/post-title block does not take care about the context postId, instead it uses hardcoded global $post.
				$GLOBALS['post'] = $this->original_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			}

			// Generate unique ID for this event content.
			$event_content_id = 'event-content-' . $post_id;

			ob_start();
			?>
			<a
				href="<?php echo esc_url( $post_url ); ?>"
				class="gatherpress-calendar__event"
				data-post-id="<?php echo esc_attr( (string) $post_id ); ?>"
				data-event-content="<?php echo esc_attr( $event_content_id ); ?>"
				data-popover-style="<?php echo esc_attr( $popover_styles ); ?>"
				<?php /* translators: %s Post title */ ?>
				aria-label="<?php echo esc_attr( sprintf( __( 'View event: %s', 'gatherpress-calendar' ), $post_title ) ); ?>"
			></a>
			<div
				id="<?php echo esc_attr( $event_content_id ); ?>"
				class="gatherpress-calendar__event-content"
				hidden
			>
				<?php echo $inner_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
			<?php
			$output = ob_get_clean();
			return is_string( $output ) ? $output : '';
		}

		/**
		 * Prepare inner blocks instance.
		 *
		 * @since 0.1.0
		 *
		 * @param \WP_Block $block Block instance.
		 *
		 * @return array{blockName?: string|null, attrs?: array{string?: mixed}, innerBlocks?: array{string?: mixed}, innerHTML?: string, innerContent?: array{string?: mixed}} Inner blocks instance.
		 */
		private function prepare_inner_blocks_instance( \WP_Block $block ): array {
			$block_instance              = $block->parsed_block;
			$block_instance['blockName'] = 'core/null';
			$block_instance['innerHTML'] = '';
			$inner_content               = isset( $block_instance['innerContent'] ) && is_array( $block_instance['innerContent'] )
				? $block_instance['innerContent']
				: array();

			array_pop( $inner_content );
			array_shift( $inner_content );

			$block_instance['innerContent'] = array_values( $inner_content );

			/**
			 * Type safety first
			 * 
			 * @var array{
			 *   blockName: string,
			 *   attrs: array<string, mixed>,
			 *   innerBlocks: array<int, array<string, mixed>>,
			 *   innerHTML: string,
			 *   innerContent: array<int, string|null>,
			 * } $block_instance
			 */
			return $block_instance;
		}
	}
}