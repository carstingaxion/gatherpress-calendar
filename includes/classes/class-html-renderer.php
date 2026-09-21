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
 * - Event dots are now simple links
 * - InnerBlocks content renders in hidden containers
 * - JavaScript shows content in popover on click
 * - This creates valid HTML
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
	 * @param string                                                                                    $popover_styles Popover styles.
	 *
	 * @return string Calendar HTML.
	 */
	public function generate_calendar_html( array $attributes, array $calendar_data, string $popover_styles ): string {
		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'gatherpress-calendar-block' ) );
		$show_weekdays      = isset( $attributes['showWeekdays'] ) && is_bool( $attributes['showWeekdays'] ) ? $attributes['showWeekdays'] : true;

		ob_start();
		?>
		<div data-wp-interactive="<?php echo esc_attr( Calendar::STORE_NAME ); ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped --- get_block_wrapper_attributes() runs esc_attr() on every return ?>>
			<div 
				class="gatherpress-calendar"
				data-wp-init="callbacks.initCalendarObserver"
				data-wp-context='{
					"triggerRef": null,
					"customStyles": <?php echo wp_json_encode( $popover_styles ); ?>
				}'
			>
				<?php
				$grid_gap    = Style_Processor::get_block_gap_value( $attributes );
				$table_style = ! empty( $grid_gap ) ? sprintf( 'style="gap: %s;"', esc_attr( $grid_gap ) ) : '';
				?>
				<table class="gatherpress-calendar__table" <?php echo $table_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
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
						<?php echo wp_kses_post( $this->render_calendar_weeks( $calendar_data['weeks'], $popover_styles ) ); ?>
					</tbody>
				</table>
				<div 
					class="gatherpress-calendar__backdrop"
					data-wp-class--is-active="state.activeEventId"
					data-wp-on--click="actions.handleBackdropClick"
				></div>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}


	/**
	 * Render calendar weeks by delegating to gatherpress/calendar-week blocks.
	 *
	 * @param list<list<array<string, mixed>>> $weeks          Weeks array.
	 * @param string                           $popover_styles Popover styles.
	 *
	 * @return string Weeks HTML.
	 */
	private function render_calendar_weeks( array $weeks, string $popover_styles ): string {
		ob_start();

		$week_template = $this->get_week_template_block();

		foreach ( $weeks as $week_index => $week_days ) {
			$week_context = array_merge(
				$this->block->context,
				array(
					'gatherpress/weekIndex'     => $week_index,
					'gatherpress/weekDays'      => $week_days,
					'gatherpress/popoverStyles' => $popover_styles,
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
