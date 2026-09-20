/**
 * GatherPress Calendar Block Editor Component
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Placeholder,
	PanelBody,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import { useState, createElement, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import './editor.scss';

import { calculateDateQuery } from './edit/utils/date-utils';
import { generateCalendar } from './edit/utils/calendar-utils';
import { resolveBlockGapCSS } from './edit/utils/style-utils';
import { useCalendarData } from './edit/hooks/useCalendarData';
import { MonthPicker } from './edit/components/MonthPicker';
import { MonthControls } from './edit/components/MonthControls';

const CALENDAR_TEMPLATE = [
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
							metadata: {
								bindings: {
									content: {
										source: 'gatherpress/calendar-day',
									},
								},
							},
							placeholder: '1',
							className: 'gatherpress-calendar__day-number',
						},
					],
					[
						'gatherpress/calendar-entries',
						{
							layout: {
								type: 'default',
								columns: 3,
							},
						},
						[
							[ 'core/post-title', { level: 3, isLink: true } ],
							[ 'core/post-excerpt', {} ],
						],
					],
				],
			],
		],
	],
];

/**
 * Convert block style attributes into inline CSS object.
 */
function extractInlineStyles( attributes = {} ) {
	const styles = {};
	const style = attributes.style || {};

	if ( style.color?.background ) {
		styles.backgroundColor = style.color.background;
	}
	if ( style.color?.text ) {
		styles.color = style.color.text;
	}
	if ( style.spacing?.padding ) {
		const pad = style.spacing.padding;
		if ( typeof pad === 'string' ) {
			styles.padding = pad;
		} else if ( typeof pad === 'object' ) {
			styles.paddingTop = pad.top;
			styles.paddingRight = pad.right;
			styles.paddingBottom = pad.bottom;
			styles.paddingLeft = pad.left;
		}
	}
	if ( style.typography?.fontSize ) {
		styles.fontSize = style.typography.fontSize;
	}
	if ( style.typography?.fontWeight ) {
		styles.fontWeight = style.typography.fontWeight;
	}
	if ( style.typography?.lineHeight ) {
		styles.lineHeight = style.typography.lineHeight;
	}

	return styles;
}

