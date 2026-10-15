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
	 * Build outer wrapper block attributes.
	 *
	 * @param string $view_type    View type.
	 * @param int    $unit_count   Number of units.
	 * @param bool   $is_time_grid Whether time grid is enabled.
	 *
	 * @return string HTML attribute string.
	 */
	private function build_wrapper_attributes( string $view_type, int $unit_count, bool $is_time_grid ): string {
		$classes = array( 'is-view-' . $view_type );
		if ( $unit_count > 1 ) {
			$classes[] = 'has-multiple-units';
		}
		if ( $is_time_grid ) {
			$classes[] = 'has-time-grid';
		}

		// A new key per date range makes client-side navigation mount a new
		// wrapper, so its init callback runs once for each new month. The
		// callback moves focus to the month heading (see src/calendar/view.js).
		$start_date = $this->block->context['gatherpress/startDate'] ?? '';

		return get_block_wrapper_attributes(
			array(
				'class'                      => implode( ' ', $classes ),
				'style'                      => sprintf( '--gatherpress-calendar-units: %d;', $unit_count ),
				'data-wp-interactive'        => 'gatherpress/calendar',
				'data-wp-key'                => 'calendar-' . ( is_string( $start_date ) ? $start_date : '' ),
				'data-wp-init'               => 'callbacks.focusAfterNavigation',
				'data-wp-on-document--click' => 'actions.rememberPagination',
			)
		);
	}

	/**
	 * Build inline style attribute string for a calendar table.
	 *
	 * @param array<string, mixed> $attributes    Block attributes.
	 * @param int                  $columns_count Number of table columns.
	 * @param array<string, mixed> $grid_config   Time grid configuration.
	 * @param bool                 $is_time_grid  Whether time grid is enabled.
	 *
	 * @return string Inline style attribute (e.g. style="...").
	 */
	private function build_table_style( array $attributes, int $columns_count, array $grid_config, bool $is_time_grid ): string {
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
		if ( $is_time_grid ) {
			$total_quarters = isset( $grid_config['total_quarters'] ) && is_numeric( $grid_config['total_quarters'] ) ? (int) $grid_config['total_quarters'] : 48;
			$table_styles[] = sprintf( '--gatherpress-total-quarter-slots: %d', $total_quarters );
		}

		return sprintf( 'style="%s;"', esc_attr( implode( '; ', $table_styles ) ) );
	}

	/**
	 * Render HTML for an individual unit table.
	 *
	 * @param array{caption: string, day_names: list<string>, weeks: list<list<array<string, mixed>>>} $unit                Individual calendar unit data.
	 * @param string                                                                                   $table_style         Inline style attribute string.
	 * @param bool                                                                                     $show_weekdays       Whether weekdays header is visible.
	 * @param bool                                                                                     $render_week_numbers Whether row headers for weeks are output.
	 * @param bool                                                                                     $is_time_grid        Whether time grid is enabled.
	 *
	 * @return string Rendered table HTML.
	 */
	private function render_unit_table( array $unit, string $table_style, bool $show_weekdays, bool $render_week_numbers, bool $is_time_grid ): string {
		$table_class = 'gatherpress-calendar__table' . ( $is_time_grid ? ' has-time-grid' : '' );
		$thead_class = $show_weekdays ? '' : ' class="gatherpress--screen-reader-text"';

		ob_start();
		?>
		<table class="<?php echo esc_attr( $table_class ); ?>" <?php echo $table_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php if ( '' !== $unit['caption'] ) { ?>
				<caption class="gatherpress--screen-reader-text"><?php echo esc_html( $unit['caption'] ); ?></caption>
			<?php } ?>
			<?php
			// Without "Show Weekdays", the header row is only hidden on screen:
			// screen readers still read the weekday of each cell. The class is
			// GatherPress core's General_Block::SCREEN_READER_CLASS, as on the caption.
			?>
			<thead<?php echo $thead_class; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
				<tr>
					<?php echo $this->render_header_cells( $unit['day_names'], $render_week_numbers, $is_time_grid ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</tr>
			</thead>
			<tbody>
				<?php
				// Rendered blocks escape their own output. wp_kses_post() here removed
				// aria-modal from modals, and SVG, form and iframe markup (#132).
				echo $this->render_calendar_weeks( $unit['weeks'], $render_week_numbers ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
			</tbody>
		</table>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Generate complete calendar HTML.
	 *
	 * @param array<string, mixed>                                                                                                                                                                                                                   $attributes    Block attributes.
	 * @param array{ heading: string, day_names: list<string>, weeks: list<list<array<string, mixed>>>, view_type: string, unit_count: int, units: list<array{ caption: string, day_names: list<string>, weeks: list<list<array<string, mixed>>>}> } $calendar_data Calendar structure.
	 * @param array<string, mixed>                                                                                                                                                                                                                   $grid_config   Time grid configuration.
	 *
	 * @return string Calendar HTML.
	 */
	public function generate_calendar_html( array $attributes, array $calendar_data, array $grid_config = array() ): string {
		// @phpstan-ignore-next-line
		$view_type     = $calendar_data['view_type'] ?? ( $attributes['viewType'] ?? 'month' );
		$unit_count    = $calendar_data['unit_count'];
		$show_weekends = isset( $attributes['showWeekends'] ) && is_bool( $attributes['showWeekends'] ) ? $attributes['showWeekends'] : true;
		$is_time_grid  = ! empty( $grid_config['enabled'] );
		$columns_count = Date_Calculator::get_columns_count( $view_type, $show_weekends, $unit_count, $is_time_grid );

		$wrapper_attributes = $this->build_wrapper_attributes( $view_type, $unit_count, $is_time_grid );
		$show_weekdays      = isset( $attributes['showWeekdays'] ) && is_bool( $attributes['showWeekdays'] ) ? $attributes['showWeekdays'] : true;
		// Only views with several week rows need to tell the rows apart.
		$render_week_numbers = 'month' === $view_type || ( 'week' === $view_type && $unit_count > 1 );
		$table_style         = $this->build_table_style( $attributes, $columns_count, $grid_config, $is_time_grid );

		ob_start();
		?>
		<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php
			// Render each unit's table.
			foreach ( $calendar_data['units'] as $unit ) {
				echo $this->render_unit_table( $unit, $table_style, $show_weekdays, $render_week_numbers, $is_time_grid ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render the column header cells of a table.
	 *
	 * @since 0.8.0
	 *
	 * @param string[] $day_names           Weekday names.
	 * @param bool     $render_week_numbers Whether rows get a week number header.
	 * @param bool     $is_time_grid        Whether time grid is active.
	 *
	 * @return string Escaped header cells HTML.
	 */
	private function render_header_cells( array $day_names, bool $render_week_numbers, bool $is_time_grid = false ): string {
		$cells = '';

		// Prepend empty header for the time gutter column.
		if ( $is_time_grid ) {
			$cells .= '<th scope="col" class="gatherpress-calendar__time-gutter-header" aria-hidden="true"></th>';
		}

		// Header for the hidden week number column, so the row headers line up.
		if ( $render_week_numbers ) {
			$cells .= sprintf( '<th scope="col" class="gatherpress--screen-reader-text">%s</th>', esc_html_x( 'Week', 'week number column header', 'gatherpress-calendar' ) );
		}

		foreach ( $day_names as $day_name ) {
			$cells .= sprintf( '<th scope="col">%s</th>', esc_html( $day_name ) );
		}

		return $cells;
	}

	/**
	 * Render calendar weeks by delegating to gatherpress/calendar-week blocks.
	 *
	 * @param list<list<array<string, mixed>>> $weeks               Weeks array.
	 * @param bool                             $render_week_numbers Whether rows get a week number header.
	 *
	 * @return string Weeks HTML, as the week blocks render it.
	 */
	private function render_calendar_weeks( array $weeks, bool $render_week_numbers = false ): string {
		ob_start();

		$week_template = self::get_inner_template_block( $this->block, Calendar_Week::BLOCK_NAME );
		$start_of_week = Date_Calculator::get_start_of_week();

		foreach ( $weeks as $week_index => $week_days ) {
			$week_context = array_merge(
				$this->block->context,
				array(
					'gatherpress/weekIndex'  => $week_index,
					'gatherpress/weekDays'   => $week_days,
					'gatherpress/weekNumber' => $render_week_numbers ? Date_Calculator::get_week_number( $week_days, $start_of_week ) : 0,
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