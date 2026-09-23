import { __, sprintf } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * Hook to calculate month offset help text.
 *
 * @since 0.1.0
 *
 * @param {number} monthModifier - The month offset value.
 *
 * @return {string} Localized help text.
 */
export function useMonthOffsetHelp( monthModifier ) {
	return useMemo( () => {
		if ( monthModifier === 0 ) {
			return __( 'Showing current month', 'gatherpress-calendar' );
		}
		if ( monthModifier < 0 ) {
			return sprintf(
				/* translators: %d: number of months ago */
				__( 'Showing %d month(s) ago', 'gatherpress-calendar' ),
				Math.abs( monthModifier )
			);
		}
		return sprintf(
			/* translators: %d: number of months ahead */
			__( 'Showing %d month(s) ahead', 'gatherpress-calendar' ),
			monthModifier
		);
	}, [ monthModifier ] );
}
