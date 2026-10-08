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
	 * @param string               $content    Block inner content.
	 * @param WP_Block             $block      Block instance.
	 *
	 * @return string Rendered HTML.
	 */
	public function render_callback( array $attributes, string $content, WP_Block $block ): string {
		if ( ! isset( $block->context['gatherpress/isEmpty'] ) ) {
			return '';
		}

		$is_empty     = ! empty( $block->context['gatherpress/isEmpty'] );
		$day_number   = is_numeric( $block->context['gatherpress/dayNumber'] ?? null ) ? (int) $block->context['gatherpress/dayNumber'] : 0;
		$day_date     = is_string( $block->context['gatherpress/dayDate'] ?? null ) ? $block->context['gatherpress/dayDate'] : '';
		$weekday      = is_string( $block->context['gatherpress/weekday'] ?? null ) ? $block->context['gatherpress/weekday'] : '';
		$cell_classes = $this->get_day_cell_classes( $block->context );

		$extra_attributes   = $this->build_cell_attributes( $cell_classes, $day_date, $is_empty, $weekday );
		$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );
		$cell_content       = '';

		if ( ! $is_empty && $day_number > 0 ) {
			$inner_blocks = is_array( $block->parsed_block['innerBlocks'] ?? null ) ? $block->parsed_block['innerBlocks'] : array();
			$cell_content = $this->render_day_cell_content( $block->context, $inner_blocks );
		}

		return sprintf(
			'<td %1$s>%2$s</td>',
			$wrapper_attributes,
			$cell_content
		);
	}

	/**
	 * Build cell attributes including key and interactivity directives.
	 *
	 * @param string[] $classes  CSS classes list.
	 * @param string   $day_date YYYY-MM-DD date string.
	 * @param bool     $is_empty Whether the cell is empty padding.
	 * @param string   $weekday  Weekday slug.
	 *
	 * @return array<string, string> Attributes for wrapper.
	 */
	private function build_cell_attributes( array $classes, string $day_date, bool $is_empty, string $weekday ): array {
		$cell_key = ! $is_empty && '' !== $day_date
			? 'day-' . $day_date
			: 'empty-' . ( '' !== $weekday ? $weekday : uniqid() );

		$attributes = array(
			'class'       => implode( ' ', $classes ),
			'data-wp-key' => $cell_key,
		);

		if ( $is_empty || '' === $day_date ) {
			return $attributes;
		}

		if ( $day_date === Date_Calculator::get_today() ) {
			$attributes['aria-current'] = 'date';
		}

		$context_json = wp_json_encode( array( 'date' => $day_date ) );

		$attributes['data-wp-interactive']        = 'gatherpress/calendar-day';
		$attributes['data-wp-context']            = is_string( $context_json ) ? $context_json : '{}';
		$attributes['data-wp-class--is-today']    = 'callbacks.isToday';
		$attributes['data-wp-class--is-past']     = 'callbacks.isPast';
		$attributes['data-wp-class--is-future']   = 'callbacks.isFuture';
		$attributes['data-wp-bind--aria-current'] = 'callbacks.ariaCurrent';

		return $attributes;
	}

	/**
	 * Resolve class names for a calendar day cell.
	 *
	 * @param array<mixed> $context Block context.
	 *
	 * @return list<string> Array of CSS classes.
	 */
	private function get_day_cell_classes( array $context ): array {
		$classes = array( 'gatherpress-calendar__day' );

		if ( ! empty( $context['gatherpress/isEmpty'] ) ) {
			$classes[] = 'is-empty';
		}

		if ( ! empty( $context['gatherpress/dayPosts'] ) ) {
			$classes[] = 'has-posts';
		}

		[ $weekday, $is_weekend ] = $this->resolve_weekday_and_weekend( $context );

		if ( $is_weekend ) {
			$classes[] = 'is-weekend';
		}

		if ( '' !== $weekday ) {
			$classes[] = 'is-' . sanitize_html_class( strtolower( $weekday ) );
		}

		if ( empty( $context['gatherpress/isEmpty'] ) ) {
			$day_date = is_string( $context['gatherpress/dayDate'] ?? null ) ? $context['gatherpress/dayDate'] : '';
			$classes  = array_merge( $classes, $this->get_temporal_classes( $day_date ) );
		}

		return $classes;
	}

	/**
	 * Resolve weekday slug and weekend status.
	 *
	 * @param array<mixed> $context Block context.
	 *
	 * @return array{0: string, 1: bool} Weekday slug and is_weekend flag.
	 */
	private function resolve_weekday_and_weekend( array $context ): array {
		$weekday    = is_string( $context['gatherpress/weekday'] ?? null ) ? $context['gatherpress/weekday'] : '';
		$is_weekend = ! empty( $context['gatherpress/isWeekend'] );
		$day_date   = is_string( $context['gatherpress/dayDate'] ?? null ) ? $context['gatherpress/dayDate'] : '';

		if ( '' === $weekday && '' !== $day_date ) {
			$ts         = strtotime( $day_date );
			$dow        = false !== $ts ? (int) gmdate( 'w', $ts ) : 0;
			$weekday    = Date_Calculator::get_weekday_slug( $dow );
			$is_weekend = Date_Calculator::is_weekend_day( $dow );
		}

		return array( $weekday, $is_weekend );
	}

	/**
	 * Resolve temporal CSS classes (is-today, past, future).
	 *
	 * @param string $day_date YYYY-MM-DD date string.
	 *
	 * @return list<string> Temporal classes.
	 */
	private function get_temporal_classes( string $day_date ): array {
		if ( '' === $day_date ) {
			return array();
		}

		$today = Date_Calculator::get_today();

		if ( $day_date === $today ) {
			return array( 'is-today' );
		}

		return $day_date < $today
			? array( 'is-past', 'past' )
			: array( 'is-future', 'future' );
	}

	/**
	 * Check if a block is a day number block with the gatherpress/calendar-day binding.
	 *
	 * @param array<string, mixed> $block Parsed block array.
	 *
	 * @return bool True if day number binding block.
	 */
	private function is_day_number_block( array $block ): bool {
		$attrs = $block['attrs'] ?? null;
		if ( ! is_array( $attrs ) ) {
			return false;
		}

		$metadata = $attrs['metadata'] ?? null;
		if ( ! is_array( $metadata ) ) {
			return false;
		}

		$bindings = $metadata['bindings'] ?? null;
		if ( ! is_array( $bindings ) ) {
			return false;
		}

		$content = $bindings['content'] ?? null;
		if ( ! is_array( $content ) ) {
			return false;
		}

		return 'gatherpress/calendar-day' === ( $content['source'] ?? '' );
	}

	/**
	 * Render day cell content.
	 *
	 * Days with posts render every top-level inner block in template order.
	 * Days without posts render only the day number, like the editor preview.
	 * Without a Day Number block in the template, no day number is added.
	 *
	 * @param array<mixed> $context      Day context.
	 * @param array<mixed> $inner_blocks Parsed inner blocks.
	 *
	 * @return string Rendered HTML.
	 */
	private function render_day_cell_content( array $context, array $inner_blocks ): string {
		$has_posts = ! empty( $context['gatherpress/dayPosts'] );
		$html      = '';

		foreach ( $inner_blocks as $inner ) {
			if ( ! is_array( $inner ) ) {
				continue;
			}

			/**
			 * Type safety.
			 *
			 * @var array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>} $inner_typed
			 */
			$inner_typed = $inner;

			if ( $has_posts || $this->is_day_number_block( $inner_typed ) ) {
				$html .= ( new WP_Block( $inner_typed, $context ) )->render();
			}
		}

		return $html;
	}
}
