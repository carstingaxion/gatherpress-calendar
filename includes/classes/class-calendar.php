<?php
/**
 * The "Calendar" class handles the functionality of the Calendar block,
 * ensuring proper rendering and behavior for display.
 *
 * @package GatherPressCalendar
 * @since 0.4.0
 */

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use GatherPress\Core\Event;
use GatherPress\Core\Traits\Singleton;
use WP_Block;

/**
 * Class responsible for managing the "Calendar" block and its functionality,
 * including validation and rendering.
 *
 * @since 0.4.0
 */
final class Calendar {

	/**
	 * Enforces a single instance of this class.
	 */
	use Singleton;

	/**
	 * Constant representing the Block Name.
	 *
	 * @since 0.4.0
	 * @var string
	 */
	const BLOCK_NAME = 'gatherpress/calendar';

	/**
	 * Class constructor.
	 *
	 * This method initializes the object and sets up necessary hooks.
	 *
	 * @since 0.4.0
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Set up hooks for various purposes.
	 *
	 * This method adds hooks for different purposes as needed.
	 *
	 * @since 0.4.0
	 *
	 * @return void
	 */
	protected function setup_hooks(): void {
		$render_block_hook = sprintf( 'render_block_%s', self::BLOCK_NAME );

		add_filter( $render_block_hook, array( $this, 'render' ), 10, 3 );
	}

	/**
	 * Render the calendar block.
	 *
	 * @since 0.1.0
	 *
	 * @param string               $block_content The block content.
	 * @param array<string, mixed> $block         The full block, including name and attributes.
	 * @param WP_Block             $instance      The block instance.
	 *
	 * @return string Rendered HTML, empty string in case of problems.
	 */
	public function render( string $block_content, array $block, WP_Block $instance ): string {
		/**
		 * Extract and sanitize block attributes.
		 *
		 * @var array{
		 *   selectedMonth: string,
		 *   monthModifier: int,
		 *   templateConfigStyle: array<string, mixed>,
		 *   showMonthHeading: bool,
		 *   monthHeadingLevel: int,
		 *   showWeekdays: bool,
		 * } $attributes
		 */
		$attributes = $block['attrs'];

		// Enable Interactivity API for this block.
		wp_interactivity_state(
			'gatherpress/calendar',
			array(
				'popoverOpen'     => false,
				'popoverContent'  => '',
				'popoverStyles'   => array(),
				'popoverPosition' => array(
					'top'  => 0,
					'left' => 0,
				),
				'activeEventId'   => null,
			)
		);

		/**
		 * Validate query context.
		 *
		 * @var array<string, mixed>|null $query
		 */
		$query = $instance->context['query'] ?? null;
		if ( ! is_array( $query ) || empty( $query ) ) {
			return '';
		}

		// Calculate target date.
		$target_date = Date_Calculator::calculate_target_date( $attributes );
		$year        = $target_date['year'];
		$month       = $target_date['month'];

		// Build query and fetch posts.
		$query_args    = Query_Builder::build_query_args( $instance, $year, $month );
		$posts_by_date = Post_Organizer::organize_posts_by_date( $query_args );

		// Build calendar structure.
		$start_of_week = get_option( 'start_of_week', 0 );
		$calendar_data = Calendar_Structure_Builder::build_structure( $year, $month, $start_of_week, $posts_by_date );

		// Prepare styles.
		$popover_styles = Style_Processor::prepare_popover_styles( $attributes );

		// Generate HTML.
		$renderer = new HTML_Renderer( $instance );
		return $renderer->generate_calendar_html( $attributes, $calendar_data, $popover_styles );
	}
}
