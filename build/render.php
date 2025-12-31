<?php
/**
 * GatherPress Calendar Block Render Template
 *
 * This file handles the server-side rendering of the GatherPress Calendar block.
 * It generates a monthly calendar view with posts placed on their respective dates,
 * properly utilizing the Query Loop context and respecting the start_of_week setting.
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
 * Get the query context from the parent Query Loop block
 *
 * @var int Query ID for pagination
 * @var array Query parameters
 * @var int Current page number
 */
$query_id = $block->context['queryId'] ?? 0;
$query    = $block->context['query'] ?? array();
$page     = empty( $_GET[ 'query-' . $query_id . '-page' ] ) ? 1 : (int) $_GET[ 'query-' . $query_id . '-page' ];

if ( empty( $query ) ) {
	return '';
}
/**
 * Build query arguments from the Query Loop context
 *
 * @var array
 */
$query['paged'] = $page;
$query_args     = build_query_vars_from_query_block( $block, $page );

/**
 * Determine which month to display based on selectedMonth attribute and monthModifier
 *
 * @var string Selected month in format YYYY-MM
 * @var int Month modifier (offset from current month)
 * @var int Year
 * @var int Month (1-12)
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
	$now   = current_time( 'timestamp' );
	
	// Apply month modifier if no explicit month is selected
	if ( $month_modifier !== 0 ) {
		// Calculate the target month by adding the modifier
		$target_timestamp = strtotime( sprintf( '%+d months', $month_modifier ), $now );
		$year  = (int) gmdate( 'Y', $target_timestamp );
		$month = (int) gmdate( 'n', $target_timestamp );
	} else {
		$year  = (int) gmdate( 'Y', $now );
		$month = (int) gmdate( 'n', $now );
	}
}

/**
 * Add date query parameters to filter posts by year and month
 * This optimizes the query by only fetching posts within the displayed month
 */
$query_args['date_query'] = array(
	array(
		'year'  => $year,
		'month' => $month,
	),
);

/**
 * Execute the query to get posts
 *
 * @var WP_Query
 */
$query_loop = new WP_Query( $query_args );
// echo '<pre>' . var_export( $query_loop, true ) . '</pre>'; // DEBUG

// if ( ! $query_loop->have_posts() ) {
// 	wp_reset_postdata();
// 	return '';
// }

/**
 * Get wrapper attributes for the block
 *
 * @var string
 */
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'gatherpress-calendar-block' ) );

/**
 * Get an instance of the current block for rendering inner blocks
 *
 * @var array
 */
$block_instance = $block->parsed_block;

// Set the block name to one that does not correspond to an existing registered block.
// This ensures that for the inner instances, we do not render any block supports.
$block_instance['blockName'] = 'core/null';
$block_instance['innerHTML'] = '';
array_pop( $block_instance['innerContent'] );
array_shift( $block_instance['innerContent'] );
$block_instance['innerContent'] = array_values( $block_instance['innerContent'] );

/**
 * Get template config styles from attributes
 * These styles will be applied to the event popovers
 *
 * @var array
 */
$template_config_style = $attributes['templateConfigStyle'] ?? array();

/**
 * Build inline styles for popovers based on template config
 *
 * @var array
 */
$popover_styles = array();

if ( ! empty( $template_config_style['backgroundColor'] ) ) {
	$popover_styles[] = 'background-color: ' . esc_attr( $template_config_style['backgroundColor'] );
}

