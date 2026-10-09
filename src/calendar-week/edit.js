import { useMemo, memo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import {
	BlockContextProvider,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, BaseControl, ColorPalette } from '@wordpress/components';
import './editor.scss';

import { DAY_TEMPLATE } from '../calendar/edit/constants';
import { DayPreviewCell } from '../calendar/edit/components/DayPreviewCell';
import { useStableValue } from '../utils/use-stable-value';

const EMPTY_ARRAY = [];
const NOOP = () => {};
const SAMPLE_PREVIEW_DAYS = [ 1, 2, 3, 4, 5, 6, 7 ];

/**
 * Edit Component for Calendar Week
 *
 * Renders one week row. Exactly one day (the one matching the
 * `gatherpress/activeDate` context) is mounted as the real, live/editable
 * gatherpress/calendar-day block via InnerBlocks. The other days in the
 * row are read-only virtual previews of that same day template, rendered
 * with their own date/day-number/posts context - mirroring what
 * Calendar_Week::render() does on the frontend.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @param {Object}   props.context       Context provided by the Calendar block.
 * @param {string}   props.clientId      This week block's client ID.
 *
 * @return {Element} Week row element.
 */
export default memo( function Edit( {
	attributes,
	setAttributes,
	context,
	clientId,
} ) {
	const { zebraColor = '', className = '' } = attributes || {};
	const isZebra = className.includes( 'is-style-zebra' );

	const rawWeekDays = context?.[ 'gatherpress/weekDays' ];
	const isStandalonePreview = ! rawWeekDays;

	const weekDays = useMemo(
		() => rawWeekDays ?? EMPTY_ARRAY,
		[ rawWeekDays ]
	);

	const weekNumber = context?.[ 'gatherpress/weekNumber' ] ?? 0;
	const activeDate = context?.[ 'gatherpress/activeDate' ] ?? '';
	const setActiveDate = context?.[ 'gatherpress/setActiveDate' ] ?? NOOP;

	// The real day template's inner blocks (Day Number, Post Title, Event
	// Date, etc.) and the real day block's own attributes (for color/border
	// style parity), used to render the non-active days as previews.
	const { dayInnerBlocks, dayBlockAttributes } = useStableValue(
		useSelect(
			( select ) => {
				const { getBlocks } = select( blockEditorStore );
				const dayBlock = getBlocks( clientId )[ 0 ];
				return {
					dayInnerBlocks: dayBlock
						? getBlocks( dayBlock.clientId )
						: [],
					dayBlockAttributes: dayBlock?.attributes ?? {},
				};
			},
			[ clientId ]
		)
	);

	const style = useMemo( () => {
		const inlineStyles = {};
		if ( isZebra && zebraColor ) {
			inlineStyles[ '--gatherpress-calendar-zebra-color' ] = zebraColor;
		}
		return inlineStyles;
	}, [ isZebra, zebraColor ] );

	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar__week',
		style,
	} );

	const { children, ...innerBlocksWrapperProps } = useInnerBlocksProps(
		blockProps,
		{
			allowedBlocks: [ 'gatherpress/calendar-day' ],
			template: DAY_TEMPLATE,
			templateLock: false,
			renderAppender: false,
		}
	);

	const activeDayIndex = useMemo(
		() => weekDays.findIndex( ( day ) => day.date === activeDate ),
		[ weekDays, activeDate ]
	);
	const activeDay = weekDays[ activeDayIndex ];

	// The live day block doesn't have real calendar-week/calendar-day
	// ancestors providing dayDate/dayNumber/etc., so we supply them here,
	// exactly like the preview cells do.
	const activeDayContext = useMemo(
		() =>
			activeDay
				? {
						'gatherpress/dayDate': activeDay.date ?? '',
						'gatherpress/dayNumber': activeDay.day ?? 0,
						'gatherpress/dayPosts': activeDay.posts ?? [],
						'gatherpress/isEmpty': !! activeDay.isEmpty,
						'gatherpress/isToday': !! activeDay.isToday,
						'gatherpress/weekday': activeDay.weekday ?? '',
						'gatherpress/isWeekend': !! activeDay.isWeekend,
					}
				: {},
		[ activeDay ]
	);

	// In standalone preview environments (e.g. Block Styles hover popover),
	// enforce horizontal CSS Grid layout with repeat(7, 1fr) so cells stay horizontal.
	if ( isStandalonePreview ) {
		const previewWrapperProps = {
			...innerBlocksWrapperProps,
			style: {
				...innerBlocksWrapperProps.style,
				display: 'grid',
				gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
				gap: '2px',
				width: '100%',
			},
		};

		return (
			<table
				className="gatherpress-calendar__table"
				style={ {
					width: '100%',
					borderCollapse: 'collapse',
					display: 'block',
				} }
			>
				<tbody style={ { display: 'block', width: '100%' } }>
					<tr { ...previewWrapperProps }>
						{ SAMPLE_PREVIEW_DAYS.map( ( dayNum ) => (
							<td
								key={ dayNum }
								className="gatherpress-calendar__day"
								style={ {
									minHeight: '28px',
									height: '56px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '11px',
									boxSizing: 'border-box',
								} }
							>
								{ dayNum }
							</td>
						) ) }
					</tr>
				</tbody>
			</table>
		);
	}

	return (
		<>
			{ isZebra && (
				<InspectorControls>
					<PanelBody
						title={ __( 'Zebra Color', 'gatherpress-calendar' ) }
						initialOpen={ true }
					>
						<BaseControl
							id={ `gatherpress-calendar-week-zebra-color-${ clientId }` }
							label={ __(
								'Stripe Color',
								'gatherpress-calendar'
							) }
							help={ __(
								'Custom color for alternating week rows.',
								'gatherpress-calendar'
							) }
						>
							<ColorPalette
								value={ zebraColor }
								onChange={ ( newColor ) =>
									setAttributes( {
										zebraColor: newColor || '',
									} )
								}
								clearable
							/>
						</BaseControl>
					</PanelBody>
				</InspectorControls>
			) }
			<tr { ...innerBlocksWrapperProps }>
				{ weekNumber > 0 && (
					<th scope="row" className="gatherpress--screen-reader-text">
						{ sprintf(
							/* translators: %d: ISO 8601 week number. */
							__( 'Week %d', 'gatherpress-calendar' ),
							weekNumber
						) }
					</th>
				) }
				{ weekDays.map( ( day, dayIndex ) =>
					dayIndex === activeDayIndex ? (
						<BlockContextProvider
							key={ day.date ?? `empty-${ dayIndex }` }
							value={ activeDayContext }
						>
							{ children }
						</BlockContextProvider>
					) : (
						<DayPreviewCell
							key={ day.date ?? `empty-${ dayIndex }` }
							day={ day }
							innerBlocks={ dayInnerBlocks }
							dayBlockAttributes={ dayBlockAttributes }
							onActivateDay={ setActiveDate }
						/>
					)
				) }
			</tr>
		</>
	);
} );
