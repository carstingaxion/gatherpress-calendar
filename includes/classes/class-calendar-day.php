<?php
/**
 * The "Calendar_Day" class handles rendering and lifecycle of the Calendar Day block.
 *
 * @package GatherPressCalendar
 * @since 0.4.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use GatherPress\Core\Traits\Singleton;
use WP_Block;
use WP_Post;

/**
 * Class Calendar_Day.
 */
class Calendar_Day {

	/**
	 * Enforces a single instance of this class.
	 */
	use Singleton;

	/**
	 * Constant representing the Block Name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'gatherpress/calendar-day';

	/**
	 * Original global post backup.
	 *
	 * @var WP_Post|null
	 */
	private ?WP_Post $original_post = null;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Register block render filter.
	 *
	 * @return void
	 */
	protected function setup_hooks(): void {
		add_filter( 'register_block_type_args', array( $this, 'filter_block_type_args' ), 10, 2 );
	}

	/**
	 * Inject render_callback into block registration arguments.
	 *
	 * @param array<string, mixed> $args       Block registration arguments.
	 * @param string               $block_type Block type name (e.g. 'gatherpress/calendar-day').
	 *
	 * @return array<string, mixed> Filtered arguments.
	 */
	public function filter_block_type_args( array $args, string $block_type ): array {
		if ( self::BLOCK_NAME === $block_type ) {
			$args['render_callback'] = array( $this, 'render_callback' );
		}

		return $args;
	}

