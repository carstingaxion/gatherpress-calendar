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
	 * @param array<string, mixed>                                                                                                                                                                                                  $attributes Block attributes.
	 * @param array{ heading: string, day_names: list<string>, weeks: list<list<array<string, mixed>>>, view_type: string, unit_count: int, units: list<array{ day_names: list<string>, weeks: list<list<array<string, mixed>>>}> } $calendar_data Calendar structure.
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

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class' => implode( ' ', $classes ),
				'style' => sprintf( '--gatherpress-calendar-units: %d;', $unit_count ),
			)
		);
		$show_weekdays      = isset( $attributes['showWeekdays'] ) && is_bool( $attributes['showWeekdays'] ) ? $attributes['showWeekdays'] : true;

		$grid_gap     = Style_Processor::get_block_gap_value( $attributes );
		$table_styles = array(
			sprintf( '--gatherpress-calendar-columns: %d', $columns_count ),
		);
		if ( '' !== $grid_gap ) {
			$table_styles[] = sprintf( 'gap: %s', esc_attr( $grid_gap ) );
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
					<?php if ( $show_weekdays ) { ?>
						<thead>
							<tr>
								<?php foreach ( $unit['day_names'] as $day_name ) { ?>
									<th><?php echo esc_html( $day_name ); ?></th>
								<?php } ?>
							</tr>
						</thead>
					<?php } ?>
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