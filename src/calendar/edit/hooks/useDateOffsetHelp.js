import { __, sprintf } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * Hook to calculate date offset help text for month, week, or day view.
 *
 * @param {number} dateModifier Offset integer.
 * @param {string} viewType     View type: 'month' | 'week' | 'day'.
 *
 * @return {string} Localized help text.
 */
export function useDateOffsetHelp( dateModifier = 0, viewType = 'month' ) {
	return useMemo( () => {
		if ( 0 === dateModifier ) {
			if ( 'day' === viewType ) {
				return __( 'Showing today', 'gatherpress-calendar' );
			}
			if ( 'week' === viewType ) {
				return __( 'Showing current week', 'gatherpress-calendar' );
			}
			return __( 'Showing current month', 'gatherpress-calendar' );
		}

		const absVal = Math.abs( dateModifier );

		if ( 'day' === viewType ) {
			return dateModifier < 0
				? sprintf(
					/* translators: %d: number of days ago */
					__( 'Showing %d day(s) ago', 'gatherpress-calendar' ),
					absVal
				)
				: sprintf(
					/* translators: %d: number of days ahead */
					__( 'Showing %d day(s) ahead', 'gatherpress-calendar' ),
					dateModifier
				);
		}

		if ( 'week' === viewType ) {
			return dateModifier < 0
				? sprintf(
					/* translators: %d: number of weeks ago */
					__( 'Showing %d week(s) ago', 'gatherpress-calendar' ),
					absVal
				)
				: sprintf(
					/* translators: %d: number of weeks ahead */
					__( 'Showing %d week(s) ahead', 'gatherpress-calendar' ),
					dateModifier
				);
		}

		return dateModifier < 0
			? sprintf(
				/* translators: %d: number of months ago */
				__( 'Showing %d month(s) ago', 'gatherpress-calendar' ),
				absVal
			)
			: sprintf(
				/* translators: %d: number of months ahead */
				__( 'Showing %d month(s) ahead', 'gatherpress-calendar' ),
				dateModifier
			);
	}, [ dateModifier, viewType ] );
}