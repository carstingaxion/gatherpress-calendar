/**
 * Hook to resolve start and end dates from a target event post.
 *
 * For "context" posts, reactively reads from GatherPress's `gatherpress/datetime`
 * store and core/editor's live edited meta so that changing start or end dates
 * updates the calendar grid and heading instantly in real time without saving.
 *
 * @package
 * @since 0.9.0
 */

import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEventPostTypes } from './useEventPostTypes';

/**
 * Normalizes any datetime value (string, Date, timestamp number, object) into YYYY-MM-DD.
 *
 * @param {*} val Raw datetime value.
 * @return {string} YYYY-MM-DD date string or empty string.
 */
export function toDateString( val ) {
	if ( ! val ) {
		return '';
	}
	if ( typeof val === 'string' && val.length >= 10 ) {
		return val.slice( 0, 10 );
	}
	if ( typeof val === 'number' ) {
		const ms = val < 1e11 ? val * 1000 : val;
		const d = new Date( ms );
		if ( ! Number.isNaN( d.getTime() ) ) {
			const y = d.getFullYear();
			const m = String( d.getMonth() + 1 ).padStart( 2, '0' );
			const day = String( d.getDate() ).padStart( 2, '0' );
			return `${ y }-${ m }-${ day }`;
		}
	}
	if ( val instanceof Date && ! Number.isNaN( val.getTime() ) ) {
		const y = val.getFullYear();
		const m = String( val.getMonth() + 1 ).padStart( 2, '0' );
		const d = String( val.getDate() ).padStart( 2, '0' );
		return `${ y }-${ m }-${ d }`;
	}
	if ( typeof val === 'object' ) {
		if ( typeof val.date === 'string' && val.date.length >= 10 ) {
			return val.date.slice( 0, 10 );
		}
		if ( typeof val.dateTime === 'string' && val.dateTime.length >= 10 ) {
			return val.dateTime.slice( 0, 10 );
		}
	}
	return '';
}

/**
 * Extracts live event start and end dates from GatherPress's datetime store or edited meta.
 *
 * @param {Function} select WordPress data select function.
 * @return {Object|null} { startDate, endDate } or null if dates are not found.
 */
export function getLiveEventDates( select ) {
	if ( typeof select !== 'function' ) {
		return null;
	}

	const editorStore = select( 'core/editor' );
	const datetimeStore = select( 'gatherpress/datetime' );
	const editedMeta = editorStore?.getEditedPostAttribute?.( 'meta' );

	let liveStart = toDateString( datetimeStore?.getDateTimeStart?.() );
	if ( ! liveStart ) {
		liveStart = toDateString( editedMeta?.gatherpress_datetime_start );
	}

	let liveEnd = toDateString( datetimeStore?.getDateTimeEnd?.() );
	if ( ! liveEnd ) {
		liveEnd = toDateString( editedMeta?.gatherpress_datetime_end );
	}
	if ( ! liveEnd ) {
		liveEnd = liveStart;
	}

	if ( liveStart ) {
		let finalEnd = liveEnd;
		if ( finalEnd < liveStart ) {
			finalEnd = liveStart;
		}

		return {
			startDate: liveStart,
			endDate: finalEnd,
		};
	}

	return null;
}

/**
 * Hook to resolve start and end dates from a target event post.
 *
 * @param {Object} props                 Parameters object.
 * @param {string} props.dateRangeSource Source mode ('default', 'context', 'selected').
 * @param {number} props.postId          Explicit post ID.
 * @param {string} props.sourcePostType  Explicit post type.
 * @param {number} props.contextPostId   Post ID from block context.
 * @param {string} props.contextPostType Post type from block context.
 *
 * @return {Object} Resolved post dates object { startDate, endDate, postTitle, hasPost, effectivePostId }.
 */
export function useSourcePostDates( {
	dateRangeSource = 'default',
	postId = 0,
	sourcePostType = '',
	contextPostId = 0,
	contextPostType = '',
} ) {
	const eventPostTypes = useEventPostTypes();
	let defaultEventPostType = 'gatherpress_event';
	if ( eventPostTypes.length > 0 ) {
		defaultEventPostType = eventPostTypes[ 0 ].slug;
	}

	const isContext = 'context' === dateRangeSource;
	const isSelected = 'selected' === dateRangeSource;

	return useSelect(
		( select ) => {
			if ( ! isContext && ! isSelected ) {
				return {
					startDate: '',
					endDate: '',
					postTitle: '',
					hasPost: false,
					effectivePostId: 0,
				};
			}

			const editorStore = select( 'core/editor' );
			const currentEditorPostId = editorStore?.getCurrentPostId?.();
			const editorPostType = editorStore?.getCurrentPostType?.();

			let effectivePostId = 0;
			if ( isSelected ) {
				effectivePostId = Number( postId ) || 0;
			} else if ( isContext ) {
				effectivePostId =
					Number( contextPostId ) || currentEditorPostId || 0;
			}

			let effectivePostType = defaultEventPostType;
			if ( isSelected && sourcePostType ) {
				effectivePostType = sourcePostType;
			} else if ( isContext ) {
				effectivePostType =
					contextPostType || editorPostType || defaultEventPostType;
			}

			if ( ! effectivePostId ) {
				return {
					startDate: '',
					endDate: '',
					postTitle: '',
					hasPost: false,
					effectivePostId: 0,
				};
			}

			// 1. Direct-editing: listen live to gatherpress/datetime store and core/editor edited meta.
			const isTargetCurrentEditorPost =
				isContext || effectivePostId === currentEditorPostId;

			if ( isTargetCurrentEditorPost ) {
				const liveDates = getLiveEventDates( select );
				if ( liveDates ) {
					const currentTitle =
						editorStore?.getEditedPostAttribute?.( 'title' ) || '';

					return {
						startDate: liveDates.startDate,
						endDate: liveDates.endDate,
						postTitle: currentTitle || `#${ effectivePostId }`,
						hasPost: true,
						effectivePostId,
					};
				}
			}

			// 2. Fallback to entity record for external posts or when store is inactive.
			const post = select( coreStore ).getEntityRecord(
				'postType',
				effectivePostType,
				effectivePostId
			);

			if ( ! post ) {
				return {
					startDate: '',
					endDate: '',
					postTitle: '',
					hasPost: false,
					effectivePostId,
				};
			}

			const meta = post.meta;
			const startDate = toDateString( meta?.gatherpress_datetime_start );
			let endDate = startDate;
			if ( toDateString( meta?.gatherpress_datetime_end ) ) {
				endDate = toDateString( meta?.gatherpress_datetime_end );
			}
			if ( endDate < startDate ) {
				endDate = startDate;
			}

			let title = `#${ effectivePostId }`;
			if ( post.title?.rendered ) {
				title = post.title.rendered;
			} else if ( post.title?.raw ) {
				title = post.title.raw;
			}

			return {
				startDate,
				endDate,
				postTitle: title,
				hasPost: Boolean( startDate ),
				effectivePostId,
			};
		},
		[
			dateRangeSource,
			isContext,
			isSelected,
			postId,
			sourcePostType,
			contextPostId,
			contextPostType,
			defaultEventPostType,
		]
	);
}
