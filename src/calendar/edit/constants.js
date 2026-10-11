/**
 * GatherPress Calendar Template Constants
 *
 * @package
 * @since 0.1.0
 */

import { __, _x } from '@wordpress/i18n';

/**
 * The start time of an entry, as plain text.
 * Shared by ENTRIES_TEMPLATE and the transform in ../transforms.js.
 */
export const ENTRY_START_TIME = [
	'gatherpress/event-date',
	{
		displayType: 'start',
		startDateFormat: 'G:i',
		style: {
			spacing: {
				padding: { top: '0', bottom: '0', left: '0', right: '0' },
				margin: { top: '0', bottom: '0', left: '0', right: '0' },
			},
		},
		fontSize: 'small',
	},
];

/**
 * Attributes of the Modal Manager in an entry.
 */
export const ENTRY_MODAL_MANAGER_ATTRIBUTES = {
	layout: {
		type: 'flex',
		orientation: 'vertical',
		justifyContent: 'center',
	},
	style: {
		spacing: {
			blockGap: '0',
		},
	},
};

export const ENTRY_TITLE_TRIGGER = [
	'core/post-title',
	{
		level: 0,
		isLink: true,
		className: 'gatherpress-modal--trigger-open',
		style: {
			spacing: {
				padding: { top: '0', bottom: '0', left: '0', right: '0' },
				margin: { top: '0', bottom: '0', left: '0', right: '0' },
			},
		},
		fontSize: 'small',
	},
];

/**
 * Close button block for the modal content.
 */
export const MODAL_CLOSE_BUTTON = [
	'core/buttons',
	{
		align: 'center',
		layout: {
			type: 'flex',
			justifyContent: 'center',
		},
	},
	[
		[
			'core/button',
			{
				tagName: 'button',
				className: 'gatherpress-modal--trigger-close',
				text: __( 'Close', 'gatherpress-calendar' ),
			},
		],
	],
];

/**
 * Canonical event layout matching gatherpress/event-template with patternPicked flags.
 */
export const EVENT_TEMPLATE_BLOCKS = [
	[ 'gatherpress/event-date', {} ],
	[ 'gatherpress/add-to-calendar', {} ],
	[ 'gatherpress/venue', { patternPicked: true } ],
	[ 'gatherpress/online-event', {} ],
	[ 'gatherpress/rsvp', { patternPicked: true } ],
	[
		'core/paragraph',
		{
			placeholder: __(
				'Add a description of the event and let people know what to expect…',
				'gatherpress-calendar'
			),
		},
	],
	[ 'gatherpress/rsvp-response', { patternPicked: true } ],
	MODAL_CLOSE_BUTTON,
];

/**
 * The inner template inside gatherpress/calendar-entries:
 * Modal Manager holding start time, linked title trigger, and a modal popover
 * seeded with the canonical gatherpress/event-template layout plus a Close button.
 */
export const ENTRIES_TEMPLATE = [
	[
		'gatherpress/modal-manager',
		ENTRY_MODAL_MANAGER_ATTRIBUTES,
		[
			ENTRY_START_TIME,
			ENTRY_TITLE_TRIGGER,
			[
				'gatherpress/modal',
				{},
				[
					[
						'gatherpress/modal-content',
						{
							style: {
								dimensions: { maxWidth: '400px' },
								spacing: {
									padding: {
										top: 'var:preset|spacing|30',
										bottom: 'var:preset|spacing|30',
										left: 'var:preset|spacing|30',
										right: 'var:preset|spacing|30',
									},
								},
							},
							backgroundColor: 'base',
						},
						EVENT_TEMPLATE_BLOCKS,
					],
				],
			],
		],
	],
];

/**
 * The inner template inside gatherpress/calendar-day.
 */
export const DAY_TEMPLATE = [
	[
		'gatherpress/calendar-day',
		{},
		[
			[
				'core/paragraph',
				{
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
			],
			[
				'gatherpress/calendar-entries',
				{
					layout: { type: 'default' },
					className: 'is-style-default',
					style: {
						spacing: {
							blockGap: '0',
						},
						layout: {
							selfStretch: 'fill',
							flexSize: null,
						},
					},
				},
				ENTRIES_TEMPLATE,
			],
		],
	],
];

/**
 * The inner template inside gatherpress/calendar.
 */
export const CALENDAR_TEMPLATE = [
	[ 'gatherpress/calendar-week', {}, DAY_TEMPLATE ],
];

/**
 * The complete InnerBlocks tree for the core/query Event Calendar variation.
 */
export const QUERY_VARIATION_INNER_BLOCKS = [
	[
		'core/heading',
		{
			level: 2,
			className: 'gatherpress-calendar__month has-text-align-center',
			typography: {
				textAlign: 'center',
			},
			metadata: {
				bindings: {
					content: {
						source: 'gatherpress/calendar-heading',
					},
				},
				name: _x(
					'Calendar Heading',
					'Query template heading block name',
					'gatherpress-calendar'
				),
			},
		},
	],
	[
		'core/query-pagination',
		{
			className: 'gatherpress-calendar-pagination',
			paginationArrow: 'chevron',
			layout: {
				type: 'flex',
				justifyContent: 'space-between',
			},
			metadata: {
				name: _x(
					'Calendar Pagination',
					'Query template pagination block name',
					'gatherpress-calendar'
				),
			},
		},
		[
			[
				'core/query-pagination-previous',
				{
					className: 'gatherpress-calendar-pagination-previous',
					label: __( 'Previous Month', 'gatherpress-calendar' ),
					metadata: {
						name: _x(
							'Previous Calendar Period',
							'Query template previous pagination block name',
							'gatherpress-calendar'
						),
					},
				},
			],
			[
				'core/query-pagination-next',
				{
					className: 'gatherpress-calendar-pagination-next',
					label: __( 'Next Month', 'gatherpress-calendar' ),
					metadata: {
						name: _x(
							'Next Calendar Period',
							'Query template next pagination block name',
							'gatherpress-calendar'
						),
					},
				},
			],
		],
	],
	[
		'gatherpress/calendar',
		{
			style: {
				spacing: {
					padding: { top: '0', bottom: '0', left: '0', right: '0' },
				},
			},
		},
		CALENDAR_TEMPLATE,
	],
];

export const DATE_FORMAT = 'Y-m-d';
