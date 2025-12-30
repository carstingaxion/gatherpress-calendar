<?php
/**
 * GatherPress Calendar Block Render Template
 *
 * This file handles the server-side rendering of the GatherPress Calendar block.
 * It generates a monthly calendar view with posts placed on their respective dates,
 * properly utilizing the Query Loop context.
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
 * Execute the query to get posts
 *
 * @var WP_Query
 */
$query_loop = new WP_Query( $query_args );

if ( ! $query_loop->have_posts() ) {
	wp_reset_postdata();
	return '';
}

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
 * Organize posts by date
 *
 * @var array
 */
$posts_by_date = array();
$earliest_date = null;

while ( $query_loop->have_posts() ) {
	$query_loop->the_post();
	$post_id = get_the_ID();

	$post_date      = get_the_date( 'Y-m-d' );
	$post_timestamp = get_post_timestamp();

	// Track the earliest post date to determine which month to show
	if ( null === $earliest_date || $post_timestamp < $earliest_date ) {
		$earliest_date = $post_timestamp;
	}

	if ( ! isset( $posts_by_date[ $post_date ] ) ) {
		$posts_by_date[ $post_date ] = array();
	}
	$posts_by_date[ $post_date ][] = $post_id;
}
wp_reset_postdata();

/**
 * Determine which month to display
 *
 * Use the earliest post date to determine the month.
 * If no posts, fall back to current month.
 *
 * @var int Year
 * @var int Month (1-12)
 */
if ( null !== $earliest_date ) {
	$year  = (int) gmdate( 'Y', $earliest_date );
	$month = (int) gmdate( 'n', $earliest_date );
} else {
	$now   = current_time( 'timestamp' );
	$year  = (int) gmdate( 'Y', $now );
	$month = (int) gmdate( 'n', $now );
}

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
$month_name     = gmdate( 'F Y', $first_day );

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
$real_current_post = $GLOBALS['post'];
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="gatherpress-calendar">
		<h2 class="gatherpress-calendar__month"><?php echo esc_html( $month_name ); ?></h2>
		<table class="gatherpress-calendar__table">
			<thead>
				<tr>
					<th><?php esc_html_e( 'Sun', 'gatherpress-calendar' ); ?></th>
					<th><?php esc_html_e( 'Mon', 'gatherpress-calendar' ); ?></th>
					<th><?php esc_html_e( 'Tue', 'gatherpress-calendar' ); ?></th>
					<th><?php esc_html_e( 'Wed', 'gatherpress-calendar' ); ?></th>
					<th><?php esc_html_e( 'Thu', 'gatherpress-calendar' ); ?></th>
					<th><?php esc_html_e( 'Fri', 'gatherpress-calendar' ); ?></th>
					<th><?php esc_html_e( 'Sat', 'gatherpress-calendar' ); ?></th>
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
							?>
							<td class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
								<?php if ( empty( $day['isEmpty'] ) ) : ?>
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
												<div class="gatherpress-calendar__event">
													<?php
													// Render the inner blocks with dynamic set to false to prevent calling
													// render_callback and ensure that no wrapper markup is included
													echo ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
													?>
												</div>
												<?php
												remove_filter( 'render_block_context', $filter_block_context, 1 );


												wp_reset_postdata();
												$GLOBALS['post'] = $real_current_post;
											endforeach;
											?>
										</div>
									<?php endif; ?>
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