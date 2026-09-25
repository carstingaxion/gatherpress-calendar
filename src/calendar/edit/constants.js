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
 * The inner template inside gatherpress/calendar-entries:
 * Modal Manager holding the trigger link and the popover modal content.
 */
export const ENTRIES_TEMPLATE = [
	[
		'gatherpress/modal-manager',
		{},
		[
			[
				'gatherpress/event-date',
				{
					displayType: 'start',
					isLink: true,
					startDateFormat: 'G:i',
					className: 'gatherpress-modal--trigger-open',
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
							[
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
											className:
												'gatherpress-modal--trigger-close',
											text: __(
												'Close',
												'gatherpress-calendar'
											),
										},
									],
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
 * The inner template inside gatherpress/calendar-day:
 * Bound Day Number paragraph + Calendar Entries block.
 */
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
			],
			[
				'gatherpress/calendar-entries',
				{
					layout: { type: 'default' },
					className: 'is-style-default',
					style: {
						spacing: {
							blockGap: '0',
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
 * The inner template inside gatherpress/calendar:
 * Week container holding the day template.
 */
export const CALENDAR_TEMPLATE = [
	[ 'gatherpress/calendar-week', {}, DAY_TEMPLATE ],
];

/**
 * The complete InnerBlocks tree for the core/query block variation:
 * Bound Month Heading + Pagination (Previous/Next Month) + Calendar Block.
 */
export const QUERY_VARIATION_INNER_BLOCKS = [
	[
		'core/heading',
		{
			level: 2,
			metadata: {
				bindings: {
					content: {
						source: 'gatherpress/calendar-month-heading',
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
		CALENDAR_TEMPLATE,
	],
];

/**
 * The date format used throughout the component.
 *
 * @type {string}
 * @since 0.1.0
 */
export const DATE_FORMAT = 'Y-m-d';
