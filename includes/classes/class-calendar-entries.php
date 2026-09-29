<?php
/**
 * The "Calendar_Entries" class handles rendering of the Calendar Entries block.
 *
 * Works like core/post-template: renders one entry per event in the day
 * (from the `gatherpress/dayPosts` context), using this block's own inner
 * blocks as the template for each event.
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
 * Class Calendar_Entries.
 */
class Calendar_Entries {

	/**
	 * Enforces a single instance of this class.
	 */
	use Singleton;

	/**
	 * Constant representing the Block Name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'gatherpress/calendar-entries';

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
	 * @param string               $block_type Block type name (e.g. 'gatherpress/calendar-entries').
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
	 * Render callback for the calendar entries list.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Block inner content (unused; markup is built manually).
	 * @param WP_Block             $block      Block instance.
	 *
	 * @return string Rendered HTML.
	 */
	public function render_callback( array $attributes, string $content, WP_Block $block ): string {
		$day_posts = isset( $block->context['gatherpress/dayPosts'] ) && is_array( $block->context['gatherpress/dayPosts'] )
			? $block->context['gatherpress/dayPosts']
			: array();

		if ( empty( $day_posts ) ) {
			return '';
		}

		$entries_styles = array();
		$grid_gap       = Style_Processor::get_block_gap_value( $attributes );
		if ( ! empty( $grid_gap ) ) {
			$entries_styles[] = sprintf( 'gap: %s', esc_attr( $grid_gap ) );
		}
		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'style' => esc_attr( implode( '; ', $entries_styles ) ),
			) 
		);

		$items_html = '';
		foreach ( $day_posts as $post_id ) {
			if ( is_int( $post_id ) ) {
				$items_html .= $this->render_event_item( $post_id, $block );
			}
		}

		return sprintf(
			'<div %1$s>%2$s</div>',
			$wrapper_attributes,  // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$items_html  // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}

	/**
	 * Render a single event entry with its innerBlocks content.
	 *
	 * @param int      $post_id        Post ID.
	 * @param WP_Block $block          The Calendar Entries block instance.
	 *
	 * @return string Event HTML with innerBlocks rendered.
	 */
	private function render_event_item( int $post_id, WP_Block $block ): string {
		$post = get_post( $post_id );
		if ( ! $post instanceof WP_Post ) {
			return '';
		}

		$this->original_post = ( isset( $GLOBALS['post'] ) && $GLOBALS['post'] instanceof WP_Post ) ? $GLOBALS['post'] : null;

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

		$attributes   = $block->parsed_block['attrs'];
		$entry_styles = $this->get_entry_styles_and_classes( $attributes );

		// Context filter for the template's inner blocks (core/post-title, event-date, etc.).
		$filter_block_context = static function ( array $context ) use ( $post_id, $post_type ): array {
			$context['postType'] = $post_type;
			$context['postId']   = $post_id;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );

		$inner_content = $this->render_template( $block->parsed_block['innerBlocks'] ?? array() );

		remove_filter( 'render_block_context', $filter_block_context, 1 );

		wp_reset_postdata();
		if ( isset( $GLOBALS['post'] ) ) {
			$GLOBALS['post'] = $this->original_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}

		// TODO: Maybe reuse as id attribute, 
		// and add the posts css classes here.
		$event_content_id = 'event-content-' . $post_id;

		ob_start();
		?>
		<div class="<?php echo esc_attr( $entry_styles['classnames'] ); ?>"<?php echo $entry_styles['inline_styles']; ?>>
			<?php echo $inner_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
		$output = ob_get_clean();
		return is_string( $output ) ? $output : '';
	}

	/**
	 * Builds CSS styles and classnames for an entry using wp_style_engine_get_styles.
	 *
	 * Handles color, border, shadow, and spacing (margin/padding).
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array{classnames: string, inline_styles: string} Resolved CSS class names and inline style attribute.
	 */
	private function get_entry_styles_and_classes( array $attributes ): array {
		$block_styles  = array();
		$extra_classes = array( 'gatherpress-calendar__entry' );

		/*
		-------------------------------------------------------------
		 * 1. COLOR (Text, Background, Gradient)
		 * ----------------------------------------------------------- */
		$color_styles = array();

		// Text color.
		if ( ! empty( $attributes['textColor'] ) ) {
			$color_styles['text'] = "var:preset|color|{$attributes['textColor']}";
		} elseif ( ! empty( $attributes['style']['color']['text'] ) ) {
			$color_styles['text'] = $attributes['style']['color']['text'];
		}

		// Background color.
		if ( ! empty( $attributes['backgroundColor'] ) ) {
			$color_styles['background'] = "var:preset|color|{$attributes['backgroundColor']}";
		} elseif ( ! empty( $attributes['style']['color']['background'] ) ) {
			$color_styles['background'] = $attributes['style']['color']['background'];
		}

		// Gradient.
		if ( ! empty( $attributes['gradient'] ) ) {
			$color_styles['gradient'] = "var:preset|gradient|{$attributes['gradient']}";
		} elseif ( ! empty( $attributes['style']['color']['gradient'] ) ) {
			$color_styles['gradient'] = $attributes['style']['color']['gradient'];
		}

		if ( ! empty( $color_styles ) ) {
			$block_styles['color'] = $color_styles;
		}

		if ( ! empty( $attributes['style']['elements']['link']['color']['text'] ) ) {
			$extra_classes[] = 'has-link-color';
		}

		/*
		-------------------------------------------------------------
		 * 2. BORDER (Radius, Color, Width, Style, Sides)
		 * ----------------------------------------------------------- */
		$border_styles = array();

		if ( ! empty( $attributes['borderColor'] ) ) {
			$border_styles['color'] = "var:preset|color|{$attributes['borderColor']}";
		}

		if ( ! empty( $attributes['style']['border'] ) && is_array( $attributes['style']['border'] ) ) {
			$border_styles = array_merge( $border_styles, $attributes['style']['border'] );
		}

		if ( ! empty( $border_styles ) ) {
			$block_styles['border'] = $border_styles;
		}

		/*
		-------------------------------------------------------------
		 * 3. SHADOW (Single level path)
		 * ----------------------------------------------------------- */
		$shadow = $attributes['style']['shadow'] ?? ( $attributes['shadow'] ?? null );
		if ( ! empty( $shadow ) && is_string( $shadow ) ) {
			$block_styles['shadow'] = ( strpos( $shadow, 'var:preset|' ) === 0 || strpos( $shadow, ' ' ) !== false )
				? $shadow
				: "var:preset|shadow|{$shadow}";
		}

		/*
		-------------------------------------------------------------
		 * 4. SPACING (Padding & Margin)
		 * ----------------------------------------------------------- */
		$spacing_styles = array();

		if ( ! empty( $attributes['style']['spacing']['padding'] ) ) {
			$spacing_styles['padding'] = $attributes['style']['spacing']['padding'];
		}

		if ( ! empty( $attributes['style']['spacing']['margin'] ) ) {
			$spacing_styles['margin'] = $attributes['style']['spacing']['margin'];
		}

		if ( ! empty( $spacing_styles ) ) {
			$block_styles['spacing'] = $spacing_styles;
		}

		/*
		-------------------------------------------------------------
		 * 5. COMPILE VIA STYLE ENGINE
		 * ----------------------------------------------------------- */
		// convert_vars_to_classnames MUST be false so that var:preset|spacing|...
		// converts to var(--wp--preset--spacing--...) instead of remaining raw.
		$styles = wp_style_engine_get_styles(
			$block_styles,
			array( 'convert_vars_to_classnames' => false )
		);

		$classnames = trim(
			implode(
				' ',
				array_filter(
					array_merge(
						$extra_classes,
						explode( ' ', $styles['classnames'] ?? '' )
					) 
				) 
			) 
		);

		$inline_styles = ! empty( $styles['css'] ) ? sprintf( ' style="%s"', esc_attr( $styles['css'] ) ) : '';

		return array(
			'classnames'    => $classnames,
			'inline_styles' => $inline_styles,
		);
	}

	/**
	 * Renders a set of parsed blocks (this block's own template) with
	 * whatever `render_block_context` filters are currently active - used
	 * to render the calendar-entries template once per event, with that event's
	 * postId/postType injected via the filter set up by the caller.
	 *
	 * @param array<int, array<string, mixed>> $parsed_blocks Parsed inner blocks (the template).
	 *
	 * @return string Rendered HTML.
	 */
	private function render_template( array $parsed_blocks ): string {
		if ( empty( $parsed_blocks ) ) {
			return '';
		}

		// Wrap the template blocks as the inner blocks of a no-op parent so
		// that WP_Block::render()'s own inner-blocks loop applies the
		// `render_block_context` filter to each of them.
		$wrapper_block = array(
			'blockName'    => 'core/null',
			'attrs'        => array(),
			'innerBlocks'  => $parsed_blocks,
			'innerHTML'    => '',
			'innerContent' => array_fill( 0, count( $parsed_blocks ), null ),
		);

		$output = ( new WP_Block( $wrapper_block ) )->render( array( 'dynamic' => false ) );

		return is_string( $output ) ? $output : '';
	}
}