	/**
	 * Render callback for the calendar day cell.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Block inner content (event dots & popovers).
	 * @param WP_Block             $block      Block instance.
	 *
	 * @return string Rendered HTML.
	 */
	public function render_callback( array $attributes, string $content, WP_Block $block ): string {
		// This is somehow called, when it shouldnt, so I try to guard this, even knowing this is stupid.
		if ( ! isset( $block->context['gatherpress/isEmpty'] ) ) {
			return '';
		}

		$day_number = isset( $block->context['gatherpress/dayNumber'] ) ? (int) $block->context['gatherpress/dayNumber'] : 0;
		$is_empty   = ! empty( $block->context['gatherpress/isEmpty'] );
		$is_today   = ! empty( $block->context['gatherpress/isToday'] );
		$day_posts  = isset( $block->context['gatherpress/dayPosts'] ) && is_array( $block->context['gatherpress/dayPosts'] )
			? $block->context['gatherpress/dayPosts']
			: array();
		$has_posts  = ! empty( $day_posts );

		$classes = array( 'gatherpress-calendar__day' );
		if ( $is_empty ) {
			$classes[] = 'is-empty';
		}
		if ( $has_posts ) {
			$classes[] = 'has-posts';
		}
		if ( $is_today ) {
			$classes[] = 'is-today';
		}

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

		// Render event dots & popovers.
		$popover_styles = isset( $block->context['gatherpress/popoverStyles'] ) && is_string( $block->context['gatherpress/popoverStyles'] )
			? $block->context['gatherpress/popoverStyles']
			: '';

		// $events_html = $has_posts ? $this->render_event_dots( $day_posts, $popover_styles, $block ) : '';

		$day_number_block = null;
		if ( ! empty( $block->parsed_block['innerBlocks'] ) ) {
			foreach ( $block->parsed_block['innerBlocks'] as $inner ) {
				if ( ( $inner['attrs']['metadata']['bindings']['content']['source'] ?? '' ) === 'gatherpress/calendar-day' ) {
					$day_number_block = $inner;
					break;
				}
			}
		}

		// Render the bound paragraph block with this day's context
		$day_number_html = $day_number_block 
			? ( new \WP_Block( $day_number_block, $block->context ) )->render() 
			: sprintf( '<p class="gatherpress-calendar__day-number">%s</p>', esc_html( (string) $day_number ) );

		ob_start();
		?>
		<td <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php if ( ! $is_empty && $day_number > 0 ) { ?>
				<div class="gatherpress-calendar__day-content">
					<?php echo $day_number_html; ?>
					<?php if ( ! empty( $content ) ) { ?>
						<div class="gatherpress-calendar__events">
							<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</div>
					<?php } ?>
				</div>
			<?php } ?>
		</td>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render event dots and hidden content containers for a day.
	 *
	 * @param array<mixed> $post_ids       Post IDs.
	 * @param string       $popover_styles Popover styles.
	 * @param WP_Block     $block          The Calendar Day block instance.
	 *
	 * @return string Event dots and hidden content HTML.
	 */
	public function render_event_dots( array $post_ids, string $popover_styles, WP_Block $block ): string {
		$this->original_post = ( isset( $GLOBALS['post'] ) && $GLOBALS['post'] instanceof WP_Post ) ? $GLOBALS['post'] : null;

		ob_start();

		foreach ( $post_ids as $post_id ) {
			if ( is_int( $post_id ) ) {
				echo $this->render_single_event_dot( $post_id, $popover_styles, $block ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		}

		$output = ob_get_clean();
		return is_string( $output ) ? $output : '';
	}

	/**
	 * Render single event dot with hidden content container.
	 *
	 * @param int      $post_id        Post ID.
	 * @param string   $popover_styles Popover styles.
	 * @param WP_Block $block          The Calendar Day block instance.
	 *
	 * @return string Event dot HTML with hidden content.
	 */
	private function render_single_event_dot( int $post_id, string $popover_styles, WP_Block $block ): string {
		$post = get_post( $post_id );
		if ( ! $post instanceof WP_Post ) {
			return '';
		}

		if ( isset( $GLOBALS['post'] ) ) {
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

		// Context filter for inner blocks template (core/post-title, post-date, etc.).
		$filter_block_context = static function ( array $context ) use ( $post_id, $post_type ): array {
			$context['postType'] = $post_type;
			$context['postId']   = $post_id;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );

		$block_instance = $this->prepare_inner_blocks_instance( $block );
		$inner_content  = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );

		remove_filter( 'render_block_context', $filter_block_context, 1 );

		wp_reset_postdata();
		if ( isset( $GLOBALS['post'] ) ) {
			$GLOBALS['post'] = $this->original_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}

		$event_content_id = 'event-content-' . $post_id;

		ob_start();
		?>
		<div class="gatherpress-calendar__event-item" data-wp-context='{ "eventId": "<?php echo esc_attr( (string) $post_id ); ?>" }'>
			<a
				href="<?php echo esc_url( $post_url ); ?>"
				class="gatherpress-calendar__event"
				data-post-id="<?php echo esc_attr( (string) $post_id ); ?>"
				data-event-content="<?php echo esc_attr( $event_content_id ); ?>"
				data-popover-style="<?php echo esc_attr( $popover_styles ); ?>"
				<?php /* translators: %s Post title */ ?>
				aria-label="<?php echo esc_attr( sprintf( __( 'View event: %s', 'gatherpress-calendar' ), $post_title ) ); ?>"
				data-wp-on--click="actions.togglePopover"
				data-wp-on--keydown="actions.handleKeydown"
				role="button"
				tabindex="0"
			></a>
			<div
				id="<?php echo esc_attr( $event_content_id ); ?>"
				class="gatherpress-calendar__popover"
				data-wp-bind--hidden="!state.isCurrentEventOpen"
				data-wp-class--is-active="state.isCurrentEventOpen"
				data-wp-watch="callbacks.positionPopover"
				data-wp-on-window--resize="callbacks.onWindowChange"
				data-wp-on-window--scroll="callbacks.onWindowChange"
				hidden
			>
				<?php echo $inner_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		</div>
		<?php
		$output = ob_get_clean();
		return is_string( $output ) ? $output : '';
	}

	/**
	 * Prepare inner blocks instance for the popover template.
	 *
	 * @param WP_Block $block Block instance.
	 *
	 * @return array<string, mixed> Inner blocks instance.
	 */
	private function prepare_inner_blocks_instance( WP_Block $block ): array {
		$block_instance              = $block->parsed_block;
		$block_instance['blockName'] = 'core/null';
		$block_instance['innerHTML'] = '';
		$inner_content               = isset( $block_instance['innerContent'] ) && is_array( $block_instance['innerContent'] )
			? $block_instance['innerContent']
			: array();

		if ( count( $inner_content ) > 2 ) {
			array_pop( $inner_content );
			array_shift( $inner_content );
		}

		$block_instance['innerContent'] = array_values( $inner_content );

		return $block_instance;
	}
}