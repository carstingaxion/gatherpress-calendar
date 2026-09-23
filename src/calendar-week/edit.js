import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	BlockContextProvider,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import './editor.scss';

import { DAY_TEMPLATE } from '../calendar/edit/constants';
import { DayPreviewCell } from '../calendar/edit/components/DayPreviewCell';
import { useStableValue } from '../utils/use-stable-value';

const EMPTY_ARRAY = [];
const NOOP = () => {};

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
 * @param {Object} props          Component props.
 * @param {Object} props.context  Context provided by the Calendar block.
 * @param {string} props.clientId This week block's client ID.
 *
 * @return {Element} Week row element.
 */
export default function Edit( { context, clientId } ) {
	const rawWeekDays = context?.[ 'gatherpress/weekDays' ];
	const weekDays = useMemo(
		() => rawWeekDays ?? EMPTY_ARRAY,
		[ rawWeekDays ]
	);

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

	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar__week',
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

	return (
		<tr { ...innerBlocksWrapperProps }>
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
	);
}
