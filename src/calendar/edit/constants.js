/**
 * Default template for inner blocks.
 *
 * Defines the initial blocks that appear when the calendar is first added.
 * Users can modify this template by adding, removing, or reordering blocks.
 *
 * @type {Array<Array>}
 * @since 0.1.0
 */
/**
 * Template for each event's popover content, rendered by
 * gatherpress/calendar-entries once per event on the frontend.
 *
 * @type {Array<Array>}
 * @since 0.4.0
 */
export const ENTRIES_TEMPLATE = [
	[ 'core/post-title', { level: 3 } ],
	[ 'gatherpress/event-date' ],
];

export const DAY_TEMPLATE = [
	[
		'gatherpress/calendar-day',
		{},
		[
			[
				'core/paragraph',
				{
					metadata: {
						bindings: {
							content: {
								source: 'gatherpress/calendar-day',
							},
						},
						name: 'Day Number',
					},
					customClassname: 'gatherpress-calendar__day-number',
					textAlign: 'left',
					fontSize: 'small',
					placeholder: 'DD',
					content: 'DD',
				},
			],
			[ 'gatherpress/calendar-entries', {}, ENTRIES_TEMPLATE ],
		],
	],
];

export const TEMPLATE = [ [ 'gatherpress/calendar-week', {}, DAY_TEMPLATE ] ];

/**
 * The date format used throughout the component.
 *
 * @type {string}
 * @since 0.1.0
 */
export const DATE_FORMAT = 'Y-m-d';
