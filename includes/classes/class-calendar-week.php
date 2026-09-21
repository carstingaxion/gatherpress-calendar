<?php
/**
 * The "Calendar_Week" class handles rendering for the Calendar Week block.
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
 * Class Calendar_Week.
 */
class Calendar_Week {

	use Singleton;

	const BLOCK_NAME = 'gatherpress/calendar-week';

	/**
	 * Constructor.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Set up hooks.
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
	 * @param string               $block_type Block type name.
	 *
	 * @return array<string, mixed> Filtered arguments.
	 */
	public function filter_block_type_args( array $args, string $block_type ): array {
		if ( self::BLOCK_NAME === $block_type ) {
			$args['render_callback'] = array( $this, 'render' );
		}

		return $args;
	}

	/**
	 * Render callback for the calendar week row.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Block inner content.
	 * @param WP_Block             $block      Block instance.
	 *
	 * @return string Rendered HTML <tr> row.
	 */
	public function render( array $attributes, string $content, WP_Block $block ): string {
		$week_days = isset( $block->context['gatherpress/weekDays'] ) && is_array( $block->context['gatherpress/weekDays'] )
			? $block->context['gatherpress/weekDays']
			: array();

		$popover_styles = isset( $block->context['gatherpress/popoverStyles'] ) && is_string( $block->context['gatherpress/popoverStyles'] )
			? $block->context['gatherpress/popoverStyles']
			: '';

		$today        = Date_Calculator::get_today();
		$day_template = $this->get_day_template_block( $block );

		ob_start();

		// Render the 7 days of this week using the Day template block.
		foreach ( $week_days as $day ) {
			$day_posts = isset( $day['posts'] ) && is_array( $day['posts'] ) ? $day['posts'] : array();
			$is_today  = isset( $day['date'] ) && is_string( $day['date'] ) && $day['date'] === $today;

			$day_context = array_merge(
				$block->context,
				array(
					'gatherpress/dayDate'       => $day['date'] ?? '',
					'gatherpress/dayNumber'     => $day['day'] ?? 0,
					'gatherpress/dayPosts'      => $day_posts,
					'gatherpress/isEmpty'       => ! empty( $day['isEmpty'] ),
					'gatherpress/isToday'       => $is_today,
					'gatherpress/popoverStyles' => $popover_styles,
				)
			);

			$day_block = new WP_Block( $day_template, $day_context );
			echo $day_block->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		$days_html = ob_get_clean();

		$classes            = array( 'gatherpress-calendar__week' );
		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

		return sprintf(
			'<tr %1$s>%2$s</tr>',
			$wrapper_attributes,
			$days_html
		);
	}

	/**
	 * Locate the gatherpress/calendar-day template block inside this week block.
	 *
	 * @param WP_Block $block The week block instance.
	 *
	 * @return array<string, mixed> Parsed day template block.
	 */
	private function get_day_template_block( WP_Block $block ): array {
		if ( ! empty( $block->parsed_block['innerBlocks'] ) ) {
			foreach ( $block->parsed_block['innerBlocks'] as $inner_block ) {
				if ( ( $inner_block['blockName'] ?? '' ) === Calendar_Day::BLOCK_NAME ) {
					return $inner_block;
				}
			}
		}

		// Fallback if no day block was found.
		return array(
			'blockName'    => Calendar_Day::BLOCK_NAME,
			'attrs'        => array(),
			'innerBlocks'  => $block->parsed_block['innerBlocks'] ?? array(),
			'innerHTML'    => $block->parsed_block['innerHTML'] ?? '',
			'innerContent' => $block->parsed_block['innerContent'] ?? array(),
		);
	}
}
