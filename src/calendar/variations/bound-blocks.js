/**
 * GatherPress Calendar Bound Block Variations
 *
 * Registers variations of core/heading and core/paragraph bound to
 * calendar block-bindings sources.
 *
 * @package
 * @since 0.8.0
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

/**
 * Register variation for core/paragraph bound to gatherpress/calendar-day.
 */
registerBlockVariation( 'core/paragraph', {
	name: 'gatherpress-calendar-day-number',
	title: _x(
		'Calendar Day Number',
		'Block variation name',
		'gatherpress-calendar'
	),
	description: _x(
		'Displays the day number inside a calendar day cell.',
		'Block variation description',
		'gatherpress-calendar'
	),
	category: 'gatherpress',
	keywords: [
		__( 'day', 'gatherpress-calendar' ),
		__( 'number', 'gatherpress-calendar' ),
		__( 'calendar', 'gatherpress-calendar' ),
	],
	attributes: {
		className: 'gatherpress-calendar__day-number',
		fontSize: 'small',
		placeholder: 'DD',
		content: 'DD',
		style: {
			spacing: {
				margin: {
					top: '0',
					bottom: '0',
					left: '0',
					right: '0',
				},
			},
		},
		metadata: {
			bindings: {
				content: {
					source: 'gatherpress/calendar-day',
				},
			},
			name: _x(
				'Day Number',
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
