import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { Placeholder, PanelBody, RangeControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useRef, useState } from '@wordpress/element';

import './editor.scss';

const TEMPLATE = [
	['core/post-title', { level: 3 }],
	['core/post-excerpt'],
];

export default function Edit( { attributes, setAttributes, context } ) {
	const { mapHeight, defaultZoom } = attributes;
	const { query } = context;
	const mapContainerRef = useRef( null );
	const mapInstanceRef = useRef( null );
	const markersClusterRef = useRef( null );
	const initTimeoutRef = useRef( null );
	const [ mapReady, setMapReady ] = useState( false );

	const { posts, isResolving } = useSelect(
		( select ) => {
			if ( ! query ) {
				return { posts: [], isResolving: false };
			}

			const { getEntityRecords, isResolving: checkResolving } = select( coreStore );
			
			const cleanQuery = { ...query };
			delete cleanQuery.gatherpress_event_query;
			delete cleanQuery.include_unfinished;
			
			if ( cleanQuery.orderBy === 'datetime' ) {
				cleanQuery.orderBy = 'date';
			}

			const queryArgs = {
				per_page: cleanQuery.perPage || 100,
				order: cleanQuery.order || 'DESC',
				orderby: cleanQuery.orderBy || 'date',
				_embed: 'wp:term',
			};

			if ( cleanQuery.taxQuery ) {
				Object.keys( cleanQuery.taxQuery ).forEach( ( taxonomy ) => {
					queryArgs[ taxonomy ] = cleanQuery.taxQuery[ taxonomy ];
				} );
			}

			if ( cleanQuery.author ) {
				queryArgs.author = cleanQuery.author;
			}

			if ( cleanQuery.search ) {
				queryArgs.search = cleanQuery.search;
			}

			const postType = cleanQuery.postType || 'post';
			const fetchedPosts = getEntityRecords( 'postType', postType, queryArgs ) || [];
			const resolving = checkResolving( 'getEntityRecords', [ 'postType', postType, queryArgs ] );

			return {
				posts: fetchedPosts,
				isResolving: resolving,
			};
		},
		[ query ]
	);

	// Initialize map - single effect with proper timing
	useEffect( () => {
		// Check if Leaflet is available
		if ( typeof window === 'undefined' || ! window.L || ! window.L.markerClusterGroup ) {
			return;
		}

		// Don't re-initialize
		if ( mapInstanceRef.current ) {
			return;
		}

		const container = mapContainerRef.current;
		if ( ! container ) {
			return;
		}

		// Critical: Ensure container has explicit dimensions
		const initializeMap = () => {
			try {
				// Clear any existing content
				container.innerHTML = '';
				
				// Set explicit dimensions to ensure Leaflet can initialize
				container.style.width = '100%';
				container.style.height = mapHeight;
				container.style.position = 'relative';

				// Initialize Leaflet map
				const map = window.L.map( container, {
					preferCanvas: true,
					zoomControl: true,
				} ).setView( [ 20, 0 ], 2 );

				// Add tile layer
				window.L.tileLayer(
					'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					{
						attribution: '© OpenStreetMap contributors',
						maxZoom: 19,
					}
				).addTo( map );

				// Create marker cluster group
				const markersCluster = window.L.markerClusterGroup( {
					showCoverageOnHover: false,
					maxClusterRadius: 80,
					spiderfyOnMaxZoom: true,
					zoomToBoundsOnClick: true,
				} );
				map.addLayer( markersCluster );

				// Store references
				mapInstanceRef.current = map;
				markersClusterRef.current = markersCluster;
				setMapReady( true );

				// Force proper sizing after initialization
				setTimeout( () => {
					if ( map ) {
						map.invalidateSize();
					}
				}, 250 );
			} catch ( error ) {
				console.error( '[Query Map] Error initializing map:', error );
			}
		};

		// Use multiple timing strategies to ensure initialization
		// 1. Immediate requestAnimationFrame
		const rafId = requestAnimationFrame( () => {
			// 2. Small delay to ensure DOM is painted
			initTimeoutRef.current = setTimeout( initializeMap, 100 );
		} );

		return () => {
			cancelAnimationFrame( rafId );
			if ( initTimeoutRef.current ) {
				clearTimeout( initTimeoutRef.current );
			}
		};
	}, [] ); // Empty deps - initialize once only

	// Cleanup on unmount
	useEffect( () => {
		return () => {
			if ( mapInstanceRef.current ) {
				try {
					if ( markersClusterRef.current ) {
						markersClusterRef.current.clearLayers();
						markersClusterRef.current = null;
					}
					mapInstanceRef.current.remove();
					mapInstanceRef.current = null;
					setMapReady( false );
				} catch ( e ) {
					console.error( '[Query Map] Error during cleanup:', e );
				}
			}
		};
	}, [] );

	// Update markers when posts change
	useEffect( () => {
		if ( ! mapReady || ! mapInstanceRef.current || ! markersClusterRef.current ) {
			return;
		}

		if ( ! posts || posts.length === 0 ) {
			return;
		}

		// Clear existing markers
		markersClusterRef.current.clearLayers();

		// Filter posts with valid geodata
		const validPosts = posts.filter( ( post ) => {
			const lat = post.meta?.geo_latitude || post.meta?.[ 'geo_latitude' ];
			const lng = post.meta?.geo_longitude || post.meta?.[ 'geo_longitude' ];
			return lat && lng && ! isNaN( parseFloat( lat ) ) && ! isNaN( parseFloat( lng ) );
		} );

		if ( validPosts.length === 0 ) {
			return;
		}

		const bounds = [];

		// Add markers for each post
		validPosts.forEach( ( post ) => {
			const lat = parseFloat( post.meta.geo_latitude || post.meta[ 'geo_latitude' ] );
			const lng = parseFloat( post.meta.geo_longitude || post.meta[ 'geo_longitude' ] );

			try {
				const marker = window.L.marker( [ lat, lng ] );
				
				const title = post.title?.rendered || __( '(No title)', 'gatherpress-calendar' );
				const popupContent = `<div class="query-map-popup"><strong>${title}</strong></div>`;
				marker.bindPopup( popupContent );

				markersClusterRef.current.addLayer( marker );
				bounds.push( [ lat, lng ] );
			} catch ( error ) {
				console.error( '[Query Map] Error adding marker:', error );
			}
		} );

		// Fit bounds to show all markers
		if ( bounds.length > 0 ) {
			try {
				if ( bounds.length === 1 ) {
					mapInstanceRef.current.setView( bounds[ 0 ], defaultZoom );
				} else {
					const boundsObj = window.L.latLngBounds( bounds );
					if ( boundsObj.isValid() ) {
						mapInstanceRef.current.fitBounds( boundsObj, { padding: [ 50, 50 ] } );
					}
				}
			} catch ( error ) {
				console.error( '[Query Map] Error fitting bounds:', error );
			}
		}
	}, [ posts, mapReady, defaultZoom ] );

	const blockProps = useBlockProps( {
		className: 'gatherpress-query-map-block',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gatherpress-query-map-template',
		},
		{
			template: TEMPLATE,
			templateLock: false,
		}
	);

	if ( ! query ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon="location-alt"
					label={ __( 'Query Map', 'gatherpress-calendar' ) }
					instructions={ __(
						'This block must be used inside a Query Loop block.',
						'gatherpress-calendar'
					) }
				/>
			</div>
		);
	}

	const postsWithGeo = posts.filter( ( post ) => {
		const lat = post.meta?.geo_latitude || post.meta?.[ 'geo_latitude' ];
		const lng = post.meta?.geo_longitude || post.meta?.[ 'geo_longitude' ];
		return lat && lng;
	} );

	const hasLeaflet = typeof window !== 'undefined' && window.L && window.L.markerClusterGroup;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Map Settings', 'gatherpress-calendar' ) }>
					<TextControl
						label={ __( 'Map Height', 'gatherpress-calendar' ) }
						value={ mapHeight }
						onChange={ ( value ) => setAttributes( { mapHeight: value } ) }
						help={ __( 'CSS height value (e.g., 500px, 50vh)', 'gatherpress-calendar' ) }
					/>
					<RangeControl
						label={ __( 'Default Zoom Level', 'gatherpress-calendar' ) }
						value={ defaultZoom }
						onChange={ ( value ) => setAttributes( { defaultZoom: value } ) }
						min={ 1 }
						max={ 18 }
						help={ __( 'Initial zoom level for the map', 'gatherpress-calendar' ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Debug Info', 'gatherpress-calendar' ) } initialOpen={ false }>
					<p><strong>Leaflet:</strong> { hasLeaflet ? `Ready (${window.L?.version})` : 'Loading...' }</p>
					<p><strong>Map:</strong> { mapReady ? 'Initialized' : 'Not ready' }</p>
					<p><strong>Total posts:</strong> { posts.length }</p>
					<p><strong>Posts with geodata:</strong> { postsWithGeo.length }</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="gatherpress-query-map">
					{ ! hasLeaflet ? (
						<div className="gatherpress-query-map__loading" style={ { height: mapHeight } }>
							<p>{ __( 'Loading map library...', 'gatherpress-calendar' ) }</p>
						</div>
					) : isResolving ? (
						<div className="gatherpress-query-map__loading" style={ { height: mapHeight } }>
							<p>{ __( 'Loading posts...', 'gatherpress-calendar' ) }</p>
						</div>
					) : postsWithGeo.length === 0 ? (
						<div className="gatherpress-query-map__empty" style={ { height: mapHeight } }>
							<p>{ __( 'No posts with geographic data found.', 'gatherpress-calendar' ) }</p>
							<p>{ __( 'Generate demo data from Tools → Query Map Demo', 'gatherpress-calendar' ) }</p>
						</div>
					) : (
						<div
							ref={ mapContainerRef }
							className="gatherpress-query-map__map"
							style={ { height: mapHeight, width: '100%' } }
						/>
					) }
					<div className="gatherpress-query-map__template-config">
						<p className="gatherpress-query-map__template-label">
							{ __(
								'Configure how posts appear in map popups:',
								'gatherpress-calendar'
							) }
						</p>
						<div { ...innerBlocksProps } />
					</div>
				</div>
			</div>
		</>
	);
}