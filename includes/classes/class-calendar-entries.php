<?php
/**
 * Handles rendering for the Calendar Entries block.
 *
 * @package GatherPressCalendar
 * @since 0.4.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use GatherPress\Core\Traits\Singleton;
use WP_Block;
use WP_Post;

/**
 * Class Calendar_Entries.
 */
class Calendar_Entries {

	use Singleton;

	const BLOCK_NAME = 'gatherpress/calendar-entries';

	private ?WP_Post $original_post = null;

	protected function __construct() {
		$this->setup_hooks();
	}

	protected function setup_hooks(): void {
		add_filter( 'register_block_type_args', array( $this, 'filter_block_type_args' ), 10, 2 );
	}

	public function filter_block_type_args( array $args, string $block_type ): array {
		if ( self::BLOCK_NAME === $block_type ) {
			$args['render_callback'] = array( $this, 'render_callback' );
		}

		return $args;
	}

	public function render_callback( array $attributes, string $content, WP_Block $block ): string {
		$day_posts = isset( $block->context['gatherpress/dayPosts'] ) && is_array( $block->context['gatherpress/dayPosts'] )
			? $block->context['gatherpress/dayPosts']
			: array();

		if ( empty( $day_posts ) ) {
			return '';
		}

		$popover_styles = isset( $block->context['gatherpress/popoverStyles'] ) && is_string( $block->context['gatherpress/popoverStyles'] )
			? $block->context['gatherpress/popoverStyles']
			: '';

		$layout      = isset( $attributes['layout'] ) && is_array( $attributes['layout'] ) ? $attributes['layout'] : array();
		$layout_type = $layout['type'] ?? 'default';
		$columns     = isset( $layout['columns'] ) ? max( 2, min( 6, (int) $layout['columns'] ) ) : 3;

		$classes = array( 'gatherpress-calendar__events' );
		$styles  = array();

		if ( 'grid' === $layout_type ) {
			$classes[] = 'is-layout-grid';
			$classes[] = 'columns-' . $columns;
			$styles[]  = '--gatherpress--columns: ' . $columns;
		} elseif ( 'list' === $layout_type ) {
			$classes[] = 'is-layout-list';
		} else {
			$classes[] = 'is-layout-flex';
		}

		$wrapper_args = array(
			'class' => implode( ' ', $classes ),
		);

		if ( ! empty( $styles ) ) {
			$wrapper_args['style'] = implode( '; ', $styles );
		}

		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$events_html        = $this->render_event_dots( $day_posts, $popover_styles, $block );

		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $events_html );
	}

	private function render_event_dots( array $post_ids, string $popover_styles, WP_Block $block ): string {
		$this->original_post = ( isset( $GLOBALS['post'] ) && $GLOBALS['post'] instanceof WP_Post ) ? $GLOBALS['post'] : null;

		ob_start();
		foreach ( $post_ids as $post_id ) {
			if ( is_int( $post_id ) ) {
				echo $this->render_single_event_dot( $post_id, $popover_styles, $block ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		}

		return (string) ob_get_clean();
	}

	private function render_single_event_dot( int $post_id, string $popover_styles, WP_Block $block ): string {
		$post = get_post( $post_id );
		if ( ! $post instanceof WP_Post ) {
			return '';
		}

		if ( isset( $GLOBALS['post'] ) ) {
			$GLOBALS['post'] = $post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}
		setup_postdata( $post );

		$post_type  = get_post_type( $post ) ?: 'post';
		$post_url   = get_permalink( $post_id ) ?: '';
		$post_title = the_title_attribute( array( 'echo' => false, 'post' => $post ) ) ?: '';

		$filter_block_context = static function ( array $context ) use ( $post_id, $post_type ): array {
			$context['postType'] = $post_type;
			$context['postId']   = $post_id;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );

		// Render popover using the innerBlocks of gatherpress/calendar-entries.
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
		return (string) ob_get_clean();
	}

	private function prepare_inner_blocks_instance( WP_Block $block ): array {
		$block_instance              = $block->parsed_block;
		$block_instance['blockName'] = 'core/null';
		$block_instance['innerHTML'] = '';

		$inner_content = isset( $block_instance['innerContent'] ) && is_array( $block_instance['innerContent'] )
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