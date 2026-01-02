<?php
/**
 * GatherPress Calendar Block Render Template
 *
 * This file handles the server-side rendering of the GatherPress Calendar block
 * using a singleton pattern for better performance and code organization.
 * It generates a monthly calendar view with posts placed on their respective dates,
 * properly utilizing the Query Loop context and respecting WordPress settings.
 *
 * Architecture:
 * - Singleton pattern: Prevents multiple instantiations and manages state
 * - Dynamic block: Uses PHP rendering instead of static HTML
 * - Query Loop integration: Reads parent Query Loop context
 * - Date filtering: Injects date_query to optimize post fetching
 * - Template system: Renders inner blocks for each post
 * - Progressive enhancement: Creates semantic HTML that works without JS
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content (inner blocks).
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

namespace GatherPress\Calendar;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( '\GatherPress\Calendar\Block_Renderer' ) ) :
	/**
	 * Block_Renderer Class
	 *
	 * Singleton class responsible for rendering the GatherPress Calendar block.
	 * Handles all calendar generation, date calculations, and post organization logic.
	 *
	 * @since 0.1.0
	 */
	final class Block_Renderer {

		/**
		 * Singleton instance.
		 *
		 * @since 0.1.0
		 * @var Block_Renderer|null
		 */
		private static ?Block_Renderer $instance = null;

		/**
		 * Current year being rendered.
		 *
		 * @since 0.1.0
		 * @var int
		 */
		private int $year;

		/**
		 * Current month being rendered (1-12).
		 *
		 * @since 0.1.0
		 * @var int
		 */
		private int $month;

		/**
		 * Start of week setting (0=Sunday, 1=Monday, etc.).
		 *
		 * @since 0.1.0
		 * @var int
		 */
		private int $start_of_week;

		/**
		 * Posts organized by date.
		 *
		 * Format: array( 'YYYY-MM-DD' => array( post_id1, post_id2, ... ) )
		 *
		 * @since 0.1.0
		 * @var array<string, array<int>>
		 */
		private array $posts_by_date = array();

		/**
		 * Today's date in Y-m-d format.
		 *
		 * @since 0.1.0
		 * @var string
		 */
		private string $today;

		/**
		 * Original global post object for restoration.
		 *
		 * @since 0.1.0
		 * @var \WP_Post|null
		 */
		private ?\WP_Post $original_post = null;

		/**
		 * Constructor.
		 *
		 * Private to enforce singleton pattern.
		 *
		 * @since 0.1.0
		 */
		private function __construct() {
			// Initialize start_of_week from WordPress settings
			$this->start_of_week = (int) get_option( 'start_of_week', 0 );
			
			// Initialize today's date using site timezone
			$this->today = gmdate( 'Y-m-d', current_time( 'timestamp' ) );
		}

		/**
		 * Get singleton instance.
		 *
		 * Creates the instance if it doesn't exist, or returns the existing instance.
		 * This ensures only one renderer exists throughout the request lifecycle.
		 *
		 * @since 0.1.0
		 *
		 * @return Block_Renderer The singleton instance.
		 */
		public static function get_instance(): Block_Renderer {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Prevent cloning of the instance.
		 *
		 * @since 0.1.0
		 *
		 * @return void
		 */
		private function __clone() {
			// Singleton - prevent cloning
		}

		/**
		 * Prevent unserializing of the instance.
		 *
		 * @since 0.1.0
		 *
		 * @return void
		 */
		public function __wakeup() {
			throw new \Exception( 'Cannot unserialize singleton' );
		}

		/**
		 * Render the calendar block.
		 *
		 * Main entry point for block rendering. Orchestrates the entire rendering process:
		 * 1. Validates query context
		 * 2. Calculates target month
		 * 3. Fetches posts
		 * 4. Organizes posts by date
		 * 5. Generates calendar HTML
		 *
		 * @since 0.1.0
		 *
		 * @param array     $attributes Block attributes containing selectedMonth and monthModifier.
		 * @param string    $content    Block default content (inner blocks).
		 * @param \WP_Block $block      Block instance with context from parent Query Loop.
		 *
		 * @return string Rendered block HTML or empty string if invalid context.
		 */
		public function render( array $attributes, string $content, \WP_Block $block ): string {
			// Store original global post for restoration
			$this->original_post = $GLOBALS['post'] ?? null;

			// Get query context from parent Query Loop block
			$query = $block->context['query'] ?? array();
			if ( empty( $query ) ) {
				return '';
			}

			// Calculate target month and year
			$this->calculate_target_date( $attributes );

			// Fetch and organize posts
			$query_args = $this->build_query_args( $block, $query );
			$this->organize_posts_by_date( $query_args );

			// Generate calendar HTML
			$html = $this->generate_calendar_html( $attributes, $block );

			// Restore original global post
			wp_reset_postdata();
			$GLOBALS['post'] = $this->original_post;

			return $html;
		}

		/**
		 * Calculate target date based on attributes.
		 *
		 * Determines which year and month to display based on:
		 * 1. Explicit month selection (selectedMonth attribute)
		 * 2. Current month with modifier (monthModifier attribute)
		 *
		 * Sets $this->year and $this->month properties.
		 *
		 * @since 0.1.0
		 *
		 * @param array $attributes Block attributes.
		 *
		 * @return void
		 */
		private function calculate_target_date( array $attributes ): void {
			$selected_month = $attributes['selectedMonth'] ?? '';
			$month_modifier = $attributes['monthModifier'] ?? 0;

			if ( ! empty( $selected_month ) && preg_match( '/^\d{4}-\d{2}$/', $selected_month ) ) {
				// Use selected month (ignore monthModifier when explicit month is set)
				list( $year, $month ) = explode( '-', $selected_month );
				$this->year  = (int) $year;
				$this->month = (int) $month;
			} else {
				// Use current month with modifier
				$now = current_time( 'timestamp' );

				// Apply month modifier if no explicit month is selected
				if ( 0 !== $month_modifier ) {
					/**
					 * Calculate target month using strtotime relative format.
					 *
					 * Why sprintf with %+d:
					 * - Ensures the sign (+ or -) is always included
					 * - Makes strtotime parse it correctly as relative
					 *
					 * Examples:
					 * - sprintf( '%+d months', -1 ) => '-1 months' (last month)
					 * - sprintf( '%+d months', 1 )  => '+1 months' (next month)
					 * - sprintf( '%+d months', 0 )  => '+0 months' (current month)
					 */
					$target_timestamp = strtotime( sprintf( '%+d months', $month_modifier ), $now );
					$this->year       = (int) gmdate( 'Y', $target_timestamp );
					$this->month      = (int) gmdate( 'n', $target_timestamp );
				} else {
					$this->year  = (int) gmdate( 'Y', $now );
					$this->month = (int) gmdate( 'n', $now );
				}
			}
		}

		/**
		 * Build query arguments from Query Loop context.
		 *
		 * Converts Query Loop settings to WP_Query arguments and adds:
		 * - Pagination support
		 * - Date filtering for the target month
		 *
		 * @since 0.1.0
		 *
		 * @param \WP_Block $block Block instance with context.
		 * @param array     $query Query parameters from parent Query Loop.
		 *
		 * @return array WP_Query compatible arguments.
		 */
		private function build_query_args( \WP_Block $block, array $query ): array {
			$query_id = $block->context['queryId'] ?? 0;
			$page     = empty( $_GET[ 'query-' . $query_id . '-page' ] ) ? 1 : (int) $_GET[ 'query-' . $query_id . '-page' ];

			$query['paged'] = $page;
			$query_args     = build_query_vars_from_query_block( $block, $page );

			/**
			 * Add date query parameters to filter posts by year and month.
			 *
			 * This optimization limits the database query to only fetch posts within
			 * the displayed month, improving performance for large post archives.
			 *
			 * date_query format:
			 * array(
			 *   array(
			 *     'year' => 2025,  // Four-digit year
			 *     'month' => 1,    // Month number 1-12
			 *   )
			 * )
			 *
			 * @see https://developer.wordpress.org/reference/classes/wp_query/#date-parameters
			 */
			$query_args['date_query'] = array(
				array(
					'year'  => $this->year,
					'month' => $this->month,
				),
			);

			return $query_args;
		}

		/**
		 * Organize posts by date for quick lookup.
		 *
		 * Executes the query and creates a lookup table mapping dates to post IDs.
		 * For GatherPress events, uses event start date; for other posts, uses publication date.
		 *
		 * Sets $this->posts_by_date property.
		 *
		 * @since 0.1.0
		 *
		 * @param array $query_args WP_Query arguments.
		 *
		 * @return void
		 */
		private function organize_posts_by_date( array $query_args ): void {
			$this->posts_by_date = array();
			$query_loop          = new \WP_Query( $query_args );

			while ( $query_loop->have_posts() ) {
				$query_loop->the_post();
				$post_id = get_the_ID();

				// Determine which date to use based on post type
				if ( 'gatherpress_event' === get_post_type( $post_id ) && class_exists( '\GatherPress\Core\Event' ) ) {
					// For GatherPress events, use event start date
					$event     = new \GatherPress\Core\Event( $post_id );
					$post_date = $event->get_datetime_start( 'Y-m-d' );
				} else {
					// For other post types, use publication date
					$post_date = get_the_date( 'Y-m-d' );
				}

				// Group posts by date
				if ( ! isset( $this->posts_by_date[ $post_date ] ) ) {
					$this->posts_by_date[ $post_date ] = array();
				}
				$this->posts_by_date[ $post_date ][] = $post_id;
			}

			wp_reset_postdata();
		}

		/**
		 * Generate complete calendar HTML.
		 *
		 * Orchestrates the HTML generation by:
		 * 1. Getting block wrapper attributes
		 * 2. Calculating calendar structure
		 * 3. Preparing popover styles
		 * 4. Rendering calendar table
		 *
		 * @since 0.1.0
		 *
		 * @param array     $attributes Block attributes.
		 * @param \WP_Block $block      Block instance.
		 *
		 * @return string Complete calendar HTML.
		 */
		private function generate_calendar_html( array $attributes, \WP_Block $block ): string {
			$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'gatherpress-calendar-block' ) );
			$calendar_data      = $this->calculate_calendar_structure();
			$popover_styles     = $this->prepare_popover_styles( $attributes );

			ob_start();
			?>
			<div <?php echo $wrapper_attributes; ?>>
				<div class="gatherpress-calendar">
					<h2 class="gatherpress-calendar__month"><?php echo esc_html( $calendar_data['month_name'] ); ?></h2>
					<table class="gatherpress-calendar__table">
						<thead>
							<tr>
								<?php foreach ( $calendar_data['day_names'] as $day_name ) : ?>
									<th><?php echo esc_html( $day_name ); ?></th>
								<?php endforeach; ?>
							</tr>
						</thead>
						<tbody>
							<?php echo $this->render_calendar_weeks( $calendar_data['weeks'], $popover_styles, $block ); ?>
						</tbody>
					</table>
				</div>
			</div>
			<?php
			return ob_get_clean();
		}

		/**
		 * Calculate calendar structure.
		 *
		 * Computes all data needed to render the calendar:
		 * - Month name and year
		 * - Day names array (respecting start_of_week)
		 * - Weeks array with day objects
		 *
		 * @since 0.1.0
		 *
		 * @return array Calendar data structure with keys:
		 *               - month_name: Formatted month and year string
		 *               - day_names: Array of translated day name strings
		 *               - weeks: Array of weeks, each containing 7 days
		 */
		private function calculate_calendar_structure(): array {
			$first_day      = mktime( 0, 0, 0, $this->month, 1, $this->year );
			$days_in_month  = (int) gmdate( 't', $first_day );
			$start_day_week = (int) gmdate( 'w', $first_day );
			$month_name     = wp_date( 'F Y', $first_day );

			/**
			 * Adjust start day based on start_of_week setting.
			 *
			 * This calculation shifts the calendar grid so it starts on the configured day.
			 *
			 * Math explanation:
			 * - ( $start_day_week - $this->start_of_week + 7 ) ensures positive result
			 * - % 7 wraps around (e.g., day 8 becomes day 1)
			 *
			 * Examples:
			 * - First day is Wednesday (3), start_of_week is Monday (1): (3-1+7)%7 = 2 (2 empty cells)
			 * - First day is Sunday (0), start_of_week is Monday (1): (0-1+7)%7 = 6 (6 empty cells)
			 */
			$start_day_week = ( $start_day_week - $this->start_of_week + 7 ) % 7;

			return array(
				'month_name' => $month_name,
				'day_names'  => $this->get_day_names(),
				'weeks'      => $this->build_weeks( $start_day_week, $days_in_month ),
			);
		}

		/**
		 * Get translated day names based on start_of_week setting.
		 *
		 * Uses WordPress core's wp_date() function to get properly localized day names.
		 * The order is adjusted based on start_of_week setting.
		 *
		 * @since 0.1.0
		 *
		 * @return array Array of translated day name strings.
		 */
		private function get_day_names(): array {
			$day_names = array();

			for ( $i = 0; $i < 7; $i++ ) {
				// Calculate the day of week (0=Sunday, 6=Saturday)
				$day_of_week = ( $this->start_of_week + $i ) % 7;

				// Create a timestamp for a date with this day of week
				// Using a known week: 2024-01-07 is a Sunday (day 0)
				$base_sunday   = strtotime( '2024-01-07' );
				$day_timestamp = $base_sunday + ( $day_of_week * DAY_IN_SECONDS );

				// Get the abbreviated day name using wp_date for proper localization
				// 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.)
				$day_names[] = wp_date( 'D', $day_timestamp );
			}

			return $day_names;
		}

		/**
		 * Build weeks array for the calendar.
		 *
		 * Creates a 2D array structure where each week contains 7 days.
		 * Includes empty days before and after the month to complete the grid.
		 *
		 * @since 0.1.0
		 *
		 * @param int $start_day_week Number of empty days before month starts.
		 * @param int $days_in_month  Number of days in the month.
		 *
		 * @return array Array of weeks, each containing 7 day objects.
		 */
		private function build_weeks( int $start_day_week, int $days_in_month ): array {
			$weeks        = array();
			$current_week = array();

			// Fill initial empty days before the month starts
			for ( $i = 0; $i < $start_day_week; $i++ ) {
				$current_week[] = array( 'isEmpty' => true );
			}

			// Fill days with posts
			for ( $day = 1; $day <= $days_in_month; $day++ ) {
				$date_str  = sprintf( '%04d-%02d-%02d', $this->year, $this->month, $day );
				$day_posts = $this->posts_by_date[ $date_str ] ?? array();

				$current_week[] = array(
					'day'     => $day,
					'date'    => $date_str,
					'posts'   => $day_posts,
					'isEmpty' => false,
				);

				// When week is complete (7 days), start a new week
				if ( 7 === count( $current_week ) ) {
					$weeks[]      = $current_week;
					$current_week = array();
				}
			}

			// Fill remaining empty days after the month ends
			while ( count( $current_week ) > 0 && count( $current_week ) < 7 ) {
				$current_week[] = array( 'isEmpty' => true );
			}

			if ( count( $current_week ) > 0 ) {
				$weeks[] = $current_week;
			}

			return $weeks;
		}

		/**
		 * Prepare popover inline styles from attributes.
		 *
		 * Converts templateConfigStyle attribute to inline CSS styles string
		 * for popover styling on the frontend.
		 *
		 * @since 0.1.0
		 *
		 * @param array $attributes Block attributes.
		 *
		 * @return string Inline style attribute value.
		 */
		private function prepare_popover_styles( array $attributes ): string {
			$template_config_style = $attributes['templateConfigStyle'] ?? array();
			$popover_styles        = array();

			if ( ! empty( $template_config_style['backgroundColor'] ) ) {
				$popover_styles[] = 'background-color: ' . esc_attr( $template_config_style['backgroundColor'] );
			}

			if ( ! empty( $template_config_style['padding'] ) ) {
				$padding = $template_config_style['padding'];
				if ( is_array( $padding ) ) {
					$padding_str  = '';
					$padding_str .= isset( $padding['top'] ) ? esc_attr( $padding['top'] ) . ' ' : '0 ';
					$padding_str .= isset( $padding['right'] ) ? esc_attr( $padding['right'] ) . ' ' : '0 ';
					$padding_str .= isset( $padding['bottom'] ) ? esc_attr( $padding['bottom'] ) . ' ' : '0 ';
					$padding_str .= isset( $padding['left'] ) ? esc_attr( $padding['left'] ) : '0';
					$popover_styles[] = 'padding: ' . trim( $padding_str );
				} elseif ( is_string( $padding ) ) {
					$popover_styles[] = 'padding: ' . esc_attr( $padding );
				}
			}

			if ( ! empty( $template_config_style['borderWidth'] ) ) {
				$popover_styles[] = 'border-width: ' . esc_attr( $template_config_style['borderWidth'] );
			}

			if ( ! empty( $template_config_style['borderStyle'] ) ) {
				$popover_styles[] = 'border-style: ' . esc_attr( $template_config_style['borderStyle'] );
			}

			if ( ! empty( $template_config_style['borderColor'] ) ) {
				$popover_styles[] = 'border-color: ' . esc_attr( $template_config_style['borderColor'] );
			}

			if ( ! empty( $template_config_style['borderRadius'] ) ) {
				$border_radius = $template_config_style['borderRadius'];
				if ( is_array( $border_radius ) ) {
					$radius_str  = '';
					$radius_str .= isset( $border_radius['topLeft'] ) ? esc_attr( $border_radius['topLeft'] ) . ' ' : '0 ';
					$radius_str .= isset( $border_radius['topRight'] ) ? esc_attr( $border_radius['topRight'] ) . ' ' : '0 ';
					$radius_str .= isset( $border_radius['bottomRight'] ) ? esc_attr( $border_radius['bottomRight'] ) . ' ' : '0 ';
					$radius_str .= isset( $border_radius['bottomLeft'] ) ? esc_attr( $border_radius['bottomLeft'] ) : '0';
					$popover_styles[] = 'border-radius: ' . trim( $radius_str );
				} elseif ( is_string( $border_radius ) ) {
					$popover_styles[] = 'border-radius: ' . esc_attr( $border_radius );
				}
			}

			if ( ! empty( $template_config_style['boxShadow'] ) ) {
				$popover_styles[] = 'box-shadow: ' . esc_attr( $template_config_style['boxShadow'] );
			}

			return ! empty( $popover_styles ) ? implode( '; ', $popover_styles ) : '';
		}

		/**
		 * Render calendar weeks HTML.
		 *
		 * Generates the table rows and cells for all weeks in the calendar.
		 *
		 * @since 0.1.0
		 *
		 * @param array     $weeks          Array of weeks to render.
		 * @param string    $popover_styles Inline styles for popovers.
		 * @param \WP_Block $block          Block instance for inner blocks.
		 *
		 * @return string HTML for calendar weeks.
		 */
		private function render_calendar_weeks( array $weeks, string $popover_styles, \WP_Block $block ): string {
			ob_start();

			foreach ( $weeks as $week ) {
				echo '<tr>';
				foreach ( $week as $day ) {
					echo $this->render_day_cell( $day, $popover_styles, $block );
				}
				echo '</tr>';
			}

			return ob_get_clean();
		}

		/**
		 * Render a single day cell.
		 *
		 * Generates the HTML for one calendar day cell, including:
		 * - CSS classes (is-empty, has-posts, is-today)
		 * - Day number
		 * - Event dots with post content
		 *
		 * @since 0.1.0
		 *
		 * @param array     $day            Day data object.
		 * @param string    $popover_styles Inline styles for popovers.
		 * @param \WP_Block $block          Block instance for inner blocks.
		 *
		 * @return string HTML for day cell.
		 */
		private function render_day_cell( array $day, string $popover_styles, \WP_Block $block ): string {
			// Build CSS classes
			$classes = array( 'gatherpress-calendar__day' );
			if ( ! empty( $day['isEmpty'] ) ) {
				$classes[] = 'is-empty';
			}
			if ( ! empty( $day['posts'] ) ) {
				$classes[] = 'has-posts';
			}
			if ( ! empty( $day['date'] ) && $day['date'] === $this->today ) {
				$classes[] = 'is-today';
			}

			ob_start();
			?>
			<td class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
				<?php if ( empty( $day['isEmpty'] ) ) : ?>
					<label class="gatherpress-calendar__day-content" for="zoom-<?php echo esc_attr( $day['date'] ); ?>">
						<div class="gatherpress-calendar__day-number">
							<?php echo esc_html( $day['day'] ); ?>
						</div>
						<?php if ( ! empty( $day['posts'] ) ) : ?>
							<div class="gatherpress-calendar__events">
								<?php echo $this->render_event_dots( $day['posts'], $popover_styles, $block ); ?>
							</div>
						<?php endif; ?>
					</label>
				<?php endif; ?>
			</td>
			<?php
			return ob_get_clean();
		}

		/**
		 * Render event dots for a day.
		 *
		 * Generates HTML for all event dots on a single day.
		 * Each dot is a link that contains the inner blocks content.
		 *
		 * @since 0.1.0
		 *
		 * @param array     $post_ids       Array of post IDs for this day.
		 * @param string    $popover_styles Inline styles for popovers.
		 * @param \WP_Block $block          Block instance for inner blocks.
		 *
		 * @return string HTML for event dots.
		 */
		private function render_event_dots( array $post_ids, string $popover_styles, \WP_Block $block ): string {
			ob_start();

			foreach ( $post_ids as $post_id ) {
				echo $this->render_single_event_dot( $post_id, $popover_styles, $block );
			}

			return ob_get_clean();
		}

		/**
		 * Render a single event dot.
		 *
		 * Generates HTML for one event dot with:
		 * - Link to post
		 * - Inner blocks content (hidden, shown in popover)
		 * - Custom popover styling
		 *
		 * @since 0.1.0
		 *
		 * @param int       $post_id        Post ID to render.
		 * @param string    $popover_styles Inline styles for popovers.
		 * @param \WP_Block $block          Block instance for inner blocks.
		 *
		 * @return string HTML for event dot.
		 */
		private function render_single_event_dot( int $post_id, string $popover_styles, \WP_Block $block ): string {
			// Override global $post for inner block rendering
			$GLOBALS['post'] = get_post( $post_id );
			setup_postdata( $GLOBALS['post'] );

			$post_type  = get_post_type( $GLOBALS['post'] );
			$post_url   = get_permalink( $post_id );
			$post_title = get_the_title( $post_id );

			/**
			 * Filter to add post context for inner blocks.
			 *
			 * This ensures blocks like core/post-excerpt that use context
			 * receive the correct postId and postType.
			 *
			 * @param array $context Block context.
			 *
			 * @return array Modified context with postType and postId.
			 */
			$filter_block_context = static function ( $context ) use ( $post_id, $post_type ) {
				$context['postType'] = $post_type;
				$context['postId']   = $post_id;
				return $context;
			};

			// Use priority 1 so other render_block_* filters have access to the values
			add_filter( 'render_block_context', $filter_block_context, 1 );

			// Get the inner blocks template content
			$block_instance = $this->prepare_inner_blocks_instance( $block );
			$inner_content  = ( new \WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );

			// Remove the context filter
			remove_filter( 'render_block_context', $filter_block_context, 1 );

			// Reset post data
			wp_reset_postdata();
			$GLOBALS['post'] = $this->original_post;

			ob_start();
			?>
			<a
				href="<?php echo esc_url( $post_url ); ?>"
				class="gatherpress-calendar__event"
				data-post-id="<?php echo esc_attr( $post_id ); ?>"
				data-popover-style="<?php echo esc_attr( $popover_styles ); ?>"
				aria-label="<?php echo esc_attr( sprintf( __( 'View event: %s', 'gatherpress-calendar' ), $post_title ) ); ?>"
			>
				<?php echo $inner_content; ?>
			</a>
			<?php
			return ob_get_clean();
		}

		/**
		 * Prepare inner blocks instance for rendering.
		 *
		 * Creates a modified block instance that can render just the inner blocks
		 * without wrapper markup or block supports.
		 *
		 * @since 0.1.0
		 *
		 * @param \WP_Block $block Block instance.
		 *
		 * @return array Modified block configuration.
		 */
		private function prepare_inner_blocks_instance( \WP_Block $block ): array {
			$block_instance                  = $block->parsed_block;
			$block_instance['blockName']     = 'core/null';
			$block_instance['innerHTML']     = '';
			array_pop( $block_instance['innerContent'] );
			array_shift( $block_instance['innerContent'] );
			$block_instance['innerContent'] = array_values( $block_instance['innerContent'] );

			return $block_instance;
		}
	}
endif;

// Render the block using the singleton instance
echo Block_Renderer::get_instance()->render( $attributes, $content, $block );