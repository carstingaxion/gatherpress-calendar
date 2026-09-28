import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

const EMPTY_ARRAY = [];

/**
 * Hook to fetch posts and site settings for calendar rendering.
 *
 * @param {Object|null} query     Query Loop configuration.
 * @param {Object}      dateQuery Date query parameters.
 *
 * @return {Object} Object containing:
 *   - {Array} posts - Array of post objects
 *   - {number} startOfWeek - Start of week setting
 */
export function useCalendarData( query, dateQuery ) {
	return useSelect(
		( select ) => {
			if ( ! query ) {
				return { posts: [], startOfWeek: 0 };
			}

			const { getEntityRecords, getSite } = select( coreStore );

			// Create a clean query object.
			const cleanQuery = { ...query };

			// Build REST API query arguments.
			const queryArgs = {
				per_page: 100,
				_embed: 'wp:term',
			};

			if ( dateQuery ) {
				queryArgs.gatherpress_calendar_query = true;
				if ( dateQuery.startDate && dateQuery.endDate ) {
					queryArgs.start_date = dateQuery.startDate;
					queryArgs.end_date = dateQuery.endDate;
				}
				// if ( dateQuery.year && dateQuery.month ) {
				// 	queryArgs.year = dateQuery.year;
				// 	queryArgs.month = dateQuery.month;
				// }
			}

			// Add taxonomy query if present.
			if ( cleanQuery.taxQuery ) {
				Object.keys( cleanQuery.taxQuery ).forEach( ( taxonomy ) => {
					queryArgs[ taxonomy ] = cleanQuery.taxQuery[ taxonomy ];
				} );
			}

			// Add author query if present.
			if ( cleanQuery.author ) {
				queryArgs.author = cleanQuery.author;
			}

			// Add search query if present.
			if ( cleanQuery.search ) {
				queryArgs.search = cleanQuery.search;
			}

			if ( cleanQuery.orderBy ) {
				queryArgs.orderBy = cleanQuery.orderBy;
			}
			if ( cleanQuery.order ) {
				queryArgs.order = cleanQuery.order;
			}

			// Get site settings for start_of_week.
			const site = getSite();
			const weekStartsOn = site?.start_of_week || 0;

			const records = getEntityRecords(
				'postType',
				query?.postType || 'gatherpress_event',
				queryArgs
			);

			return {
				posts: records ?? EMPTY_ARRAY,
				startOfWeek: weekStartsOn,
			};
		},
		[ query, dateQuery ]
	);
}
