/**
 * WordPress dependencies
 */
import { registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	QUERY_VARIATION_INNER_BLOCKS,
	QUERY_VARIATION_DAY_MODAL_INNER_BLOCKS,
} from './edit/constants';

const variation = {
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
		// namespace: 'gatherpress-event-query',
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
			gatherpress_event_query: 'upcoming',
			include_unfinished: 1,
		},
	},
	innerBlocks: QUERY_VARIATION_INNER_BLOCKS,
	scope: [ 'inserter' ],
};

registerBlockVariation( 'core/query', variation );

registerBlockVariation( 'core/query', {
	...variation,
	name: 'gatherpress-calendar-day-modal',
	title: __( 'Event Calendar (Day Modal)', 'gatherpress-calendar' ),
	description: __(
		'Show GatherPress events in a monthly calendar. Clicking a day opens a modal with its events.',
		'gatherpress-calendar'
	),
	innerBlocks: QUERY_VARIATION_DAY_MODAL_INNER_BLOCKS,
} );
