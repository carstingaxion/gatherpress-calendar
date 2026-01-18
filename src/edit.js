/**
 * GatherPress Calendar Block Editor Component
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @package
 * @since 0.1.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	Placeholder,
	PanelBody,
	RangeControl,
	BoxControl,
	BorderControl,
	ToggleControl,
} from '@wordpress/components';
import { useState, createElement, useMemo } from '@wordpress/element';

/**
 * Editor-specific styles
 *
 * Styles defined here are only applied within the block editor context.
 * They help distinguish the editor view from the frontend display.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { TEMPLATE } from './edit/constants';

import { calculateDateQuery } from './edit/utils/date-utils';
import { generateCalendar } from './edit/utils/calendar-utils';
import { boxControlToCSS, borderControlToCSS } from './edit/utils/style-utils';

import { useCalendarData } from './edit/hooks/useCalendarData';

import { MonthPicker } from './edit/components/MonthPicker';
import { MonthControls } from './edit/components/MonthControls';
import { CalendarTable } from './edit/components/CalendarTable';
import { TemplateConfig } from './edit/components/TemplateConfig';

/**
 * Edit Component
 *
 * Main editor component for the GatherPress Calendar block.
 * Handles:
 * - Rendering the calendar preview with posts
 * - Month selection and month modifier controls
 * - Month heading visibility and level controls
 * - Template configuration interface
 * - Popover styling controls
 * - Query context validation
 *
 * Component Lifecycle:
 * 1. Receives attributes and context from WordPress
 * 2. Uses useSelect to fetch posts based on query context
 * 3. Generates calendar structure from posts
 * 4. Renders calendar preview and controls
 * 5. Updates attributes when user interacts with controls
 *
 * @since 0.1.0
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.attributes    - Block attributes.
 * @param {Function} props.setAttributes - Function to update block attributes.
 * @param {Object}   props.context       - Context from parent blocks.
 *
 * @return {Element} React element rendered in the editor.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		selectedMonth,
		monthModifier = 0,
		templateConfigStyle = {},
		showMonthHeading = true,
		monthHeadingLevel = 2,
	} = attributes;
	const { query } = context;
	const [ showMonthPicker, setShowMonthPicker ] = useState( false );

	// Calculate date query based on selectedMonth and monthModifier.
	const dateQuery = useMemo(
		() => calculateDateQuery( selectedMonth, monthModifier ),
		[ selectedMonth, monthModifier ]
	);

	// Fetch posts and site settings.
	const { posts, startOfWeek } = useCalendarData( query, dateQuery );

	// Generate calendar structure.
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

	// Render month heading with dynamic tag level.
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
			className: 'gatherpress-calendar-template',
		},
		{
			template: TEMPLATE,
			templateLock: false,
		}
	);

	// Show placeholder if block is not inside a Query Loop.
	if ( ! query ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon="calendar-alt"
					label={ __(
						'GatherPress Calendar',
						'gatherpress-calendar'
					) }
					instructions={ __(
						'This block must be used inside a Query Loop block.',
						'gatherpress-calendar'
					) }
				/>
			</div>
		);
	}

	// Build inline styles for template config preview.
	const templateConfigStyles = {
		backgroundColor: templateConfigStyle.backgroundColor || undefined,
		padding: boxControlToCSS( templateConfigStyle.padding ) || undefined,
		...borderControlToCSS( {
			width: templateConfigStyle.borderWidth,
			style: templateConfigStyle.borderStyle,
			color: templateConfigStyle.borderColor,
			radius: templateConfigStyle.borderRadius,
		} ),
		boxShadow: templateConfigStyle.boxShadow || undefined,
	};

	// Handlers
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

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Calendar Settings', 'gatherpress-calendar' ) }
				>
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

					<hr
						style={ {
							margin: '16px 0',
							borderTop: '1px solid #ddd',
						} }
					/>

					<ToggleControl
						label={ __(
							'Show Month Heading',
							'gatherpress-calendar'
						) }
						checked={ showMonthHeading }
						onChange={ ( value ) =>
							setAttributes( { showMonthHeading: value } )
						}
						help={ __(
							'Display the month name and year above the calendar.',
							'gatherpress-calendar'
						) }
					/>

					{ showMonthHeading && (
						<RangeControl
							label={ __(
								'Heading Level',
								'gatherpress-calendar'
							) }
							value={ monthHeadingLevel }
							onChange={ ( value ) =>
								setAttributes( {
									monthHeadingLevel: value || 2,
								} )
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
				</PanelBody>

				<PanelBody
					title={ __( 'Template Style', 'gatherpress-calendar' ) }
					initialOpen={ false }
				>
					<PanelColorSettings
						title={ __( 'Background', 'gatherpress-calendar' ) }
						colorSettings={ [
							{
								value: templateConfigStyle.backgroundColor,
								onChange: ( backgroundColor ) => {
									setAttributes( {
										templateConfigStyle: {
											...templateConfigStyle,
											backgroundColor,
										},
									} );
								},
								label: __(
									'Background Color',
									'gatherpress-calendar'
								),
							},
						] }
					/>

					<BoxControl
						label={ __( 'Padding', 'gatherpress-calendar' ) }
						values={ templateConfigStyle.padding }
						onChange={ ( padding ) => {
							setAttributes( {
								templateConfigStyle: {
									...templateConfigStyle,
									padding,
								},
							} );
						} }
					/>

					<BorderControl
						label={ __( 'Border', 'gatherpress-calendar' ) }
						value={ {
							width: templateConfigStyle.borderWidth,
							style: templateConfigStyle.borderStyle,
							color: templateConfigStyle.borderColor,
							radius: templateConfigStyle.borderRadius,
						} }
						onChange={ ( border ) => {
							setAttributes( {
								templateConfigStyle: {
									...templateConfigStyle,
									borderWidth: border.width,
									borderStyle: border.style,
									borderColor: border.color,
									borderRadius: border.radius,
								},
							} );
						} }
					/>

					<RangeControl
						label={ __(
							'Box Shadow Blur',
							'gatherpress-calendar'
						) }
						value={ parseInt(
							templateConfigStyle.boxShadow?.match(
								/\d+/
							)?.[ 0 ] || 0
						) }
						onChange={ ( blur ) => {
							setAttributes( {
								templateConfigStyle: {
									...templateConfigStyle,
									boxShadow:
										blur > 0
											? `0 8px ${ blur }px rgba(0, 0, 0, 0.15)`
											: undefined,
								},
							} );
						} }
						min={ 0 }
						max={ 50 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="gatherpress-calendar">
					{ MonthHeading }
					<CalendarTable calendar={ calendar } />
					<TemplateConfig
						templateConfigStyles={ templateConfigStyles }
						innerBlocksProps={ innerBlocksProps }
					/>
				</div>
			</div>
		</>
	);
}
