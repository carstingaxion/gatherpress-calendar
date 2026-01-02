<?php
/**
* Plugin Name:  Query Map
* Plugin URI:   https://wordpress.org/plugins/query-map
* Description:  Display query loop results on an interactive OpenStreetMap showing posts with geodata.
* Version:      0.1.0
* Requires at least: 6.0
* Requires PHP: 7.4
* Author:       WordPress Telex
* License:      GPLv2 or later
* License URI:  https://www.gnu.org/licenses/gpl-2.0.html
* Text Domain:  query-map
*
* @package QueryMap
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
* Enqueue Leaflet assets for the block editor.
*
* @since 0.1.0
*
* @return void
*/
function query_map_enqueue_editor_assets() {
	// Leaflet CSS
	wp_enqueue_style(
		'leaflet',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
		array(),
		'1.9.4'
	);

	// Leaflet MarkerCluster CSS
	wp_enqueue_style(
		'leaflet-markercluster',
		'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
		array( 'leaflet' ),
		'1.5.3'
	);

	wp_enqueue_style(
		'leaflet-markercluster-default',
		'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
		array( 'leaflet-markercluster' ),
		'1.5.3'
	);

	// Leaflet JS - must load before editor script
	wp_enqueue_script(
		'leaflet',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
		array(),
		'1.9.4',
		false
	);

	// Leaflet MarkerCluster JS
	wp_enqueue_script(
		'leaflet-markercluster',
		'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js',
		array( 'leaflet' ),
		'1.5.3',
		false
	);
}
add_action( 'enqueue_block_editor_assets', 'query_map_enqueue_editor_assets', 5 );

/**
* Enqueue Leaflet assets for the frontend.
*
* @since 0.1.0
*
* @return void
*/
function query_map_enqueue_leaflet_assets() {
	if ( ! has_block( 'gatherpress/query-map' ) ) {
		return;
	}

	// Leaflet CSS
	wp_enqueue_style(
		'leaflet',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
		array(),
		'1.9.4'
	);

	// Leaflet MarkerCluster CSS
	wp_enqueue_style(
		'leaflet-markercluster',
		'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
		array( 'leaflet' ),
		'1.5.3'
	);

	wp_enqueue_style(
		'leaflet-markercluster-default',
		'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
		array( 'leaflet-markercluster' ),
		'1.5.3'
	);

	// Leaflet JS - must load before view.js
	wp_enqueue_script(
		'leaflet',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
		array(),
		'1.9.4',
		true
	);

	// Leaflet MarkerCluster JS
	wp_enqueue_script(
		'leaflet-markercluster',
		'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js',
		array( 'leaflet' ),
		'1.5.3',
		true
	);
}
add_action( 'wp_enqueue_scripts', 'query_map_enqueue_leaflet_assets', 5 );

/**
* Registers the Query Map block.
*
* @since 0.1.0
*
* @return void
*/
function query_map_block_init() {
	register_block_type( 
		__DIR__ . '/build/',
		array(
			'editor_script_handles' => array( 'leaflet', 'leaflet-markercluster' ),
			'view_script_handles' => array( 'leaflet', 'leaflet-markercluster' ),
		)
	);
}
add_action( 'init', 'query_map_block_init' );

