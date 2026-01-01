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
	const mapRef = useRef( null );
	const mapInstanceRef = useRef( null );
	const markersRef = useRef( [] );
	const [ leafletLoaded, setLeafletLoaded ] = useState( false );

	const { posts } = useSelect(
		( select ) => {
			if ( ! query ) {
				return { posts: [] };
			}

			const { getEntityRecords } = select( coreStore );
			
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

			return {
				posts: getEntityRecords( 'postType', cleanQuery.postType || 'post', queryArgs ) || [],
			};
		},
		[ query ]
	);

	// Load Leaflet library
	useEffect( () => {
		// Check if Leaflet is already loaded
		if ( window.L ) {
			setLeafletLoaded( true );
			return;
		}

		// Load Leaflet CSS
		const link = document.createElement( 'link' );
		link.rel = 'stylesheet';
		link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
		link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
		link.crossOrigin = '';
		document.head.appendChild( link );

		// Load Leaflet JS
		const script = document.createElement( 'script' );
		script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
		script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
		script.crossOrigin = '';
		script.onload = () => setLeafletLoaded( true );
		script.onerror = () => console.error( 'Failed to load Leaflet' );
		document.head.appendChild( script );

		return () => {
			if ( link.parentNode ) {
				link.parentNode.removeChild( link );
			}
			if ( script.parentNode ) {
				script.parentNode.removeChild( script );
			}
		};
	}, [] );

	// Initialize map
	useEffect( () => {
		if ( ! leafletLoaded || ! mapRef.current || mapInstanceRef.current ) {
			return;
		}

		try {
			const map = window.L.map( mapRef.current ).setView( [ 51.505, -0.09 ], defaultZoom );
			
			window.L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 19
			} ).addTo( map );

			mapInstanceRef.current = map;

			// Small delay to ensure map renders properly
			setTimeout( () => {
				map.invalidateSize();
			}, 100 );
		} catch ( error ) {
			console.error( 'Failed to initialize map:', error );
		}

		return () => {
			if ( mapInstanceRef.current ) {
				try {
					mapInstanceRef.current.remove();
				} catch ( e ) {
					console.error( 'Error removing map:', e );
				}
				mapInstanceRef.current = null;
			}
		};
	}, [ leafletLoaded, defaultZoom ] );

	// Update markers when posts change
	useEffect( () => {
		if ( ! mapInstanceRef.current || ! leafletLoaded || ! posts || posts.length === 0 ) {
			return;
		}

		const map = mapInstanceRef.current;
		
		// Clear existing markers
		markersRef.current.forEach( ( marker ) => {
			try {
				map.removeLayer( marker );
			} catch ( e ) {
				// Marker might already be removed
			}
		} );
		markersRef.current = [];

		// Add markers for posts with geo data
		const bounds = [];
		posts.forEach( ( post ) => {
			const lat = post.meta?.geo_latitude || post.meta?.[ 'geo_latitude' ];
			const lng = post.meta?.geo_longitude || post.meta?.[ 'geo_longitude' ];
			
			if ( lat && lng ) {
				try {
					const marker = window.L.marker( [ parseFloat( lat ), parseFloat( lng ) ] ).addTo( map );
					marker.bindPopup( post.title?.rendered || __( '(No title)', 'gatherpress-calendar' ) );
					markersRef.current.push( marker );
					bounds.push( [ parseFloat( lat ), parseFloat( lng ) ] );
				} catch ( error ) {
					console.error( 'Error adding marker:', error );
				}
			}
		} );

		// Fit map to markers
		if ( bounds.length > 0 ) {
			try {
				if ( bounds.length === 1 ) {
					map.setView( bounds[ 0 ], defaultZoom );
				} else {
					map.fitBounds( bounds, { padding: [ 50, 50 ] } );
				}
			} catch ( error ) {
				console.error( 'Error fitting bounds:', error );
			}
		}
	}, [ posts, leafletLoaded, defaultZoom ] );

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
			</InspectorControls>
			<div { ...blockProps }>
				<div className="gatherpress-query-map">
					{ ! leafletLoaded ? (
						<div className="gatherpress-query-map__loading" style={ { height: mapHeight } }>
							<p>{ __( 'Loading map...', 'gatherpress-calendar' ) }</p>
						</div>
					) : (
						<div
							ref={ mapRef }
							className="gatherpress-query-map__map"
							style={ { height: mapHeight } }
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