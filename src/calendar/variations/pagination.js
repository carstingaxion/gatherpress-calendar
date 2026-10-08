/**
 * GatherPress Calendar Pagination Block Variations
 *
 * Registers calendar variations of core/query-pagination,
 * core/query-pagination-previous, and core/query-pagination-next.
 *
 * @package GatherPressCalendar
 * @since 0.9.0
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

/**
 * Register variation for core/query-pagination.
 */
registerBlockVariation( 'core/query-pagination', {
	name: 'gatherpress-calendar-pagination',
	title: _x(
		'Calendar Pagination',
		'Block variation name',
		'gatherpress-calendar'
	),
	description: _x(
		'Displays navigation controls to step through calendar time spans.',
		'Block variation description',
		'gatherpress-calendar'
	),
	category: 'gatherpress',
	keywords: [
		__( 'calendar', 'gatherpress-calendar' ),
		__( 'pagination', 'gatherpress-calendar' ),
		__( 'navigation', 'gatherpress-calendar' ),
	],
	attributes: {
		className: 'gatherpress-calendar-pagination',
		paginationArrow: 'chevron',
		layout: {
			type: 'flex',
			justifyContent: 'space-between',
		},
		metadata: {
			name: _x(
				'Calendar Pagination',
				'Block variation name',
				'gatherpress-calendar'
			),
		},
	},
	innerBlocks: [
		[
			'core/query-pagination-previous',
			{
				className: 'gatherpress-calendar-pagination-previous',
				label: __( 'Previous Month', 'gatherpress-calendar' ),
				metadata: {
					name: __( 'Previous Period', 'gatherpress-calendar' ),
				},
			},
		],
		[
			'core/query-pagination-next',
			{
				className: 'gatherpress-calendar-pagination-next',
				label: __( 'Next Month', 'gatherpress-calendar' ),
				metadata: {
					name: __( 'Next Period', 'gatherpress-calendar' ),
				},
			},
		],
	],
	isActive: ( blockAttributes, variationAttributes ) =>
		Boolean(
			blockAttributes?.className
				?.split( ' ' )
				.includes( variationAttributes.className )
		),
	scope: [ 'inserter' ],
} );

/**
 * Register variation for core/query-pagination-previous.
 */
registerBlockVariation( 'core/query-pagination-previous', {
	name: 'gatherpress-calendar-pagination-previous',
	title: _x(
		'Previous Calendar Period',
		'Block variation name',
		'gatherpress-calendar'
	),
	description: _x(
		'Displays the link to navigate to the previous calendar period (month, week, or day).',
		'Block variation description',
		'gatherpress-calendar'
	),
	category: 'gatherpress',
	keywords: [
		__( 'previous', 'gatherpress-calendar' ),
		__( 'calendar', 'gatherpress-calendar' ),
	],
	attributes: {
		className: 'gatherpress-calendar-pagination-previous',
		label: __( 'Previous Month', 'gatherpress-calendar' ),
		metadata: {
			name: _x(
				'Previous Calendar Period',
				'Block variation name',
				'gatherpress-calendar'
			),
		},
	},
	isActive: ( blockAttributes, variationAttributes ) =>
		Boolean(
			blockAttributes?.className
				?.split( ' ' )
				.includes( variationAttributes.className )
		),
	scope: [ 'inserter' ],
} );

/**
 * Register variation for core/query-pagination-next.
 */
registerBlockVariation( 'core/query-pagination-next', {
	name: 'gatherpress-calendar-pagination-next',
	title: _x(
		'Next Calendar Period',
		'Block variation name',
		'gatherpress-calendar'
	),
	description: _x(
		'Displays the link to navigate to the next calendar period (month, week, or day).',
		'Block variation description',
		'gatherpress-calendar'
	),
	category: 'gatherpress',
	keywords: [
		__( 'next', 'gatherpress-calendar' ),
		__( 'calendar', 'gatherpress-calendar' ),
	],
	attributes: {
		className: 'gatherpress-calendar-pagination-next',
		label: __( 'Next Month', 'gatherpress-calendar' ),
		metadata: {
			name: _x(
				'Next Calendar Period',
				'Block variation name',
				'gatherpress-calendar'
			),
		},
	},
	isActive: ( blockAttributes, variationAttributes ) =>
		Boolean(
			blockAttributes?.className
				?.split( ' ' )
				.includes( variationAttributes.className )
		),
	scope: [ 'inserter' ],
} );