export default function Edit( { attributes, setAttributes, context, clientId } ) {
	const {
		selectedMonth,
		monthModifier = 0,
		showMonthHeading = true,
		monthHeadingLevel = 2,
		showWeekdays = true,
	} = attributes;
	const { query } = context;
	const [ showMonthPicker, setShowMonthPicker ] = useState( false );

	const dateQuery = useMemo(
		() => calculateDateQuery( selectedMonth, monthModifier ),
		[ selectedMonth, monthModifier ]
	);

	const { posts, startOfWeek } = useCalendarData( query, dateQuery );

	const calendar = useMemo(
		() =>
			generateCalendar(
				posts,
				startOfWeek,
				selectedMonth,
				monthModifier
			),
		[ posts, startOfWeek, selectedMonth, monthModifier ]
	);

	// Retrieve template block client IDs and styles so all days reflect changes
	const {
		dayClientId,
		dayAttributes,
		dayNumberAttributes,
	} = useSelect(
		( select ) => {
			const { getBlock } = select( 'core/block-editor' );
			const calendarBlock = getBlock( clientId );
			const weekBlock = calendarBlock?.innerBlocks?.[ 0 ];
			const dayBlock = weekBlock?.innerBlocks?.[ 0 ];
			const dayNumberBlock = dayBlock?.innerBlocks?.find(
				( b ) => b.name === 'core/paragraph'
			);

			return {
				dayClientId: dayBlock?.clientId,
				dayAttributes: dayBlock?.attributes || {},
				dayNumberAttributes: dayNumberBlock?.attributes || {},
			};
		},
		[ clientId ]
	);

	const { selectBlock } = useDispatch( 'core/block-editor' );

	const MonthHeading = useMemo( () => {
		if ( ! showMonthHeading ) {
			return null;
		}

		const level = Math.max( 1, Math.min( 6, monthHeadingLevel ) );

		return createElement(
			`h${ level }`,
			{ className: 'gatherpress-calendar__month' },
			calendar.monthName
		);
	}, [ showMonthHeading, monthHeadingLevel, calendar.monthName ] );

	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar-block',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gatherpress-calendar__template-host',
		},
		{
			allowedBlocks: [ 'gatherpress/calendar-week' ],
			template: CALENDAR_TEMPLATE,
			templateLock: false,
		}
	);

	const tableStyle = {
		gap: resolveBlockGapCSS( attributes.style?.spacing?.blockGap ),
	};

	if ( ! query ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon="calendar-alt"
					label={ __( 'GatherPress Calendar', 'gatherpress-calendar' ) }
					instructions={ __(
						'This block must be used inside a Query Loop block.',
						'gatherpress-calendar'
					) }
				/>
			</div>
		);
	}

	const handleMonthSelect = ( value ) => {
		setAttributes( { selectedMonth: value } );
		setShowMonthPicker( false );
	};

	const handleMonthChange = ( value ) => {
		setAttributes( { selectedMonth: value } );
	};

	const handleModifierChange = ( value ) => {
		const numValue = value === '' ? 0 : parseInt( value, 10 );
		setAttributes( {
			monthModifier: isNaN( numValue ) ? 0 : numValue,
		} );
	};

	// Shared styles extracted from the template blocks
	const dayStyles = extractInlineStyles( dayAttributes );
	const dayNumberStyles = extractInlineStyles( dayNumberAttributes );

	let templateMounted = false;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Calendar Settings', 'gatherpress-calendar' ) }>
					<p>
						{ __(
							'Select a specific month to display, or leave empty to show the current month.',
							'gatherpress-calendar'
						) }
					</p>
					{ showMonthPicker ? (
						<MonthPicker
							selectedMonth={ selectedMonth }
							onSelect={ handleMonthSelect }
							onCancel={ () => setShowMonthPicker( false ) }
						/>
					) : (
						<MonthControls
							selectedMonth={ selectedMonth }
							monthModifier={ monthModifier }
							onMonthChange={ handleMonthChange }
							onModifierChange={ handleModifierChange }
							onOpenPicker={ () => setShowMonthPicker( true ) }
						/>
					) }

					<hr style={ { margin: '16px 0', borderTop: '1px solid #ddd' } } />

					<ToggleControl
						label={ __( 'Show Month Heading', 'gatherpress-calendar' ) }
						checked={ showMonthHeading }
						onChange={ ( value ) => setAttributes( { showMonthHeading: value } ) }
						help={ __(
							'Display the month name and year above the calendar.',
							'gatherpress-calendar'
						) }
					/>

					{ showMonthHeading && (
						<RangeControl
							label={ __( 'Heading Level', 'gatherpress-calendar' ) }
							value={ monthHeadingLevel }
							onChange={ ( value ) =>
								setAttributes( { monthHeadingLevel: value || 2 } )
							}
							min={ 1 }
							max={ 6 }
							step={ 1 }
							help={ __(
								'Select the HTML heading level (h1-h6) for the month name.',
								'gatherpress-calendar'
							) }
						/>
					) }

					<ToggleControl
						label={ __( 'Show Weekdays', 'gatherpress-calendar' ) }
						checked={ showWeekdays }
						onChange={ ( value ) => setAttributes( { showWeekdays: value } ) }
						help={ __(
							'Display the days of the week inside the calendar header.',
							'gatherpress-calendar'
						) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="gatherpress-calendar">
					{ MonthHeading }
					<div className="gatherpress-calendar__table" style={ tableStyle }>
						{ showWeekdays && (
							<div className="gatherpress-calendar__table-head">
								{ calendar.dayNames.map( ( dayName, index ) => (
									<div key={ index } className="gatherpress-calendar__th">
										{ dayName }
									</div>
								) ) }
							</div>
						) }

						{ calendar.weeks.map( ( week, weekIdx ) => (
							<div key={ weekIdx } className="gatherpress-calendar__week">
								{ week.map( ( day, dayIdx ) => {
									// The first day of the month hosts the editable template block
									if ( ! day.isEmpty && ! templateMounted ) {
										templateMounted = true;
										return (
											<div
												key={ dayIdx }
												className="gatherpress-calendar__day-template-slot"
											>
												<div { ...innerBlocksProps } />
											</div>
										);
									}

									// All other days route click events to select the Calendar Day template block
									return (
										<div
											key={ dayIdx }
											className={ `gatherpress-calendar__day ${
												day.isEmpty ? 'is-empty' : ''
											} ${ day.posts?.length > 0 ? 'has-posts' : '' }` }
											style={ ! day.isEmpty ? dayStyles : undefined }
											onClick={
												dayClientId && ! day.isEmpty
													? ( e ) => {
															e.stopPropagation();
															selectBlock( dayClientId );
													  }
													: undefined
											}
										>
											{ ! day.isEmpty && (
												<div className="gatherpress-calendar__day-content">
													<p
														className="gatherpress-calendar__day-number"
														style={ dayNumberStyles }
													>
														{ day.day }
													</p>
													{ day.posts?.length > 0 && (
														<div className="gatherpress-calendar__events">
															{ day.posts.map( ( post ) => (
																<div
																	key={ post.id }
																	className="gatherpress-calendar__event-item"
																>
																	<span
																		className="gatherpress-calendar__event"
																		aria-hidden="true"
																	/>
																</div>
															) ) }
														</div>
													)}
												</div>
											)}
										</div>
									);
								} ) }
							</div>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}