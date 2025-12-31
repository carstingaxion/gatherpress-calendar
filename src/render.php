<?php
/**
 * GatherPress Calendar Block Render Template
 *
 * This file handles the server-side rendering of the GatherPress Calendar block.
 * It generates a monthly calendar view with posts placed on their respective dates,
 * properly utilizing the Query Loop context and respecting WordPress settings.
 *
 * Architecture:
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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Get the query context from the parent Query Loop block.
 *
 * Query Loop provides context about:
 * - Which posts to display (post type, taxonomy filters, etc.)
 * - How to order posts
 * - Pagination state
 *
 * @var int    $query_id Query ID for pagination.
 * @var array  $query    Query parameters from parent Query Loop.
 * @var int    $page     Current page number for pagination.
 */
$query_id = $block->context['queryId'] ?? 0;
$query    = $block->context['query'] ?? array();
$page     = empty( $_GET[ 'query-' . $query_id . '-page' ] ) ? 1 : (int) $_GET[ 'query-' . $query_id . '-page' ];

if ( empty( $query ) ) {
	return '';
}

/**
 * Build query arguments from the Query Loop context.
 *
 * Uses WordPress core function to convert Query Loop settings to WP_Query args.
 * This ensures compatibility with all Query Loop features (taxonomy filters,
 * author filters, search, etc.).
 *
 * @var array $query_args WP_Query compatible arguments.
 */
$query['paged'] = $page;
$query_args     = build_query_vars_from_query_block( $block, $page );

/**
 * Determine which month to display based on attributes.
 *
 * Two modes:
 * 1. Explicit month selection: User picks a specific month (e.g., "2025-07")
 * 2. Relative month: Current month + modifier (e.g., -1 for last month)
 *
 * The relative month mode is useful for blocks like "Last Month's Events"
 * that automatically update as time passes.
 *
 * @var string $selected_month Selected month in format YYYY-MM or empty string.
 * @var int    $month_modifier Month offset from current month (e.g., -1, 0, +1).
 * @var int    $year           Four-digit year (e.g., 2025).
 * @var int    $month          Month number 1-12 (January=1, December=12).
 */
$selected_month = $attributes['selectedMonth'] ?? '';
$month_modifier = $attributes['monthModifier'] ?? 0;

if ( ! empty( $selected_month ) && preg_match( '/^\d{4}-\d{2}$/', $selected_month ) ) {
	// Use selected month (ignore monthModifier when explicit month is set)
	list( $year, $month ) = explode( '-', $selected_month );
	$year  = (int) $year;
	$month = (int) $month;
} else {
	// Use current month with modifier
	$now = current_time( 'timestamp' );

	// Apply month modifier if no explicit month is selected
	if ( $month_modifier !== 0 ) {
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
		$year             = (int) gmdate( 'Y', $target_timestamp );
		$month            = (int) gmdate( 'n', $target_timestamp );
	} else {
		$year  = (int) gmdate( 'Y', $now );
		$month = (int) gmdate( 'n', $now );
	}
}

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
 *
 * @var array $query_args Modified to include date_query.
 */
$query_args['date_query'] = array(
	array(
		'year'  => $year,
		'month' => $month,
	),
);

/**
 * Execute the query to get posts.
 *
 * WP_Query fetches posts based on:
 * - Query Loop settings (post type, taxonomy, etc.)
 * - Our date_query filter (year/month)
 * - Any other filters from parent blocks
 *
 * @var WP_Query $query_loop The query result object.
 */
$query_loop = new WP_Query( $query_args );

/**
 * Get wrapper attributes for the block.
 *
 * Includes:
 * - CSS classes (including custom classes and block style)
 * - HTML attributes from block supports (align, etc.)
 *
 * @var string $wrapper_attributes HTML attribute string.
 */
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'gatherpress-calendar-block' ) );