/**
* Register geographic metadata for posts and pages.
*
* Registers geo_latitude, geo_longitude, geo_public, and geo_address
* meta fields following the WordPress Geo Data Standard.
*
* @since 0.1.0
*
* @return void
*/
function query_map_register_post_meta() {
	$post_types = array( 'post', 'page' );
	
	foreach ( $post_types as $post_type ) {
		// Latitude
		register_post_meta(
			$post_type,
			'geo_latitude',
			array(
				'type' => 'string',
				'description' => __( 'Geographic latitude coordinate', 'query-map' ),
				'single' => true,
				'show_in_rest' => true,
				'sanitize_callback' => 'query_map_sanitize_coordinate',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		
		// Longitude
		register_post_meta(
			$post_type,
			'geo_longitude',
			array(
				'type' => 'string',
				'description' => __( 'Geographic longitude coordinate', 'query-map' ),
				'single' => true,
				'show_in_rest' => true,
				'sanitize_callback' => 'query_map_sanitize_coordinate',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		
		// Public visibility flag
		register_post_meta(
			$post_type,
			'geo_public',
			array(
				'type' => 'integer',
				'description' => __( 'Whether geographic data is publicly visible', 'query-map' ),
				'single' => true,
				'show_in_rest' => true,
				'default' => 1,
				'sanitize_callback' => 'absint',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		
		// Address
		register_post_meta(
			$post_type,
			'geo_address',
			array(
				'type' => 'string',
				'description' => __( 'Human-readable address', 'query-map' ),
				'single' => true,
				'show_in_rest' => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'query_map_register_post_meta' );

/**
* Sanitize coordinate value.
*
* @since 0.1.0
*
* @param string $value The coordinate value to sanitize.
* @return string Sanitized coordinate value.
*/
function query_map_sanitize_coordinate( $value ) {
	if ( empty( $value ) ) {
		return '';
	}
	
	$float_value = floatval( $value );
	
	// Validate coordinate range (-180 to 180 for longitude, -90 to 90 for latitude)
	if ( $float_value < -180 || $float_value > 180 ) {
		return '';
	}
	
	return (string) $float_value;
}

/**
* Generate demo posts and pages with geodata.
*
* Creates sample content with WordPress Geo Data Standard compliant metadata
* for testing the Query Map block. Run this once via wp-admin/admin.php?page=query-map-demo
*
* @since 0.1.0
*
* @return void
*/
function query_map_generate_demo_data() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Sample locations around the world
	$locations = array(
		array(
			'title' => 'Eiffel Tower Visit',
			'content' => 'An amazing visit to one of the most iconic landmarks in Paris, France.',
			'lat' => 48.8584,
			'lng' => 2.2945,
			'type' => 'post',
		),
		array(
			'title' => 'Central Park Adventure',
			'content' => 'A beautiful day exploring Central Park in the heart of Manhattan, New York City.',
			'lat' => 40.7829,
			'lng' => -73.9654,
			'type' => 'post',
		),
		array(
			'title' => 'Tokyo Tower Experience',
			'content' => 'Breathtaking views from Tokyo Tower, a communications and observation tower in Tokyo, Japan.',
			'lat' => 35.6586,
			'lng' => 139.7454,
			'type' => 'post',
		),
		array(
			'title' => 'Sydney Opera House',
			'content' => 'Visiting the iconic Sydney Opera House, one of the most recognizable buildings in Australia.',
			'lat' => -33.8568,
			'lng' => 151.2153,
			'type' => 'page',
		),
		array(
			'title' => 'Big Ben and Parliament',
			'content' => 'Exploring the historic Big Ben clock tower and the Houses of Parliament in London, UK.',
			'lat' => 51.5007,
			'lng' => -0.1246,
			'type' => 'post',
		),
		array(
			'title' => 'Colosseum Tour',
			'content' => 'Walking through ancient history at the Colosseum in Rome, Italy.',
			'lat' => 41.8902,
			'lng' => 12.4922,
			'type' => 'page',
		),
		array(
			'title' => 'Golden Gate Bridge',
			'content' => 'Crossing the magnificent Golden Gate Bridge in San Francisco, California.',
			'lat' => 37.8199,
			'lng' => -122.4783,
			'type' => 'post',
		),
		array(
			'title' => 'Taj Mahal Visit',
			'content' => 'Witnessing the beauty of the Taj Mahal, a white marble mausoleum in Agra, India.',
			'lat' => 27.1751,
			'lng' => 78.0421,
			'type' => 'page',
		),
		array(
			'title' => 'Christ the Redeemer',
			'content' => 'Amazing views from Christ the Redeemer statue overlooking Rio de Janeiro, Brazil.',
			'lat' => -22.9519,
			'lng' => -43.2105,
			'type' => 'post',
		),
		array(
			'title' => 'Burj Khalifa Dubai',
			'content' => 'Reaching new heights at the Burj Khalifa, the tallest building in the world, located in Dubai.',
			'lat' => 25.1972,
			'lng' => 55.2744,
			'type' => 'page',
		),
	);

	$created_count = 0;

	foreach ( $locations as $location ) {
		// Check if post with this title already exists
		$existing = get_page_by_title( $location['title'], OBJECT, $location['type'] );
		if ( $existing ) {
			continue;
		}

		$post_data = array(
			'post_title' => $location['title'],
			'post_content' => $location['content'],
			'post_status' => 'publish',
			'post_type' => $location['type'],
			'post_author' => get_current_user_id(),
		);

		$post_id = wp_insert_post( $post_data );

		if ( ! is_wp_error( $post_id ) ) {
			// Add WordPress Geo Data Standard metadata
			update_post_meta( $post_id, 'geo_latitude', $location['lat'] );
			update_post_meta( $post_id, 'geo_longitude', $location['lng'] );
			update_post_meta( $post_id, 'geo_public', 1 );
			update_post_meta( $post_id, 'geo_address', '' );

			$created_count++;
		}
	}

	return $created_count;
}

/**
* Add admin menu for demo data generator.
*
* @since 0.1.0
*
* @return void
*/
function query_map_admin_menu() {
	add_submenu_page(
		'tools.php',
		'Query Map Demo Data',
		'Query Map Demo',
		'manage_options',
		'query-map-demo',
		'query_map_demo_page'
	);
}
add_action( 'admin_menu', 'query_map_admin_menu' );

/**
* Render demo data generator admin page.
*
* @since 0.1.0
*
* @return void
*/
function query_map_demo_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$generated = false;
	$count = 0;

	if ( isset( $_POST['generate_demo_data'] ) && check_admin_referer( 'query_map_demo_data' ) ) {
		$count = query_map_generate_demo_data();
		$generated = true;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		
		<?php if ( $generated ) : ?>
			<div class="notice notice-success is-dismissible">
				<p>
					<?php
					printf(
						/* translators: %d: number of posts created */
						esc_html__( 'Successfully created %d posts and pages with geodata!', 'query-map' ),
						intval( $count )
					);
					?>
				</p>
			</div>
		<?php endif; ?>

		<div class="card">
			<h2><?php esc_html_e( 'Generate Demo Content', 'query-map' ); ?></h2>
			<p>
				<?php esc_html_e( 'This will create sample posts and pages with geographic coordinates from famous landmarks around the world. Each post will have WordPress Geo Data Standard compliant metadata including latitude and longitude.', 'query-map' ); ?>
			</p>
			<p>
				<strong><?php esc_html_e( 'Locations included:', 'query-map' ); ?></strong>
			</p>
			<ul style="list-style: disc; margin-left: 2em;">
				<li>Eiffel Tower (Paris, France)</li>
				<li>Central Park (New York, USA)</li>
				<li>Tokyo Tower (Tokyo, Japan)</li>
				<li>Sydney Opera House (Sydney, Australia)</li>
				<li>Big Ben (London, UK)</li>
				<li>Colosseum (Rome, Italy)</li>
				<li>Golden Gate Bridge (San Francisco, USA)</li>
				<li>Taj Mahal (Agra, India)</li>
				<li>Christ the Redeemer (Rio de Janeiro, Brazil)</li>
				<li>Burj Khalifa (Dubai, UAE)</li>
			</ul>
			<p>
				<strong><?php esc_html_e( 'Metadata added:', 'query-map' ); ?></strong>
			</p>
			<ul style="list-style: disc; margin-left: 2em;">
				<li><code>geo_latitude</code> - Latitude coordinate</li>
				<li><code>geo_longitude</code> - Longitude coordinate</li>
				<li><code>geo_public</code> - Public visibility flag (set to 1)</li>
				<li><code>geo_address</code> - Address field (empty, can be filled manually)</li>
			</ul>
			<form method="post">
				<?php wp_nonce_field( 'query_map_demo_data' ); ?>
				<p>
					<button type="submit" name="generate_demo_data" class="button button-primary">
						<?php esc_html_e( 'Generate Demo Data', 'query-map' ); ?>
					</button>
				</p>
				<p class="description">
					<?php esc_html_e( 'Note: This will only create posts that don\'t already exist. Running this multiple times is safe.', 'query-map' ); ?>
				</p>
			</form>
		</div>

		<div class="card" style="margin-top: 20px;">
			<h2><?php esc_html_e( 'How to Use', 'query-map' ); ?></h2>
			<ol style="margin-left: 2em;">
				<li><?php esc_html_e( 'Generate the demo data using the button above', 'query-map' ); ?></li>
				<li><?php esc_html_e( 'Create a new page or post in the block editor', 'query-map' ); ?></li>
				<li><?php esc_html_e( 'Add a Query Loop block', 'query-map' ); ?></li>
				<li><?php esc_html_e( 'Configure the Query Loop to show posts or pages', 'query-map' ); ?></li>
				<li><?php esc_html_e( 'Inside the Query Loop, add the Query Map block', 'query-map' ); ?></li>
				<li><?php esc_html_e( 'The map will display all queried posts with geodata as markers', 'query-map' ); ?></li>
			</ol>
		</div>
	</div>
	<?php
}

/**
* Add geodata column to post type admin screens.
*
* @since 0.1.0
*
* @param array $columns Existing columns.
* @return array Modified columns.
*/
function query_map_add_geodata_column( $columns ) {
	$new_columns = array();
	
	// Add geodata column after title
	foreach ( $columns as $key => $value ) {
		$new_columns[ $key ] = $value;
		if ( $key === 'title' ) {
			$new_columns['geodata'] = '<span class="dashicons dashicons-location-alt" title="' . esc_attr__( 'Geographic Data', 'query-map' ) . '"></span>';
		}
	}
	
	return $new_columns;
}
add_filter( 'manage_post_posts_columns', 'query_map_add_geodata_column' );
add_filter( 'manage_page_posts_columns', 'query_map_add_geodata_column' );

/**
* Render geodata column content.
*
* @since 0.1.0
*
* @param string $column_name Column identifier.
* @param int    $post_id     Post ID.
* @return void
*/
function query_map_render_geodata_column( $column_name, $post_id ) {
	if ( $column_name !== 'geodata' ) {
		return;
	}
	
	$lat = get_post_meta( $post_id, 'geo_latitude', true );
	$lng = get_post_meta( $post_id, 'geo_longitude', true );
	
	if ( $lat && $lng ) {
		$lat_formatted = number_format( (float) $lat, 4, '.', '' );
		$lng_formatted = number_format( (float) $lng, 4, '.', '' );
		
		printf(
			'<span class="query-map-geodata" style="color: #2271b1; font-size: 11px; white-space: nowrap;" title="%s">✓ %s, %s</span>',
			esc_attr__( 'Has geographic coordinates', 'query-map' ),
			esc_html( $lat_formatted ),
			esc_html( $lng_formatted )
		);
	} else {
		printf(
			'<span class="query-map-no-geodata" style="color: #8c8f94; font-size: 11px;" title="%s">—</span>',
			esc_attr__( 'No geographic data', 'query-map' )
		);
	}
}
add_action( 'manage_post_posts_custom_column', 'query_map_render_geodata_column', 10, 2 );
add_action( 'manage_page_posts_custom_column', 'query_map_render_geodata_column', 10, 2 );

/**
* Make geodata column sortable.
*
* @since 0.1.0
*
* @param array $columns Sortable columns.
* @return array Modified sortable columns.
*/
function query_map_sortable_geodata_column( $columns ) {
	$columns['geodata'] = 'geodata';
	return $columns;
}
add_filter( 'manage_edit-post_sortable_columns', 'query_map_sortable_geodata_column' );
add_filter( 'manage_edit-page_sortable_columns', 'query_map_sortable_geodata_column' );

/**
* Handle sorting by geodata column.
*
* @since 0.1.0
*
* @param WP_Query $query The WordPress query object.
* @return void
*/
function query_map_geodata_column_orderby( $query ) {
	if ( ! is_admin() || ! $query->is_main_query() ) {
		return;
	}
	
	if ( $query->get( 'orderby' ) === 'geodata' ) {
		$query->set( 'meta_key', 'geo_latitude' );
		$query->set( 'orderby', 'meta_value_num' );
	}
}
add_action( 'pre_get_posts', 'query_map_geodata_column_orderby' );