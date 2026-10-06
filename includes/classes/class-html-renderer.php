<?php
/**
 * GatherPress Calendar HTML Renderer
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use WP_Block;

/**
 * HTML_Renderer Class
 *
 * Generates HTML output for the calendar.
 *
 * @since 0.1.0
 */
class HTML_Renderer {

	/**
	 * Surrounding parent block.
	 *
	 * @var WP_Block
	 */
	private WP_Block $block;

	/**
	 * Constructor.
	 *
	 * @param WP_Block $block The parent gatherpress/calendar block instance.
	 */
	public function __construct( WP_Block $block ) {
		$this->block = $block;
	}

	/**
	 * Generate complete calendar HTML.
	 *
	 * @param array<string, mixed>                                                                                                                                                                                                                   $attributes Block attributes.
	 * @param array{ heading: string, day_names: list<string>, weeks: list<list<array<string, mixed>>>, view_type: string, unit_count: int, units: list<array{ caption: string, day_names: list<string>, weeks: list<list<array<string, mixed>>>}> } $calendar_data Calendar structure.
	 *
	 * @return string Calendar HTML.
	 */
	public function generate_calendar_html( array $attributes, array $calendar_data ): string {
		// @phpstan-ignore-next-line
		$view_type     = $calendar_data['view_type'] ?? ( $attributes['viewType'] ?? 'month' );
		$unit_count    = $calendar_data['unit_count'];
		$show_weekends = isset( $attributes['showWeekends'] ) && is_bool( $attributes['showWeekends'] ) ? $attributes['showWeekends'] : true;
		$columns_count = Date_Calculator::get_columns_count( $view_type, $show_weekends, $unit_count );

		$classes = array( 'is-view-' . $view_type );
		if ( $unit_count > 1 ) {
			$classes[] = 'has-multiple-units';
		}

		// A new key per date range makes client-side navigation mount a new
		// wrapper, so its init callback runs once for each new month. The
		// callback moves focus to the month heading (see src/calendar/view.js).
		$start_date         = $this->block->context['gatherpress/startDate'] ?? '';
		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'                      => implode( ' ', $classes ),
				'style'                      => sprintf( '--gatherpress-calendar-units: %d;', $unit_count ),
				'data-wp-interactive'        => 'gatherpress/calendar',
				'data-wp-key'                => 'calendar-' . ( is_string( $start_date ) ? $start_date : '' ),
				'data-wp-init'               => 'callbacks.focusAfterNavigation',
				'data-wp-on-document--click' => 'actions.rememberPagination',
			)
		);
		$show_weekdays      = isset( $attributes['showWeekdays'] ) && is_bool( $attributes['showWeekdays'] ) ? $attributes['showWeekdays'] : true;

		$grid_gap     = Style_Processor::get_block_gap_value( $attributes );
		$column_gap   = Style_Processor::get_block_column_gap_value( $attributes );
		$table_styles = array(
			sprintf( '--gatherpress-calendar-columns: %d', $columns_count ),
		);
		if ( '' !== $grid_gap ) {
			$table_styles[] = sprintf( 'gap: %s', esc_attr( $grid_gap ) );
		}
		// Only the column gap: day cells use it in calc() to stay square.
		if ( '' !== $column_gap ) {
			$table_styles[] = sprintf( '--gatherpress-calendar-column-gap: %s', esc_attr( $column_gap ) );
		}
		$table_style = sprintf( 'style="%s;"', esc_attr( implode( '; ', $table_styles ) ) );

		ob_start();
		?>
		<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php
			// Render each unit's table.
			foreach ( $calendar_data['units'] as $unit ) {
				?>
				<table class="gatherpress-calendar__table" <?php echo $table_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
					<?php if ( '' !== $unit['caption'] ) { ?>
						<caption class="gatherpress--screen-reader-text"><?php echo esc_html( $unit['caption'] ); ?></caption>
					<?php } ?>
					<?php
					// Without "Show Weekdays", the header row is only hidden on screen:
					// screen readers still read the weekday of each cell. The class is
					// GatherPress core's General_Block::SCREEN_READER_CLASS, as on the caption.
					?>
					<thead<?php echo $show_weekdays ? '' : ' class="gatherpress--screen-reader-text"'; ?>>
						<tr>
							<?php foreach ( $unit['day_names'] as $day_name ) { ?>
								<th scope="col"><?php echo esc_html( $day_name ); ?></th>
							<?php } ?>
						</tr>
					</thead>
					<tbody>
						<?php echo wp_kses_post( $this->render_calendar_weeks( $unit['weeks'] ) ); ?>
					</tbody>
				</table>
			<?php } ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render calendar weeks by delegating to gatherpress/calendar-week blocks.
	 *
	 * @param list<list<array<string, mixed>>> $weeks Weeks array.
	 *
	 * @return string Weeks HTML.
	 */
	private function render_calendar_weeks( array $weeks ): string {
		ob_start();

		$week_template = self::get_inner_template_block( $this->block, Calendar_Week::BLOCK_NAME );

		foreach ( $weeks as $week_index => $week_days ) {
			$week_context = array_merge(
				$this->block->context,
				array(
					'gatherpress/weekIndex' => $week_index,
					'gatherpress/weekDays'  => $week_days,
				)
			);

			$week_block = new WP_Block( $week_template, $week_context );
			echo $week_block->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		return (string) ob_get_clean();
	}

	/**
	 * Locate the inner template block by name within a block's innerBlocks,
	 * or generate a fallback structure.
	 *
	 * @param WP_Block $block      Parent block instance.
	 * @param string   $block_name Target inner block name.
	 *
	 * @return array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>} Parsed template block.
	 */
	public static function get_inner_template_block( WP_Block $block, string $block_name ): array {
		$inner_blocks = isset( $block->parsed_block['innerBlocks'] ) && is_array( $block->parsed_block['innerBlocks'] )
			? $block->parsed_block['innerBlocks']
			: array();

		foreach ( $inner_blocks as $inner_block ) {
			if ( is_array( $inner_block ) && ( $inner_block['blockName'] ?? '' ) === $block_name ) {
				/**
				 * Type safety.
				 *
				 * @var array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>, innerHTML?: string, innerContent?: array<mixed>} $inner_block
				 */
				return $inner_block;
			}
		}

		$fallback_inner_blocks  = isset( $block->parsed_block['innerBlocks'] ) && is_array( $block->parsed_block['innerBlocks'] ) ? $block->parsed_block['innerBlocks'] : array();
		$fallback_inner_html    = isset( $block->parsed_block['innerHTML'] ) && is_string( $block->parsed_block['innerHTML'] ) ? $block->parsed_block['innerHTML'] : '';
		$fallback_inner_content = isset( $block->parsed_block['innerContent'] ) && is_array( $block->parsed_block['innerContent'] ) ? $block->parsed_block['innerContent'] : array();

		return array(
			'blockName'    => $block_name,
			'attrs'        => array(),
			'innerBlocks'  => $fallback_inner_blocks,
			'innerHTML'    => $fallback_inner_html,
			'innerContent' => $fallback_inner_content,
		);
	}
}