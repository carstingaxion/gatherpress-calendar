import { useMemo } from '@wordpress/element';
import { BlockContextProvider } from '@wordpress/block-editor';

import { WeekPreviewRow } from './WeekPreviewRow';

/**
 * CalendarWeek Component
 *
 * Renders an individual week row within the calendar table.
 *
 * One week is rendered live/editable using `liveWeekChildren`, while all
 * other weeks render as a read-only `WeekPreviewRow`. The context value
 * is memoized per-week so inactive preview rows keep their context reference
 * and bail out of re-rendering during unrelated editor state updates.
 *
 * @since 0.5.0
 *
 * @param {Object}   props                     Component props.
 * @param {Array}    props.week                Week day entries.
 * @param {number}   props.weekIndex           Index of this week in the unit.
 * @param {number}   props.weekNumber          ISO week number, 0 for none.
 * @param {string}   props.activeDate          Currently live/editable date.
 * @param {Function} props.setActiveDate       Setter for active date.
 * @param {Object}   props.weekContext         Base context shared by all weeks.
 * @param {Element}  props.liveWeekChildren    Live week inner blocks.
 * @param {Array}    props.dayInnerBlocks      Day template inner blocks.
 * @param {Object}   props.weekBlockAttributes Attributes of week block.
 * @param {Object}   props.dayBlockAttributes  Attributes of day block.
 *
 * @return {Element} Calendar week element.
 */
export function CalendarWeek( {
	week,
	weekIndex,
	weekNumber,
	activeDate,
	setActiveDate,
	weekContext,
	liveWeekChildren,
	dayInnerBlocks,
	weekBlockAttributes,
	dayBlockAttributes,
} ) {
	// Annotate week days with row boundary wrap flags for multi-day events.
	const annotatedWeek = useMemo( () => {
		const totalCols = week.length;

		return week.map( ( day, colIndex ) => {
			if ( ! day.posts || ! day.posts.length ) {
				return day;
			}

			// First column of row OR first day after leading padding cells.
			const isFirstCol = colIndex === 0 || Boolean( week[ colIndex - 1 ]?.isEmpty );

			// Last column of row OR last day before trailing padding cells.
			const isLastCol  = colIndex === totalCols - 1 || Boolean( week[ colIndex + 1 ]?.isEmpty );

			const annotatedPosts = day.posts.map( ( post ) => {
				const totalDays = post.totalDays ?? 1;
				const dayIndex  = post.dayIndex ?? 1;

				if ( totalDays <= 1 ) {
					return post;
				}

				return {
					...post,
					isContinued: isFirstCol && dayIndex > 1,
					isContinues: isLastCol && dayIndex < totalDays,
				};
			} );

			return {
				...day,
				posts: annotatedPosts,
			};
		} );
	}, [ week ] );

	const isActiveWeek = annotatedWeek.some( ( day ) => day.date === activeDate );

	// Memoized so each week's context object keeps its reference across renders
	// that don't change the calendar or active date.
	const weekContextValue = useMemo(
		() => ( {
			...weekContext,
			'gatherpress/weekIndex': weekIndex,
			'gatherpress/weekDays': annotatedWeek,
			'gatherpress/weekNumber': weekNumber,
			'gatherpress/activeDate': activeDate,
			'gatherpress/setActiveDate': setActiveDate,
		} ),
		[ weekContext, weekIndex, annotatedWeek, weekNumber, activeDate, setActiveDate ]
	);

	return (
		<BlockContextProvider value={ weekContextValue }>
			{ isActiveWeek ? (
				liveWeekChildren
			) : (
				<WeekPreviewRow
					week={ annotatedWeek }
					weekNumber={ weekNumber }
					dayInnerBlocks={ dayInnerBlocks }
					weekBlockAttributes={ weekBlockAttributes }
					dayBlockAttributes={ dayBlockAttributes }
					onActivateDay={ setActiveDate }
				/>
			) }
		</BlockContextProvider>
	);
}
