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
			$args['render_callback'] = array( $this, 'render_callback' );
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
	public function render_callback( array $attributes, string $content, WP_Block $block ): string {
		$week_days    = is_array( $block->context['gatherpress/weekDays'] ?? null ) ? $block->context['gatherpress/weekDays'] : array();
		$today        = Date_Calculator::get_today();
		$day_template = HTML_Renderer::get_inner_template_block( $block, Calendar_Day::BLOCK_NAME );
		$days_html    = $this->render_days( $week_days, $block, $day_template, $today );

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'       => 'gatherpress-calendar__week',
				'data-wp-key' => $this->get_row_key( $block->context ),
			)
		);

		return sprintf(
			'<tr %1$s>%2$s</tr>',
			$wrapper_attributes,
			$days_html
		);
	}

	/**
	 * Render all day blocks for a given week.
	 *
	 * @param array<mixed>                                                                                                                              $week_days    Array of week day entries.
	 * @param WP_Block                                                                                                                                  $block        Parent week block instance.
	 * @param array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>} $day_template Parsed day template block.
	 * @param string                                                                                                                                    $today        Today's date in Y-m-d format.
	 *
	 * @return string Rendered HTML of all day cells.
	 */
	private function render_days( array $week_days, WP_Block $block, array $day_template, string $today ): string {
		$output = '';

		foreach ( $week_days as $day ) {
			if ( ! is_array( $day ) ) {
				continue;
			}

			$day_posts   = is_array( $day['posts'] ?? null ) ? $day['posts'] : array();
			$day_date    = is_string( $day['date'] ?? null ) ? $day['date'] : '';
			$day_context = array_merge(
				$block->context,
				array(
					'gatherpress/dayDate'   => $day_date,
					'gatherpress/dayNumber' => $day['day'] ?? 0,
					'gatherpress/dayPosts'  => $day_posts,
					'gatherpress/isEmpty'   => ! empty( $day['isEmpty'] ),
					'gatherpress/isToday'   => '' !== $day_date && $day_date === $today,
					'gatherpress/weekday'   => $day['weekday'] ?? '',
					'gatherpress/isWeekend' => ! empty( $day['isWeekend'] ),
				)
			);

			$day_block = new WP_Block( $day_template, $day_context );
			$output   .= $day_block->render();
		}

		return $output;
	}

	/**
	 * Build unique key attribute for the week row.
	 *
	 * @param array<mixed> $context Block context.
	 *
	 * @return string Row key.
	 */
	private function get_row_key( array $context ): string {
		$year       = is_numeric( $context['gatherpress/year'] ?? null ) ? (int) $context['gatherpress/year'] : 0;
		$month      = is_numeric( $context['gatherpress/month'] ?? null ) ? (int) $context['gatherpress/month'] : 0;
		$week_index = is_numeric( $context['gatherpress/weekIndex'] ?? null ) ? (int) $context['gatherpress/weekIndex'] : 0;

		return sprintf( 'week-%d-%d-%d', $year, $month, $week_index );
	}
}
