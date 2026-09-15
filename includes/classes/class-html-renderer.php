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
			$this->today = Date_Calculator::get_today();
		}

		/**
		 * Generate complete calendar HTML.
		 *
		 * @since 0.1.0
		 *
		 * @param array<string, mixed>                                                                      $attributes     Block attributes.
		 * @param array{month_name: string,day_names: list<string>,weeks: list<list<array<string, mixed>>>} $calendar_data  Calendar structure.
		 * @param string                                                                                    $popover_styles Popover styles.
		 *
		 * @return string Calendar HTML.
		 */
		public function generate_calendar_html( array $attributes, array $calendar_data, string $popover_styles ): string {
			$wrapper_attributes  = get_block_wrapper_attributes( array( 'class' => 'gatherpress-calendar-block' ) );
			$show_month_heading  = isset( $attributes['showMonthHeading'] ) && is_bool( $attributes['showMonthHeading'] ) ? $attributes['showMonthHeading'] : true;
			$month_heading_level = isset( $attributes['monthHeadingLevel'] ) && is_numeric( $attributes['monthHeadingLevel'] ) ? (int) $attributes['monthHeadingLevel'] : 2;

			ob_start();
			?>
			<div data-wp-interactive="gatherpress/calendar" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped --- get_block_wrapper_attributes() runs esc_attr() on every return ?>>
				<div 
					class="gatherpress-calendar"
					data-wp-context='{
						"triggerRef": null,
						"customStyles": <?php echo wp_json_encode( $popover_styles ); ?>
					}'
				>
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
							<?php echo wp_kses_post( $this->render_calendar_weeks( $calendar_data['weeks'], $popover_styles ) ); ?>
						</tbody>
					</table>
					<!-- Backdrop -->
					<div 
						class="gatherpress-calendar__backdrop"
						data-wp-class--is-active="state.popoverOpen"
						data-wp-on--click="actions.handleBackdropClick"
					></div>

					<!-- Popover -->
					<div 
						class="gatherpress-calendar__popover"
						data-wp-class--is-active="state.popoverOpen"
				
						data-wp-watch="callbacks.updatePosition"
						role="dialog"
						aria-modal="true"
						tabindex="-1"
						data-wp-style--background-color="context.customStyles.backgroundColor"
						data-wp-style--padding="context.customStyles.padding"
						data-wp-style--border-width="context.customStyles.borderWidth"
						data-wp-style--border-style="context.customStyles.borderStyle"
						data-wp-style--border-color="context.customStyles.borderColor"
						data-wp-style--border-radius="context.customStyles.borderRadius"
						data-wp-style--box-shadow="context.customStyles.boxShadow"
					>
						<!-- <div data-wp-html="state.popoverContent"></div> -->
						<div 
							class="gatherpress-calendar__popover-content"
							data-wp-watch="callbacks.renderPopoverContent"
						></div>
						
						<button
							class="gatherpress-calendar__popover-close"
							data-wp-on--click="actions.closePopover"
							aria-label="<?php echo esc_attr__( 'Close', 'gatherpress-calendar' ); ?>"
						>&times;</button>
					</div>
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
		 *
		 * @return string Weeks HTML.
		 */
		private function render_calendar_weeks( array $weeks, string $popover_styles ): string {
			ob_start();

			foreach ( $weeks as $week ) {
				echo '<tr>';
				foreach ( $week as $day ) {
					echo wp_kses_post( $this->render_day_cell( $day, $popover_styles ) );
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
		 *
		 * @return string Day cell HTML.
		 */
		private function render_day_cell( array $day, string $popover_styles ): string {
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
								<?php echo wp_kses_post( $this->render_event_dots( $day_posts, $popover_styles ) ); ?>
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
		 *
		 * @return string Event dots and hidden content HTML.
		 */
		private function render_event_dots( array $post_ids, string $popover_styles ): string {
			ob_start();

			foreach ( $post_ids as $post_id ) {
				if ( is_int( $post_id ) ) {
					echo wp_kses_post( $this->render_single_event_dot( $post_id, $popover_styles ) );
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
		 * @param int    $post_id        Post ID.
		 * @param string $popover_styles Popover styles.
		 *
		 * @return string Event dot HTML with hidden content.
		 */
		private function render_single_event_dot( int $post_id, string $popover_styles ): string {
			$post = get_post( $post_id );
			if ( ! $post instanceof \WP_Post ) {
				return '';
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

			ob_start();
			?>
			<a
				href="<?php echo esc_url( $post_url ); ?>"
				class="gatherpress-calendar__event"
				<?php /* translators: %s Post title */ ?>
				aria-label="<?php echo esc_attr( sprintf( __( 'View event: %s', 'gatherpress-calendar' ), $post_title ) ); ?>"
				data-post-id="<?php echo esc_attr( (string) $post_id ); ?>"
				data-popover-style="<?php echo esc_attr( $popover_styles ); ?>"
				data-wp-on--click="actions.openPopoverById"
				data-wp-on--keydown="actions.handleKeydown"
				role="button"
				tabindex="0"
				></a>
			<?php
			$output = ob_get_clean();
			return is_string( $output ) ? $output : '';
		}
	}
}