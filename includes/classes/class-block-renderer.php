<?php
/**
 * GatherPress Calendar Block Render
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use GatherPress\Core\Traits\Singleton;
use WP_Block;

/**
 * Block_Renderer Class
 *
 * Singleton class that orchestrates the rendering process by coordinating
 * all the specialized classes.
 *
 * @since 0.1.0
 */
class Block_Renderer {
	/**
	 * Enforces a single instance of this class.
	 */
	use Singleton;

	/**
	 * Start of week setting.
	 *
	 * @since 0.1.0
	 * @var int
	 */
	private int $start_of_week = 0;

	/**
	 * Constructor for the Block_Renderer class.
	 *
	 * Initializes and sets up various components of the plugin.
	 */
	protected function __construct() {
		$start_of_week_option = get_option( 'start_of_week', 0 );
		$this->start_of_week  = is_numeric( $start_of_week_option ) ? (int) $start_of_week_option : 0;
	}

	/**
	 * Render the calendar block.
	 *
	 * @since 0.1.0
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Block content.
	 * @param WP_Block            $block      Block instance.
	 *
	 * @return string Rendered HTML.
	 */
	public function render( array $attributes, string $content, WP_Block $block ): string {

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
		$query = $block->context['query'] ?? null;
		if ( ! is_array( $query ) || empty( $query ) ) {
			return '';
		}

		// Calculate target date.
		$target_date = Date_Calculator::calculate_target_date( $attributes );
		$year        = $target_date['year'];
		$month       = $target_date['month'];

		// Build query and fetch posts.
		$query_args    = Query_Builder::build_query_args( $block, $year, $month );
		$posts_by_date = Post_Organizer::organize_posts_by_date( $query_args );

		// Build calendar structure.
		$calendar_data = Calendar_Structure_Builder::build_structure( $year, $month, $this->start_of_week, $posts_by_date );

		// Prepare styles.
		$popover_styles = Style_Processor::prepare_popover_styles( $attributes );

		// Generate HTML.
		$renderer = new HTML_Renderer( $block );
		return $renderer->generate_calendar_html( $attributes, $calendar_data, $popover_styles );
	}
}
