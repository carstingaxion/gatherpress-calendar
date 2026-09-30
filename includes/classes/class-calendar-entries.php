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
		if ( '' !== $grid_gap ) {
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
			$wrapper_attributes, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$items_html // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}

	/**
	 * Render a single event entry with its innerBlocks content.
	 *
	 * @param int      $post_id Post ID.
	 * @param WP_Block $block   The Calendar Entries block instance.
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

		/**
		 * Type safety.
		 *
		 * @var array<string, mixed> $attributes
		 */
		$attributes   = isset( $block->parsed_block['attrs'] ) && is_array( $block->parsed_block['attrs'] ) ? $block->parsed_block['attrs'] : array();
		$entry_styles = $this->get_entry_styles_and_classes( $attributes );

		$filter_block_context = static function ( array $context ) use ( $post_id, $post_type ): array {
			$context['postType'] = $post_type;
			$context['postId']   = $post_id;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );
		$inner_blocks_raw = isset( $block->parsed_block['innerBlocks'] ) && is_array( $block->parsed_block['innerBlocks'] ) ? $block->parsed_block['innerBlocks'] : array();
		/**
		 * Type safety.
		 *
		 * @var array<int, array<string, mixed>> $inner_blocks
		 */
		$inner_blocks  = $inner_blocks_raw;
		$inner_content = $this->render_template( $inner_blocks );
		remove_filter( 'render_block_context', $filter_block_context, 1 );

		wp_reset_postdata();
		if ( isset( $GLOBALS['post'] ) ) {
			$GLOBALS['post'] = $this->original_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}

		$style_attribute = '' !== $entry_styles['inline_styles'] ? sprintf( ' style="%s"', esc_attr( $entry_styles['inline_styles'] ) ) : '';

		return sprintf(
			'<div class="%1$s"%2$s>%3$s</div>',
			esc_attr( $entry_styles['classnames'] ),
			$style_attribute,
			$inner_content
		);
	}

	/**
	 * Resolve a preset or inline color value from attributes or styles.
	 *
	 * @param array<string, mixed> $attributes  Block attributes.
	 * @param array<mixed>         $style_color Inline color style array.
	 * @param string               $named_attr  Named attribute key (e.g. 'textColor').
	 * @param string               $style_prop  Style property key (e.g. 'text').
	 * @param string               $preset_type Preset type ('color' or 'gradient').
	 *
	 * @return string Resolved CSS value or empty string.
	 */
	private function resolve_color_value( array $attributes, array $style_color, string $named_attr, string $style_prop, string $preset_type = 'color' ): string {
		$named_val = isset( $attributes[ $named_attr ] ) && is_string( $attributes[ $named_attr ] ) ? $attributes[ $named_attr ] : '';
		if ( '' !== $named_val ) {
			return "var:preset|{$preset_type}|{$named_val}";
		}

		$style_val = isset( $style_color[ $style_prop ] ) && is_string( $style_color[ $style_prop ] ) ? $style_color[ $style_prop ] : '';
		return '' !== $style_val ? $style_val : '';
	}

	/**
	 * Extract color styles from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array<string, string>
	 */
	private function extract_color_styles( array $attributes ): array {
		$color_styles = array();
		$style        = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$style_color  = isset( $style['color'] ) && is_array( $style['color'] ) ? $style['color'] : array();

		$mapping = array(
			'text'       => array( 'textColor', 'text', 'color' ),
			'background' => array( 'backgroundColor', 'background', 'color' ),
			'gradient'   => array( 'gradient', 'gradient', 'gradient' ),
		);

		foreach ( $mapping as $prop => $config ) {
			$value = $this->resolve_color_value( $attributes, $style_color, $config[0], $config[1], $config[2] );
			if ( '' !== $value ) {
				$color_styles[ $prop ] = $value;
			}
		}

		return $color_styles;
	}

	/**
	 * Checks whether link color is specified in attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return bool True if link color is set.
	 */
	private function has_link_color( array $attributes ): bool {
		$style      = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$elements   = isset( $style['elements'] ) && is_array( $style['elements'] ) ? $style['elements'] : array();
		$link       = isset( $elements['link'] ) && is_array( $elements['link'] ) ? $elements['link'] : array();
		$link_color = isset( $link['color'] ) && is_array( $link['color'] ) ? $link['color'] : array();

		return ! empty( $link_color['text'] );
	}

	/**
	 * Extract border styles from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array<string, mixed>
	 */
	private function extract_border_styles( array $attributes ): array {
		$border_styles = array();
		$border_color  = isset( $attributes['borderColor'] ) && is_string( $attributes['borderColor'] ) ? $attributes['borderColor'] : '';

		if ( '' !== $border_color ) {
			$border_styles['color'] = "var:preset|color|{$border_color}";
		}

		$style  = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$border = isset( $style['border'] ) && is_array( $style['border'] ) ? $style['border'] : array();

		foreach ( $border as $key => $val ) {
			if ( is_string( $key ) ) {
				$border_styles[ $key ] = $val;
			}
		}

		return $border_styles;
	}

	/**
	 * Extract shadow style from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return string|null Resolved shadow style or null.
	 */
	private function extract_shadow_style( array $attributes ): ?string {
		$style  = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$shadow = isset( $style['shadow'] ) && is_string( $style['shadow'] )
			? $style['shadow']
			: ( isset( $attributes['shadow'] ) && is_string( $attributes['shadow'] ) ? $attributes['shadow'] : null );

		if ( null === $shadow || '' === $shadow ) {
			return null;
		}

		if ( 0 === strpos( $shadow, 'var:preset|' ) || false !== strpos( $shadow, ' ' ) ) {
			return $shadow;
		}

		return "var:preset|shadow|{$shadow}";
	}

	/**
	 * Extract spacing styles from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array<string, mixed> Spacing styles.
	 */
	private function extract_spacing_styles( array $attributes ): array {
		$spacing_styles = array();
		$style          = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$spacing        = isset( $style['spacing'] ) && is_array( $style['spacing'] ) ? $style['spacing'] : array();

		if ( ! empty( $spacing['padding'] ) ) {
			$spacing_styles['padding'] = $spacing['padding'];
		}
		if ( ! empty( $spacing['margin'] ) ) {
			$spacing_styles['margin'] = $spacing['margin'];
		}

		return $spacing_styles;
	}

	/**
	 * Builds CSS styles and classnames for an entry using wp_style_engine_get_styles.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array{classnames: string, inline_styles: string} Resolved CSS class names and inline style values.
	 */
	private function get_entry_styles_and_classes( array $attributes ): array {
		$block_styles  = array();
		$extra_classes = array( 'gatherpress-calendar__entry' );

		if ( $this->has_link_color( $attributes ) ) {
			$extra_classes[] = 'has-link-color';
		}

		$color_styles = $this->extract_color_styles( $attributes );
		if ( ! empty( $color_styles ) ) {
			$block_styles['color'] = $color_styles;
		}

		$border_styles = $this->extract_border_styles( $attributes );
		if ( ! empty( $border_styles ) ) {
			$block_styles['border'] = $border_styles;
		}

		$shadow = $this->extract_shadow_style( $attributes );
		if ( null !== $shadow ) {
			$block_styles['shadow'] = $shadow;
		}

		$spacing_styles = $this->extract_spacing_styles( $attributes );
		if ( ! empty( $spacing_styles ) ) {
			$block_styles['spacing'] = $spacing_styles;
		}

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
						// @phpstan-ignore-next-line
						explode( ' ', $styles['classnames'] ?? '' )
					)
				)
			)
		);

		return array(
			'classnames'    => $classnames,
			// @phpstan-ignore-next-line
			'inline_styles' => $styles['css'] ?? '',
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

		// @phpstan-ignore-next-line
		return is_string( $output ) ? $output : '';
	}
}
