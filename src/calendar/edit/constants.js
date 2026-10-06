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
 * The linked event title that opens the modal.
 * Shared by ENTRIES_TEMPLATE and the transform in ../transforms.js.
 */
/**
 * Attributes of the Modal Manager in an entry: the time above the title,
 * with no gap between them. The default flex row with the theme's block gap
 * leaves a large space in a narrow day cell.
 * Shared by ENTRIES_TEMPLATE and the transform in ../transforms.js.
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
 * Attributes of the Modal Content block in a calendar modal.
 */
const MODAL_CONTENT_ATTRIBUTES = {
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
};

/**
 * The centered Close button at the bottom of a calendar modal.
 */
const MODAL_CLOSE_BUTTONS = [
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
 * The inner template inside gatherpress/calendar-entries:
 * Modal Manager holding the start time, the linked event title that opens
 * the modal, and the popover modal content.
 *
 * The title is the trigger, so every event shows and announces its name.
 * The trigger class goes on core/post-title: GatherPress's Modal Manager
 * binds the element with the class or the tag right after it, and here
 * that tag is the title's link.
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
						MODAL_CONTENT_ATTRIBUTES,
						[
							[
								'core/group',
								{
									layout: {
										type: 'flex',
										flexWrap: 'nowrap',
									},
								},
								[
									[
										'gatherpress/event-date',
										{
											style: {
												spacing: {
													padding: {
														top: '0',
														bottom: '0',
														left: '0',
														right: '0',
													},
													margin: {
														top: '0',
														bottom: '0',
														left: '0',
														right: '0',
													},
												},
											},
											fontSize: 'small',
										},
									],
									[
										'core/post-title',
										{
											level: 3,
											isLink: true,
											style: {
												spacing: {
													padding: {
														top: '0',
														bottom: '0',
														left: '0',
														right: '0',
													},
													margin: {
														top: '0',
														bottom: '0',
														left: '0',
														right: '0',
													},
												},
											},
											fontSize: 'small',
										},
									],
								],
							],
							[ 'core/post-excerpt', {} ],
							MODAL_CLOSE_BUTTONS,
						],
					],
				],
			],
		],
	],
];

/**
 * The Day Number paragraph, bound to the day of its cell.
 */
const DAY_NUMBER = [
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
		fontSize: 'small',
		placeholder: 'DD',
		content: 'DD',
		className: 'gatherpress-calendar__day-number',
	},
];

/**
 * The inner template inside gatherpress/calendar-day:
 * Bound Day Number paragraph + Calendar Entries block.
 */
export const DAY_TEMPLATE = [
	[
		'gatherpress/calendar-day',
		{},
		[
			DAY_NUMBER,
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
 * Named formats of the day binding, see Setup::get_day_number_binding_value().
 * PHP translates them when the page renders, so the saved content holds the
 * name and not a date format of the editor's locale.
 */
export const DAY_MODAL_HEADING_FORMAT = 'dayModalHeading';
export const DAY_MODAL_TRIGGER_FORMAT = 'dayModalTrigger';

/**
 * The day template of the "Event Calendar (Day Modal)" variation:
 * Day Number + one Modal Manager per day. Its button covers the whole cell
 * and opens a modal with the date and every entry of that day.
 *
 * The button text is bound to "Events on <date>", so every trigger has its
 * own accessible name. The text is hidden on screen by the day styles.
 */
export const DAY_MODAL_TEMPLATE = [
	[
		'gatherpress/calendar-day',
		{},
		[
			DAY_NUMBER,
			[
				'gatherpress/modal-manager',
				{},
				[
					[
						'core/buttons',
						{ className: 'gatherpress-calendar__day-trigger' },
						[
							[
								'core/button',
								{
									tagName: 'button',
									className:
										'gatherpress-modal--trigger-open',
									text: __(
										'Show events',
										'gatherpress-calendar'
									),
									metadata: {
										bindings: {
											text: {
												source: 'gatherpress/calendar-day',
												args: {
													format: DAY_MODAL_TRIGGER_FORMAT,
												},
											},
										},
									},
								},
							],
						],
					],
					[
						'gatherpress/modal',
						{},
						[
							[
								'gatherpress/modal-content',
								MODAL_CONTENT_ATTRIBUTES,
								[
									[
										'core/heading',
										{
											level: 3,
											metadata: {
												bindings: {
													content: {
														source: 'gatherpress/calendar-day',
														args: {
															format: DAY_MODAL_HEADING_FORMAT,
														},
													},
												},
											},
										},
									],
									[
										'gatherpress/calendar-entries',
										{
											layout: { type: 'default' },
											className: 'is-style-default',
										},
										[
											[
												'core/group',
												{
													layout: {
														type: 'flex',
														flexWrap: 'nowrap',
													},
												},
												[
													ENTRY_START_TIME,
													[
														'core/post-title',
														{
															level: 0,
															isLink: true,
															fontSize: 'small',
														},
													],
												],
											],
										],
									],
									MODAL_CLOSE_BUTTONS,
								],
							],
						],
					],
				],
			],
		],
	],
];

/**
 * The inner template inside gatherpress/calendar:
 * Week container holding the day template.
 */
export const CALENDAR_TEMPLATE = [
	[ 'gatherpress/calendar-week', {}, DAY_TEMPLATE ],
];

/**
 * The complete InnerBlocks tree for a core/query block variation:
 * Bound Month Heading + Pagination (Previous/Next Month) + Calendar Block.
 *
 * @param {Array} dayTemplate Day template of the calendar.
 *
 * @return {Array} Inner blocks of the variation.
 */
const getQueryVariationInnerBlocks = ( dayTemplate ) => [
	[
		'core/heading',
		{
			level: 2,
			metadata: {
				bindings: {
					content: {
						source: 'gatherpress/calendar-heading',
					},
				},
				name: 'Month Heading',
			},
			typography: {
				textAlign: 'center',
			},
			className: 'gatherpress-calendar__month has-text-align-center',
		},
	],
	[
		'core/query-pagination',
		{
			paginationArrow: 'chevron',
			layout: {
				type: 'flex',
				justifyContent: 'space-between',
			},
		},
		[
			[
				'core/query-pagination-previous',
				{
					label: __( 'Previous Month', 'gatherpress-calendar' ),
				},
			],
			[
				'core/query-pagination-next',
				{
					label: __( 'Next Month', 'gatherpress-calendar' ),
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
		[ [ 'gatherpress/calendar-week', {}, dayTemplate ] ],
	],
];

export const QUERY_VARIATION_INNER_BLOCKS =
	getQueryVariationInnerBlocks( DAY_TEMPLATE );

export const QUERY_VARIATION_DAY_MODAL_INNER_BLOCKS =
	getQueryVariationInnerBlocks( DAY_MODAL_TEMPLATE );

/**
 * The date format used throughout the component.
 *
 * @type {string}
 * @since 0.1.0
 */
export const DATE_FORMAT = 'Y-m-d';