/**
 * Get an instance of the current block for rendering inner blocks.
 *
 * This creates a modified version of the block that can be used to render
 * the inner blocks template for each post.
 *
 * Why we modify blockName:
 * - Setting it to 'core/null' prevents WordPress from trying to render
 *   block supports (spacing, colors, etc.) on each inner block instance
 * - We only want the inner block content, not repeated wrapper markup
 *
 * Why we modify innerContent:
 * - Removes the outer wrapper HTML
 * - Keeps only the actual inner blocks
 * - Allows clean rendering of just the post content
 *
 * @var array $block_instance Modified block configuration for inner blocks.
 */
$block_instance                  = $block->parsed_block;
$block_instance['blockName']     = 'core/null';
$block_instance['innerHTML']     = '';
array_pop( $block_instance['innerContent'] );
array_shift( $block_instance['innerContent'] );
$block_instance['innerContent'] = array_values( $block_instance['innerContent'] );

/**
 * Get template config styles from attributes.
 *
 * These styles are applied to the event popovers to match the editor preview.
 * Users configure these in the "Template Style" panel in the editor.
 *
 * Available styles:
 * - backgroundColor: Popover background color
 * - padding: Popover padding (object with top, right, bottom, left)
 * - border: Width, style, color, radius
 * - boxShadow: CSS box-shadow value
 *
 * @var array $template_config_style Style configuration object.
 */
$template_config_style = $attributes['templateConfigStyle'] ?? array();

/**
 * Build inline styles for popovers based on template config.
 *
 * Converts the style configuration object to CSS property strings that
 * can be applied as inline styles on the popover element.
 *
 * @var array $popover_styles Array of CSS property strings.
 */
$popover_styles = array();

if ( ! empty( $template_config_style['backgroundColor'] ) ) {
	$popover_styles[] = 'background-color: ' . esc_attr( $template_config_style['backgroundColor'] );
}

