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

const NAME = 'gatherpress-calendar';

/**
 * The "Event Calendar" in the inserter.
 *
 * Intentionally no `innerBlocks`: core/query then shows its placeholder on
 * insert, and "Start blank" lists the calendar designs registered below,
 * like the "Event Query Loop" of GatherPress.
 *
 * GatherPress sets the same `namespace` on every event query, so the
 * class name is needed to tell a calendar apart from its "Event Query Loop".
 */
registerBlockVariation( 'core/query', {
	name: NAME,
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
		namespace: 'gatherpress-event-query',
		className: 'gatherpress-calendar-query',
		enhancedPagination: true,
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
	// ponytail: className must match exactly, so an extra CSS class makes the
	// block an "Event Query Loop" again. A function isActive cannot win over
	// the earlier GatherPress match, see getActiveBlockVariation().
	isActive: [ 'namespace', 'className' ],
	scope: [ 'inserter' ],
} );

/*
 * The calendar designs in the "Start blank" picker. The `namespace` array
 * connects them to the "Event Calendar" variation, so they only show there.
 * Core only uses their `innerBlocks`.
 */
const DESIGNS = [
	{
		name: 'event-modal',
		title: __( 'Event Modals', 'gatherpress-calendar' ),
		description: __(
			'Each event shows in its day and opens its own modal.',
			'gatherpress-calendar'
		),
		icon: 'calendar-alt',
		innerBlocks: QUERY_VARIATION_INNER_BLOCKS,
	},
	{
		name: 'day-modal',
		title: __( 'Day Modal', 'gatherpress-calendar' ),
		description: __(
			'Clicking a day opens a modal with its events.',
			'gatherpress-calendar'
		),
		icon: 'calendar',
		innerBlocks: QUERY_VARIATION_DAY_MODAL_INNER_BLOCKS,
	},
];

DESIGNS.forEach( ( { name, ...design } ) =>
	registerBlockVariation( 'core/query', {
		...design,
		name: `${ NAME }-${ name }`,
		attributes: { namespace: [ NAME ] },
		scope: [ 'block' ],
	} )
);
