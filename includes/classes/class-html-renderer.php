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
	 * Lowest opacity of the units without events.
	 *
	 * The day numbers have to stay readable, so WCAG 1.4.3 asks for a contrast
	 * of 4.5:1. At 30% the faded number is only 1.97:1 on the default colors
	 * (#111 on #fafafa). Fading a cell into the page background crosses 4.5:1
	 * at about 58%, so 60 is the lowest setting that passes with some headroom.
	 *
	 * Mirrors UNITS_WITHOUT_EVENTS_MIN_OPACITY in src/calendar/edit/constants.js.
	 *
	 * @since 0.9.0
	 * @var int
	 */
	const MIN_UNITS_WITHOUT_EVENTS_OPACITY = 60;

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

		// Without any posts, every unit would fade, so the fade is skipped here
		// and in the editor. An empty unit list means every unit was filtered
		// out, so the calendar shows a message instead of an empty block.
		$has_posts = $this->units_have_posts( $calendar_data['units'] );

		// A new key per date range makes client-side navigation mount a new
		// wrapper, so its init callback runs once for each new month. The
		// callback moves focus to the month heading (see src/calendar/view.js).
		$start_date         = $this->block->context['gatherpress/startDate'] ?? '';
		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'                      => implode( ' ', $classes ),
				'style'                      => $this->get_wrapper_style( $attributes, $unit_count, $has_posts ),
				'data-wp-interactive'        => 'gatherpress/calendar',
				'data-wp-key'                => 'calendar-' . ( is_string( $start_date ) ? $start_date : '' ),
				'data-wp-init'               => 'callbacks.focusAfterNavigation',
				'data-wp-on-document--click' => 'actions.rememberPagination',
			)
		);
		$show_weekdays      = isset( $attributes['showWeekdays'] ) && is_bool( $attributes['showWeekdays'] ) ? $attributes['showWeekdays'] : true;
		// Only views with several week rows need to tell the rows apart.
		$render_week_numbers = 'month' === $view_type || ( 'week' === $view_type && $unit_count > 1 );

		$table_style = $this->get_table_style( $attributes, $columns_count );

		ob_start();
		?>
		<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php if ( array() === $calendar_data['units'] ) { ?>
				<?php
				// Every unit was filtered out, because none had events. The visitor,
				// also with a screen reader, would otherwise see an empty block and
				// cannot tell a calm month from a broken calendar. Focus lands on this
				// message (see src/calendar/view.js), as there is no table to focus.
				?>
				<p class="gatherpress-calendar__no-events"><?php echo esc_html__( 'No events found.', 'gatherpress-calendar' ); ?></p>
			<?php } ?>
			<?php
			// Render each unit's table.
			foreach ( $calendar_data['units'] as $unit ) {
				?>
				<table class="<?php echo esc_attr( $this->get_table_class( $unit['weeks'] ) ); ?>" <?php echo $table_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
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
							<?php echo $this->render_header_cells( $unit['day_names'], $render_week_numbers ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
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
			<?php } ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Build the inline style of the calendar wrapper.
	 *
	 * @since 0.9.0
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param int                  $unit_count Number of rendered units.
	 * @param bool                 $has_posts  Whether any rendered unit has posts.
	 *
	 * @return string Inline CSS declarations.
	 */
	private function get_wrapper_style( array $attributes, int $unit_count, bool $has_posts = true ): string {
		$style = sprintf( '--gatherpress-calendar-units: %d;', $unit_count );

		// Fades the months, weeks or days that have no posts (see is-default.scss).
		// Without any posts every unit would fade, so the fade is skipped, as in
		// the editor (src/calendar/edit.js).
		if ( ! $has_posts ) {
			return $style;
		}

		$opacity = isset( $attributes['unitsWithoutEventsOpacity'] ) && is_numeric( $attributes['unitsWithoutEventsOpacity'] ) ? (int) $attributes['unitsWithoutEventsOpacity'] : 100;
		if ( $opacity < 100 ) {
			// Clamped, so values saved before the floor was added stay readable.
			$style .= sprintf( ' --gatherpress-calendar-units-without-events-opacity: %d%%;', max( self::MIN_UNITS_WITHOUT_EVENTS_OPACITY, $opacity ) );
		}

		return $style;
	}

	/**
	 * Whether any of the given units has posts.
	 *
	 * @since 0.9.0
	 *
	 * @param list<array{ caption: string, day_names: list<string>, weeks: list<list<array<string, mixed>>>}> $units Rendered units.
	 *
	 * @return bool Whether any unit has posts.
	 */
	private function units_have_posts( array $units ): bool {
		foreach ( $units as $unit ) {
			if ( Calendar_Structure_Builder::has_posts( array_merge( ...$unit['weeks'] ) ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Build the inline style attribute shared by the calendar tables.
	 *
	 * @since 0.9.0
	 *
	 * @param array<string, mixed> $attributes    Block attributes.
	 * @param int                  $columns_count Number of columns in the views.
	 *
	 * @return string Style attribute, ready to print.
	 */
	private function get_table_style( array $attributes, int $columns_count ): string {
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

		return sprintf( 'style="%s;"', esc_attr( implode( '; ', $table_styles ) ) );
	}

	/**
	 * Get the classes of a unit's table.
	 *
	 * @since 0.9.0
	 *
	 * @param list<list<array<string, mixed>>> $weeks Weeks of the unit.
	 *
	 * @return string Table classes, with "has-posts" when a day has posts.
	 */
	private function get_table_class( array $weeks ): string {
		return Calendar_Structure_Builder::has_posts( array_merge( ...$weeks ) ) ? 'gatherpress-calendar__table has-posts' : 'gatherpress-calendar__table';
	}

	/**
	 * Render the column header cells of a table.
	 *
	 * @since 0.8.0
	 *
	 * @param string[] $day_names           Weekday names.
	 * @param bool     $render_week_numbers Whether rows get a week number header.
	 *
	 * @return string Escaped header cells HTML.
	 */
	private function render_header_cells( array $day_names, bool $render_week_numbers ): string {
		$cells = '';

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