import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Hook to fetch posts and site settings for calendar rendering.
 *
 * @since 0.1.0
 *
 * @param {Object|null} query     - Query Loop query configuration.
 * @param {Object}      dateQuery - Date query parameters.
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

			const { getEntityRecords } = select( coreStore );
			const { getSite } = select( coreStore );

			// Create a clean query object.
			const cleanQuery = { ...query };

			// Build REST API query arguments.
			const queryArgs = {
				per_page: 100,
				_embed: 'wp:term',
			};

			// Add calendar identifier and date query filter.
			if ( dateQuery && dateQuery.year && dateQuery.month ) {
				queryArgs.gatherpress_calendar_query = true;
				queryArgs.year = dateQuery.year;
				queryArgs.month = dateQuery.month;
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

			// Get site settings for start_of_week.
			const site = getSite();
			const weekStartsOn = site?.start_of_week || 0;

			return {
				posts:
					getEntityRecords(
						'postType',
						cleanQuery.postType || 'post',
						queryArgs
					) || [],
				startOfWeek: weekStartsOn,
			};
		},
		[ query, dateQuery ]
	);
}
