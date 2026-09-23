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

		$day_number = isset( $block->context['gatherpress/dayNumber'] ) ? (int) $block->context['gatherpress/dayNumber'] : 0;
		$is_empty   = ! empty( $block->context['gatherpress/isEmpty'] );
		$is_today   = ! empty( $block->context['gatherpress/isToday'] );
		$day_posts  = isset( $block->context['gatherpress/dayPosts'] ) && is_array( $block->context['gatherpress/dayPosts'] )
			? $block->context['gatherpress/dayPosts']
			: array();
		$has_posts  = ! empty( $day_posts );

		// Resolve weekend and weekday from context (with fallback if dayDate is present).
		$weekday = $block->context['gatherpress/weekday'] ?? '';
		if ( empty( $weekday ) && ! empty( $block->context['gatherpress/dayDate'] ) ) {
			$ts           = strtotime( (string) $block->context['gatherpress/dayDate'] );
			$dow          = false !== $ts ? (int) gmdate( 'w', $ts ) : 0;
			$weekday      = Date_Calculator::get_weekday_slug( $dow );
			$is_weekend   = Date_Calculator::is_weekend_day( $dow );
		} else {
			$is_weekend   = ! empty( $block->context['gatherpress/isWeekend'] );
		}

		$classes = array( 'gatherpress-calendar__day' );
		if ( $is_empty ) {
			$classes[] = 'is-empty';
		}
		if ( $has_posts ) {
			$classes[] = 'has-posts';
		}
		if ( $is_today ) {
			$classes[] = 'is-today';
		}
		if ( $is_weekend ) {
			$classes[] = 'is-weekend';
		}
		if ( ! empty( $weekday ) ) {
			$classes[] = 'is-' . sanitize_html_class( strtolower( (string) $weekday ) );
		}

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

		$day_number_block = null;
		$entries_block    = null;
		if ( ! empty( $block->parsed_block['innerBlocks'] ) ) {
			foreach ( $block->parsed_block['innerBlocks'] as $inner ) {
				if ( null === $day_number_block && ( $inner['attrs']['metadata']['bindings']['content']['source'] ?? '' ) === 'gatherpress/calendar-day' ) {
					$day_number_block = $inner;
				}
				if ( null === $entries_block && 'gatherpress/calendar-entries' === ( $inner['blockName'] ?? '' ) ) {
					$entries_block = $inner;
				}
			}
		}

		// Render the bound paragraph block with this day's context.
		$day_number_html = $day_number_block
			? ( new \WP_Block( $day_number_block, $block->context ) )->render()
			: sprintf( '<p class="gatherpress-calendar__day-number">%s</p>', esc_html( (string) $day_number ) );

		// Render the events list block (gatherpress/calendar-entries) with this day's context.
		$entries_html = $entries_block
			? ( new \WP_Block( $entries_block, $block->context ) )->render()
			: '';

		ob_start();
		?>
		<td <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php if ( ! $is_empty && $day_number > 0 ) { ?>
				<?php echo $day_number_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php echo $entries_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php } ?>
		</td>
		<?php
		return (string) ob_get_clean();
	}
}