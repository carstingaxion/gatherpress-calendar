import { __ } from '@wordpress/i18n';

/**
 * Default template for inner blocks.
 *
 * Defines the initial blocks that appear when the calendar is first added.
 * Users can modify this template by adding, removing, or reordering blocks.
 *
 * @type {Array<Array>}
 * @since 0.1.0
 */
export const TEMPLATE = [
	[
		'gatherpress/calendar-week',
		{},
		[
			[
				'gatherpress/calendar-day',
				{},
				[
					[
						'core/paragraph',
						{
							className: 'gatherpress-calendar__day-number',
							metadata: {
								bindings: {
									content: {
										source: 'gatherpress/calendar-day',
									},
								},
								name: __('Day Number', 'gatherpress-calendar')
							},
							placeholder: 'DD',
						},
					],
					[
						'gatherpress/calendar-entries',
						{},
						[
							[ 'core/post-title', { level: 3 } ],
							[ 'gatherpress/event-date' ],
						],
					],
				],
			],
		],
	],
];

/**
 * The date format used throughout the component.
 *
 * @type {string}
 * @since 0.1.0
 */
export const DATE_FORMAT = 'Y-m-d';
