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
	 * @since 0.1.0
	 * @var WP_Block
	 */
	private WP_Block $block;

	/**
	 * Today's date.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	private string $today = '';

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 * @param WP_Block $block The parent gatherpress/calendar block instance.
	 */
	public function __construct( WP_Block $block ) {
		$this->today = Date_Calculator::get_today();
		$this->block = $block;
	}

	/**
	 * Generate complete calendar HTML.
	 *
	 * @since 0.1.0
	 *
	 * @param array<string, mixed>                                                                      $attributes     Block attributes.
	 * @param array{month_name: string,day_names: list<string>,weeks: list<list<array<string, mixed>>>} $calendar_data  Calendar structure.
	 *
	 * @return string Calendar HTML.
	 */
	public function generate_calendar_html( array $attributes, array $calendar_data ): string {
		$show_weekends   = isset( $attributes['showWeekends'] ) && is_bool( $attributes['showWeekends'] ) ? $attributes['showWeekends'] : true;
		$columns_count   = $show_weekends ? 7 : 5;
		$wrapper_classes = array( 'gatherpress-calendar-block' );

		if ( ! $show_weekends ) {
			$wrapper_classes[] = 'is-hidden-weekends';
		}

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $wrapper_classes ) ) );
		$show_weekdays      = isset( $attributes['showWeekdays'] ) && is_bool( $attributes['showWeekdays'] ) ? $attributes['showWeekdays'] : true;

		ob_start();
		?>
		<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<div class="gatherpress-calendar">
				<?php
				$grid_gap     = Style_Processor::get_block_gap_value( $attributes );
				$table_styles = array(
					sprintf( '--gatherpress-calendar-columns: %d', $columns_count ),
				);
				if ( ! empty( $grid_gap ) ) {
					$table_styles[] = sprintf( 'gap: %s', esc_attr( $grid_gap ) );
				}

				$table_style   = sprintf( 'style="%s;"', esc_attr( implode( '; ', $table_styles ) ) );
				$table_classes = array( 'gatherpress-calendar__table' );
				if ( ! $show_weekends ) {
					$table_classes[] = 'is-hidden-weekends';
				}
				?>
				<table class="<?php echo esc_attr( implode( ' ', $table_classes ) ); ?>" <?php echo $table_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
					<?php if ( $show_weekdays ) { ?>
						<thead>
							<tr>
								<?php foreach ( $calendar_data['day_names'] as $day_name ) { ?>
									<th><?php echo esc_html( $day_name ); ?></th>
								<?php } ?>
							</tr>
						</thead>
					<?php } ?>
					<tbody>
						<?php echo wp_kses_post( $this->render_calendar_weeks( $calendar_data['weeks'] ) ); ?>
					</tbody>
				</table>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}


	/**
	 * Render calendar weeks by delegating to gatherpress/calendar-week blocks.
	 *
	 * @param list<list<array<string, mixed>>> $weeks          Weeks array.
	 *
	 * @return string Weeks HTML.
	 */
	private function render_calendar_weeks( array $weeks ): string {
		ob_start();

		$week_template = $this->get_week_template_block();

		foreach ( $weeks as $week_index => $week_days ) {
			$week_context = array_merge(
				$this->block->context,
				array(
					'gatherpress/weekIndex'     => $week_index,
					'gatherpress/weekDays'      => $week_days,
				)
			);
				
			$week_block = new WP_Block( $week_template, $week_context );
			echo $week_block->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		return (string) ob_get_clean();
	}

	/**
	 * Locate the gatherpress/calendar-week template block from innerBlocks.
	 *
	 * @return array<string, mixed> Parsed week template block.
	 */
	private function get_week_template_block(): array {
		if ( ! empty( $this->block->parsed_block['innerBlocks'] ) ) {
			foreach ( $this->block->parsed_block['innerBlocks'] as $inner_block ) {
				if ( ( $inner_block['blockName'] ?? '' ) === Calendar_Week::BLOCK_NAME ) {
					return $inner_block;
				}
			}
		}

		// Fallback structure.
		return array(
			'blockName'    => Calendar_Week::BLOCK_NAME,
			'attrs'        => array(),
			'innerBlocks'  => $this->block->parsed_block['innerBlocks'] ?? array(),
			'innerHTML'    => $this->block->parsed_block['innerHTML'] ?? '',
			'innerContent' => $this->block->parsed_block['innerContent'] ?? array(),
		);
	}
}
