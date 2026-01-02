<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$query_id = $block->context['queryId'] ?? 0;
$query    = $block->context['query'] ?? array();
$page     = empty( $_GET[ 'query-' . $query_id . '-page' ] ) ? 1 : (int) $_GET[ 'query-' . $query_id . '-page' ];

if ( empty( $query ) ) {
	return '';
}

$query['paged'] = $page;
$query_args     = build_query_vars_from_query_block( $block, $page );

$query_loop = new WP_Query( $query_args );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'gatherpress-query-map-block' ) );

$map_height = $attributes['mapHeight'] ?? '500px';
$default_zoom = $attributes['defaultZoom'] ?? 10;

$block_instance                  = $block->parsed_block;
$block_instance['blockName']     = 'core/null';
$block_instance['innerHTML']     = '';
array_pop( $block_instance['innerContent'] );
array_shift( $block_instance['innerContent'] );
$block_instance['innerContent'] = array_values( $block_instance['innerContent'] );

$posts_data = array();

while ( $query_loop->have_posts() ) {
	$query_loop->the_post();
	$post_id = get_the_ID();
	
	// Get geo data from WordPress Geodata Standard
	$lat = get_post_meta( $post_id, 'geo_latitude', true );
	$lng = get_post_meta( $post_id, 'geo_longitude', true );
	
	if ( $lat && $lng ) {
		ob_start();
		$GLOBALS['post'] = get_post( $post_id );
		setup_postdata( $GLOBALS['post'] );
		$post_type = get_post_type( $GLOBALS['post'] );
		
		$filter_block_context = static function ( $context ) use ( $post_id, $post_type ) {
			$context['postType'] = $post_type;
			$context['postId']   = $post_id;
			return $context;
		};
		
		add_filter( 'render_block_context', $filter_block_context, 1 );
		echo ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
		remove_filter( 'render_block_context', $filter_block_context, 1 );
		
		$content = ob_get_clean();
		wp_reset_postdata();
		
		$posts_data[] = array(
			'id' => $post_id,
			'lat' => floatval( $lat ),
			'lng' => floatval( $lng ),
			'title' => get_the_title( $post_id ),
			'content' => $content,
		);
	}
}
wp_reset_postdata();
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="gatherpress-query-map">
		<div 
			class="gatherpress-query-map__map" 
			style="height: <?php echo esc_attr( $map_height ); ?>"
			data-posts="<?php echo esc_attr( json_encode( $posts_data ) ); ?>"
			data-zoom="<?php echo esc_attr( $default_zoom ); ?>"
		></div>
	</div>
</div>