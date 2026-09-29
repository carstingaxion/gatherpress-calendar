<?php
/**
 * The "Calendar" class handles the functionality of the Calendar block.
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
 * Class Calendar.
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
	 * @param string               $block_type Block type name.
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
	 * Render callback for the calendar block.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Block inner content.
	 * @param WP_Block             $block      Block instance.
	 *
	 * @return string Rendered HTML.
	 */
	public function render_callback( array $attributes, string $content, WP_Block $block ): string {
		$query = $block->context['query'] ?? null;
		if ( ! is_array( $query ) || empty( $query ) ) {
			return '';
		}

		$query_id = isset( $block->context['queryId'] ) && is_numeric( $block->context['queryId'] ) && (int) $block->context['queryId'] > 0
			? (int) $block->context['queryId']
			: 0;
		$page_key = $query_id > 0 ? "query-{$query_id}-page" : 'query-page';
		$raw_page = isset( $_GET[ $page_key ] ) && is_scalar( $_GET[ $page_key ] ) ? $_GET[ $page_key ] : 1; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$page     = absint( $raw_page );
		if ( 0 === $page ) {
			$page = 1;
		}

		/** @var array<string, mixed> $query_typed */
		$query_typed = $query;
		$date_range  = Date_Calculator::get_range_from_query( $query_typed, $attributes, $page );

		// Propagate context tree for child blocks.
		$block->context['gatherpress/viewType']     = $date_range['view_type'];
		$block->context['gatherpress/year']         = $date_range['year'];
		$block->context['gatherpress/month']        = $date_range['month'];
		$block->context['gatherpress/startDate']    = $date_range['start_date'];
		$block->context['gatherpress/endDate']      = $date_range['end_date'];
		$block->context['gatherpress/showWeekends'] = ! isset( $attributes['showWeekends'] ) || ( false !== $attributes['showWeekends'] && 'false' !== $attributes['showWeekends'] );

		// Fetch and organize posts by date.
		$query_args    = Query_Builder::build_query_args( $block, $date_range );
		$posts_by_date = Post_Organizer::organize_posts_by_date( $query_args );

		// Assemble structure and delegate rendering.
		$start_of_week = get_option( 'start_of_week', 0 );
		$start_of_week = is_numeric( $start_of_week ) ? (int) $start_of_week : 0;
		$calendar_data = Calendar_Structure_Builder::build_structure( $date_range, $start_of_week, $posts_by_date, $block->context['gatherpress/showWeekends'] );

		// Generate HTML.
		$renderer = new HTML_Renderer( $block );
		return $renderer->generate_calendar_html( $attributes, $calendar_data );
	}
}