if ( ! empty( $template_config_style['padding'] ) ) {
	$padding = $template_config_style['padding'];
	if ( is_array( $padding ) ) {
		// Convert padding object to CSS shorthand
		// Format: top right bottom left
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
		// Convert border radius object to CSS shorthand
		// Format: topLeft topRight bottomRight bottomLeft
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

/**
 * Convert styles array to inline style string.
 *
 * This string is added to each event link's data-popover-style attribute,
 * which the JavaScript reads to style the popover when it's shown.
 *
 * @var string $popover_style_attr Inline style attribute value.
 */
$popover_style_attr = ! empty( $popover_styles ) ? implode( '; ', $popover_styles ) : '';

/**
 * Organize posts by date.
 *
 * Creates a lookup table for quick access to posts by their date.
 * Format: array( 'YYYY-MM-DD' => array( post_id1, post_id2, ... ) )
 *
 * Post date logic:
 * - For GatherPress events: Uses gatherpress_datetime_start meta field
 * - For other post types: Uses publication date
 *
 * Why this structure:
 * - Fast lookup: O(1) to check if a date has posts
 * - Memory efficient: Only stores post IDs, not full post objects
 * - Supports multiple posts per day
 *
 * @var array $posts_by_date Array mapping dates to post IDs.
 */
$posts_by_date = array();

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
	if ( ! isset( $posts_by_date[ $post_date ] ) ) {
		$posts_by_date[ $post_date ] = array();
	}
	$posts_by_date[ $post_date ][] = $post_id;
}
wp_reset_postdata();

/**
 * Get start of week setting from WordPress options.
 *
 * This determines which day the calendar week starts on:
 * - 0 = Sunday (US style)
 * - 1 = Monday (European style)
 * - 2-6 = Other days (less common)
 *
 * Users set this in Settings > General > Week Starts On
 *
 * @var int $start_of_week Day of week to start (0=Sunday, 1=Monday, etc.).
 */
$start_of_week = (int) get_option( 'start_of_week', 0 );

/**
 * Calculate calendar structure.
 *
 * These values define the calendar grid dimensions and layout.
 *
 * @var int    $first_day      Timestamp for first day of month.
 * @var int    $days_in_month  Number of days in the month (28-31).
 * @var int    $start_day_week Day of week for first day (0=Sunday, 6=Saturday).
 * @var string $month_name     Formatted month name and year (e.g., "January 2025").
 */
$first_day      = mktime( 0, 0, 0, $month, 1, $year );
$days_in_month  = (int) gmdate( 't', $first_day );
$start_day_week = (int) gmdate( 'w', $first_day );
$month_name     = wp_date( 'F Y', $first_day );

/**
 * Adjust start day based on start_of_week setting.
 *
 * This calculation shifts the calendar grid so it starts on the configured day.
 *
 * Math explanation:
 * - ( $start_day_week - $start_of_week + 7 ) ensures positive result
 * - % 7 wraps around (e.g., day 8 becomes day 1)
 *
 * Examples:
 * - First day is Wednesday (3), start_of_week is Monday (1): (3-1+7)%7 = 2 (2 empty cells)
 * - First day is Sunday (0), start_of_week is Monday (1): (0-1+7)%7 = 6 (6 empty cells)
 */
$start_day_week = ( $start_day_week - $start_of_week + 7 ) % 7;

/**
 * Get translated day names based on start_of_week setting.
 *
 * Uses WordPress core's wp_date() function to get properly localized day names.
 * The order is adjusted based on start_of_week setting.
 *
 * How it works:
 * 1. Start with a known Sunday (2024-01-07)
 * 2. For each day of the week, calculate which day it should be
 * 3. Use wp_date() with 'D' format to get abbreviated day name
 *
 * 'D' format returns:
 * - English: Mon, Tue, Wed, Thu, Fri, Sat, Sun
 * - German: Mo, Di, Mi, Do, Fr, Sa, So
 * - French: lun, mar, mer, jeu, ven, sam, dim
 * - etc.
 *
 * @var array $day_names Array of translated day name strings.
 */
$day_names = array();
for ( $i = 0; $i < 7; $i++ ) {
	// Calculate the day of week (0=Sunday, 6=Saturday)
	$day_of_week = ( $start_of_week + $i ) % 7;

	// Create a timestamp for a date with this day of week
	// Using a known week: 2024-01-07 is a Sunday (day 0)
	$base_sunday   = strtotime( '2024-01-07' );
	$day_timestamp = $base_sunday + ( $day_of_week * DAY_IN_SECONDS );

	// Get the abbreviated day name using wp_date for proper localization
	// 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.)
	$day_names[] = wp_date( 'D', $day_timestamp );
}

/**
 * Build weeks array for the calendar.
 *
 * Creates a 2D array structure:
 * - Outer array: weeks (typically 4-6 weeks)
 * - Inner array: days (always 7 days)
 *
 * Each day is an object with:
 * - day: Day number (1-31)
 * - date: ISO date string (YYYY-MM-DD)
 * - posts: Array of post IDs for this date
 * - isEmpty: Boolean indicating if this is a padding day
 *
 * The grid always has complete weeks (7 columns), with empty cells for:
 * - Days before the month starts
 * - Days after the month ends
 *
 * @var array $weeks        Array of weeks, each containing 7 days.
 * @var array $current_week Temporary array for building current week.
 */
$weeks        = array();
$current_week = array();

// Fill initial empty days before the month starts
for ( $i = 0; $i < $start_day_week; $i++ ) {
	$current_week[] = array( 'isEmpty' => true );
}

// Fill days with posts
for ( $day = 1; $day <= $days_in_month; $day++ ) {
	// Format date as YYYY-MM-DD for lookup in $posts_by_date
	$date_str  = sprintf( '%04d-%02d-%02d', $year, $month, $day );
	$day_posts = isset( $posts_by_date[ $date_str ] ) ? $posts_by_date[ $date_str ] : array();

	$current_week[] = array(
		'day'     => $day,
		'date'    => $date_str,
		'posts'   => $day_posts,
		'isEmpty' => false,
	);

	// When week is complete (7 days), start a new week
	if ( count( $current_week ) === 7 ) {
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

/**
 * Get today's date for highlighting.
 *
 * Uses current_time() to respect site timezone setting.
 * This ensures "today" matches what the site admin considers today,
 * not what the server timezone considers today.
 *
 * @var string $today Today's date in Y-m-d format.
 */
$today = gmdate( 'Y-m-d', current_time( 'timestamp' ) );

/**
 * Store current global $post for restoration later.
 *
 * We need to temporarily override the global $post for each event
 * so inner blocks render with the correct post context.
 *
 * @var WP_Post|null $real_current_post The original global post object.
 */
$real_current_post = $GLOBALS['post'];
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="gatherpress-calendar">
		<h2 class="gatherpress-calendar__month"><?php echo esc_html( $month_name ); ?></h2>
		<table class="gatherpress-calendar__table">
			<thead>
				<tr>
					<?php foreach ( $day_names as $day_name ) : ?>
						<th><?php echo esc_html( $day_name ); ?></th>
					<?php endforeach; ?>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $weeks as $week ) : ?>
					<tr>
						<?php
						foreach ( $week as $day ) :
							// Build CSS classes for the day cell
							$classes = array( 'gatherpress-calendar__day' );
							if ( ! empty( $day['isEmpty'] ) ) {
								$classes[] = 'is-empty';
							}
							if ( ! empty( $day['posts'] ) ) {
								$classes[] = 'has-posts';
							}
							if ( ! empty( $day['date'] ) && $day['date'] === $today ) {
								$classes[] = 'is-today';
							}
							?>
							<td class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
								<?php if ( empty( $day['isEmpty'] ) ) : ?>
									<label class="gatherpress-calendar__day-content" for="zoom-<?php echo esc_attr( $day['date'] ); ?>">
										<div class="gatherpress-calendar__day-number">
											<?php echo esc_html( $day['day'] ); ?>
										</div>
										<?php if ( ! empty( $day['posts'] ) ) : ?>
											<div class="gatherpress-calendar__events">
												<?php
												foreach ( $day['posts'] as $post_id ) :
													/**
													 * Override global $post for inner block rendering.
													 *
													 * This is critical for blocks like core/post-title that don't use
													 * render_block_context and instead rely on the global $post.
													 */
													$GLOBALS['post'] = get_post( $post_id );
													setup_postdata( $GLOBALS['post'] );
													$post_type  = get_post_type( $GLOBALS['post'] );
													$post_url   = get_permalink( $post_id );
													$post_title = get_the_title( $post_id );

													/**
													 * Filter to add post context for inner blocks.
													 *
													 * This ensures blocks like core/post-excerpt that DO use context
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
													?>
													<a
														href="<?php echo esc_url( $post_url ); ?>"
														class="gatherpress-calendar__event"
														data-post-id="<?php echo esc_attr( $post_id ); ?>"
														data-popover-style="<?php echo esc_attr( $popover_style_attr ); ?>"
														aria-label="<?php echo esc_attr( sprintf( __( 'View event: %s', 'gatherpress-calendar' ), $post_title ) ); ?>"
													>
														<?php
														/**
														 * Render the inner blocks template for this post.
														 *
														 * Setting 'dynamic' => false prevents calling render_callback
														 * and ensures no wrapper markup is included. We just want
														 * the raw inner block content.
														 */
														echo ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
														?>
													</a>
													<?php
													// Remove the context filter now that we're done with this post
													remove_filter( 'render_block_context', $filter_block_context, 1 );

													// Reset post data for next iteration
													wp_reset_postdata();
													$GLOBALS['post'] = $real_current_post;
												endforeach;
												?>
											</div>
										<?php endif; ?>
									</label>
								<?php endif; ?>
							</td>
							<?php
						endforeach;
						?>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
</div>
<?php
// Final cleanup: restore original global post
wp_reset_postdata();