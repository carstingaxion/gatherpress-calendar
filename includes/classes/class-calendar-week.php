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
		$week_number  = is_numeric( $block->context['gatherpress/weekNumber'] ?? null ) ? (int) $block->context['gatherpress/weekNumber'] : 0;

		// Hidden row header, so screen readers announce the week when moving between rows.
		if ( $week_number > 0 ) {
			$days_html = sprintf(
				'<th scope="row" class="gatherpress--screen-reader-text">%s</th>',
				esc_html(
					sprintf(
						/* translators: %d: ISO 8601 week number. */
						__( 'Week %d', 'gatherpress-calendar' ),
						$week_number
					)
				)
			) . $days_html;
		}

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
		$output     = '';
		$total_cols = count( $week_days );

		foreach ( $week_days as $col_index => $day ) {
			if ( ! is_array( $day ) ) {
				continue;
			}

			// First column of row OR first day after leading padding cells.
			$is_first_col = ( 0 === $col_index ) || ! empty( $week_days[ $col_index - 1 ]['isEmpty'] );

			// Last column of row OR last day before trailing padding cells.
			$is_last_col = ( ( $total_cols - 1 ) === $col_index ) || ! empty( $week_days[ $col_index + 1 ]['isEmpty'] );

			$day_posts = is_array( $day['posts'] ?? null ) ? $day['posts'] : array();

			// Annotate multi-day events with week-boundary and month-boundary wrapping flags.
			foreach ( $day_posts as &$post_entry ) {
				if ( is_array( $post_entry ) ) {
					$day_idx    = (int) ( $post_entry['day_index'] ?? 1 );
					$total_days = (int) ( $post_entry['total_days'] ?? 1 );

					if ( $total_days > 1 ) {
						// Continued from the previous week row.
						$post_entry['is_continued'] = $is_first_col && $day_idx > 1;
						// Continues into the next week row.
						$post_entry['is_continues'] = $is_last_col && $day_idx < $total_days;

						// Calculate consecutive active columns this event covers in this row.
						$cols_left = 0;
						for ( $c = $col_index; $c < $total_cols; $c++ ) {
							if ( empty( $week_days[ $c ]['isEmpty'] ) ) {
								++$cols_left;
							}
						}
						$post_entry['row_span'] = max( 1, min( $total_days - $day_idx + 1, $cols_left ) );
					} else {
						$post_entry['row_span'] = 1;
					}
				}
			}
			unset( $post_entry );

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
