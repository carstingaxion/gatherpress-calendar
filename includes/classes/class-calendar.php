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
class Calendar {

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
	 * Constant representing the name of the Interactivity API store.
	 *
	 * Identical assignment as in src/view.js
	 * for the calls to store().
	 *
	 * @since 0.4.0
	 * @var string
	 */
	const STORE_NAME = 'gatherpress/calendar';

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
	 * @param string               $content    Block inner content (event dots & popovers).
	 * @param WP_Block             $block      Block instance.
	 *
	 * @return string Rendered HTML.
	 */
	public function render_callback( array $attributes, string $content, WP_Block $block ): string {
		// Enable Interactivity API for this block.
		wp_interactivity_state(
			self::STORE_NAME,
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
		$query = $block->context['query'] ?? null;
		if ( ! is_array( $query ) || empty( $query ) ) {
			return '';
		}

		// Calculate target date.
		$target_date = Date_Calculator::calculate_target_date( $attributes );
		$year        = $target_date['year'];
		$month       = $target_date['month'];

		// Pass year/month into context tree for calendar-day consumers:
		$block->context['gatherpress/year']  = $year;
		$block->context['gatherpress/month'] = $month;

		// Build query and fetch posts.
		$query_args    = Query_Builder::build_query_args( $block, $year, $month );
		$posts_by_date = Post_Organizer::organize_posts_by_date( $query_args );

		// Build calendar structure.
		$start_of_week = get_option( 'start_of_week', 0 );
		$start_of_week = is_numeric( $start_of_week ) ? $start_of_week : 0;
		$calendar_data = Calendar_Structure_Builder::build_structure( $year, $month, $start_of_week, $posts_by_date );

		// Prepare styles.
		$popover_styles = Style_Processor::prepare_popover_styles( $attributes );

		// Generate HTML.
		$renderer = new HTML_Renderer( $block );
		return $renderer->generate_calendar_html( $attributes, $calendar_data, $popover_styles );
	}

}
