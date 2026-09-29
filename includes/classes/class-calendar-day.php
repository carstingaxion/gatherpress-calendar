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
		// This is somehow called, when it shouldnt, so I try to guard this, even knowing this is stupid.
		if ( ! isset( $block->context['gatherpress/isEmpty'] ) ) {
			return '';
		}

		$is_empty   = ! empty( $block->context['gatherpress/isEmpty'] );
		$day_number = isset( $block->context['gatherpress/dayNumber'] ) && is_numeric( $block->context['gatherpress/dayNumber'] ) ? (int) $block->context['gatherpress/dayNumber'] : 0;
		$classes    = $this->get_day_cell_classes( $block->context );

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );
		$inner_blocks_raw   = isset( $block->parsed_block['innerBlocks'] ) && is_array( $block->parsed_block['innerBlocks'] ) ? $block->parsed_block['innerBlocks'] : array();
		$inner_blocks       = $this->find_day_inner_blocks( $inner_blocks_raw );
		$cell_content       = '';

		if ( ! $is_empty && $day_number > 0 ) {
			$cell_content = $this->render_day_cell_content( $block->context, $inner_blocks['day_number'], $inner_blocks['entries'] );
		}

		return sprintf(
			'<td %1$s>%2$s</td>',
			$wrapper_attributes,
			$cell_content
		);
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
		if ( ! empty( $context['gatherpress/isToday'] ) ) {
			$classes[] = 'is-today';
		}

		$weekday    = isset( $context['gatherpress/weekday'] ) && is_string( $context['gatherpress/weekday'] ) ? $context['gatherpress/weekday'] : '';
		$is_weekend = ! empty( $context['gatherpress/isWeekend'] );
		$day_date   = isset( $context['gatherpress/dayDate'] ) && is_string( $context['gatherpress/dayDate'] ) ? $context['gatherpress/dayDate'] : '';

		if ( '' === $weekday && '' !== $day_date ) {
			$ts         = strtotime( $day_date );
			$dow        = false !== $ts ? (int) gmdate( 'w', $ts ) : 0;
			$weekday    = Date_Calculator::get_weekday_slug( $dow );
			$is_weekend = Date_Calculator::is_weekend_day( $dow );
		}

		if ( $is_weekend ) {
			$classes[] = 'is-weekend';
		}
		if ( '' !== $weekday ) {
			$classes[] = 'is-' . sanitize_html_class( strtolower( $weekday ) );
		}

		return $classes;
	}

	/**
	 * Locate day number and entries inner blocks.
	 *
	 * @param array<mixed> $inner_blocks Parsed inner blocks.
	 *
	 * @return array{
	 *   day_number: array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>}|null,
	 *   entries: array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>}|null
	 * } Found blocks.
	 */
	private function find_day_inner_blocks( array $inner_blocks ): array {
		$day_number_block = null;
		$entries_block    = null;

		foreach ( $inner_blocks as $inner ) {
			if ( ! is_array( $inner ) ) {
				continue;
			}

			$attrs           = isset( $inner['attrs'] ) && is_array( $inner['attrs'] ) ? $inner['attrs'] : array();
			$metadata        = isset( $attrs['metadata'] ) && is_array( $attrs['metadata'] ) ? $attrs['metadata'] : array();
			$bindings        = isset( $metadata['bindings'] ) && is_array( $metadata['bindings'] ) ? $metadata['bindings'] : array();
			$content_binding = isset( $bindings['content'] ) && is_array( $bindings['content'] ) ? $bindings['content'] : array();
			$binding_source  = isset( $content_binding['source'] ) && is_string( $content_binding['source'] ) ? $content_binding['source'] : '';

			/** @var array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>} $inner_typed */
			$inner_typed = $inner;

			if ( null === $day_number_block && 'gatherpress/calendar-day' === $binding_source ) {
				$day_number_block = $inner_typed;
			}
			if ( null === $entries_block && 'gatherpress/calendar-entries' === ( $inner['blockName'] ?? '' ) ) {
				$entries_block = $inner_typed;
			}
		}

		return array(
			'day_number' => $day_number_block,
			'entries'    => $entries_block,
		);
	}

	/**
	 * Render day cell content (day number and events list).
	 *
	 * @param array<mixed>                                                                                                                                   $context          Day context.
	 * @param array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>}|null $day_number_block Bound day number block.
	 * @param array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>}|null $entries_block    Calendar entries block.
	 *
	 * @return string Rendered HTML.
	 */
	private function render_day_cell_content( array $context, ?array $day_number_block, ?array $entries_block ): string {
		$day_number      = isset( $context['gatherpress/dayNumber'] ) && is_numeric( $context['gatherpress/dayNumber'] ) ? (int) $context['gatherpress/dayNumber'] : 0;
		$day_number_html = null !== $day_number_block
			? ( new WP_Block( $day_number_block, $context ) )->render()
			: sprintf( '<p class="gatherpress-calendar__day-number">%s</p>', esc_html( (string) $day_number ) );

		$entries_html = null !== $entries_block
			? ( new WP_Block( $entries_block, $context ) )->render()
			: '';

		return $day_number_html . $entries_html;
	}
}