if ( ! empty( $template_config_style['padding'] ) ) {
	$padding = $template_config_style['padding'];
	if ( is_array( $padding ) ) {
		$padding_str = '';
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
		$radius_str = '';
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
 * Convert styles array to inline style string
 *
 * @var string
 */
$popover_style_attr = ! empty( $popover_styles ) ? implode( '; ', $popover_styles ) : '';

/**
 * Organize posts by date
 *
 * @var array
 */
$posts_by_date = array();

while ( $query_loop->have_posts() ) {
	$query_loop->the_post();
	$post_id = get_the_ID();

	if ( 'gatherpress_event' === get_post_type( $post_id ) && class_exists( '\GatherPress\Core\Event' ) ) {
		$event = new \GatherPress\Core\Event( $post_id );
		$post_date = $event->get_datetime_start( 'Y-m-d' );
	} else {
		$post_date = get_the_date( 'Y-m-d' );
	}


	if ( ! isset( $posts_by_date[ $post_date ] ) ) {
		$posts_by_date[ $post_date ] = array();
	}
	$posts_by_date[ $post_date ][] = $post_id;
}
wp_reset_postdata();

/**
 * Get start of week setting from WordPress options
 *
 * @var int Day of week to start (0=Sunday, 1=Monday, etc.)
 */
$start_of_week = (int) get_option( 'start_of_week', 0 );

/**
 * Calculate calendar structure
 *
 * @var int First day of the month (timestamp)
 * @var int Number of days in the month
 * @var int Day of week for the first day (0=Sunday, 6=Saturday)
 * @var string Month name and year
 */
$first_day      = mktime( 0, 0, 0, $month, 1, $year );
$days_in_month  = (int) gmdate( 't', $first_day );
$start_day_week = (int) gmdate( 'w', $first_day );
$month_name     = wp_date( 'F Y', $first_day );

/**
 * Adjust start day based on start_of_week setting
 */
$start_day_week = ( $start_day_week - $start_of_week + 7 ) % 7;

/**
 * Get translated day names based on start_of_week setting
 * Uses WordPress core's wp_date() function to get properly localized day names
 *
 * @var array Array of day name translations
 */
$day_names = array();
for ( $i = 0; $i < 7; $i++ ) {
	// Calculate the day of week (0=Sunday, 6=Saturday)
	$day_of_week = ( $start_of_week + $i ) % 7;
	
	// Create a timestamp for a date with this day of week
	// Using a known week: 2024-01-07 is a Sunday (day 0)
	$base_sunday = strtotime( '2024-01-07' );
	$day_timestamp = $base_sunday + ( $day_of_week * DAY_IN_SECONDS );
	
	// Get the abbreviated day name using wp_date for proper localization
	// 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.)
	$day_names[] = wp_date( 'D', $day_timestamp );
}

/**
 * Build weeks array for the calendar
 *
 * @var array Array of weeks, each containing 7 days
 */
$weeks        = array();
$current_week = array();

// Fill initial empty days before the month starts
for ( $i = 0; $i < $start_day_week; $i++ ) {
	$current_week[] = array( 'isEmpty' => true );
}

// Fill days with posts
for ( $day = 1; $day <= $days_in_month; $day++ ) {
	$date_str  = sprintf( '%04d-%02d-%02d', $year, $month, $day );
	$day_posts = isset( $posts_by_date[ $date_str ] ) ? $posts_by_date[ $date_str ] : array();

	$current_week[] = array(
		'day'     => $day,
		'date'    => $date_str,
		'posts'   => $day_posts,
		'isEmpty' => false,
	);

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
 * Get today's date for highlighting
 *
 * @var string Today's date in Y-m-d format
 */
$today = gmdate( 'Y-m-d', current_time( 'timestamp' ) );

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
						<?php foreach ( $week as $day ) : ?>
							<?php
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


													// !!! Override global $post for inner block rendering !!!
													// especially needed for the core/post_title block, which does not use render_block_context.
													$GLOBALS['post'] = get_post( $post_id );
													setup_postdata( $GLOBALS['post'] );
													$post_type = get_post_type( $GLOBALS['post'] );
													$post_url  = get_permalink( $post_id );
													$post_title = get_the_title( $post_id );

													/**
													 * Filter to add post context for inner blocks
													 *
													 * @param array $context Block context.
													 * @return array Modified context.
													 */
													$filter_block_context = static function ( $context ) use ( $post_id, $post_type ) {
														$context['postType'] = $post_type;
														$context['postId']   = $post_id;
														return $context;
													};

													// Use an early priority so that other 'render_block_*' filters have access to the values
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
														// Render the inner blocks with dynamic set to false to prevent calling
														// render_callback and ensure that no wrapper markup is included
														echo ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
														?>
													</a>
													<?php
													remove_filter( 'render_block_context', $filter_block_context, 1 );


													wp_reset_postdata();
													$GLOBALS['post'] = $real_current_post;
												endforeach;
												?>
											</div>
										<?php endif; ?>
									</label>
								<?php endif; ?>
							</td>
						<?php endforeach; ?>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
</div>
<?php
wp_reset_postdata();