/**
 * WordPress dependencies
 */
import { registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { QUERY_VARIATION_INNER_BLOCKS } from './edit/constants';

import './variation-controls';


registerBlockVariation( 'core/query', {
	name: 'gatherpress-calendar',
	title: __( 'Event Calendar', 'gatherpress-calendar' ),
	description: __(
		'Show GatherPress events in a monthly calendar format.',
		'gatherpress-calendar'
	),
	icon: 'calendar-alt',
	category: 'gatherpress',
	keywords: [
		__( 'calendar', 'gatherpress-calendar' ),
		__( 'event', 'gatherpress-calendar' ),
		__( 'query', 'gatherpress-calendar' ),
	],
	attributes: {
		namespace: 'gatherpress-calendar-query',
		enhancedPagination: true,
		// className: 'gatherpress-event-query',
		query: {
			perPage: 5,
			pages: 0,
			offset: 0,
			postType: 'gatherpress_event',
			order: 'asc',
			orderBy: 'datetime',
			inherit: false,
			excludeCurrent: null,
			parents: [],
			sticky: '',
			format: [],
			selectedMonth:null,
			monthModifier:null
		},
	},
	innerBlocks: QUERY_VARIATION_INNER_BLOCKS,
	scope: [ 'inserter' ],
		// Gate on `namespace` only. Including `query.postType` here would
	// drop the variation match the moment a user picks a custom event-
	// supporting post type, which in turn drops the "Event Card with
	// RSVP" starter pattern out of the Change design picker since that
	// pattern is scoped to this variation.
	isActive: [ 'namespace' ],
		// Disabling irrelevant or unsupported query controls
	// @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/extending-the-query-loop-block/#disabling-irrelevant-or-unsupported-query-controls
	allowedControls: [ 'inherit', 'postType', 'taxQuery', 'author', 'search' ],
} );
