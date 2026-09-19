/**
 * GatherPress Calendar Day Interactivity Store Extensions
 *
 * @package GatherPressCalendar
 * @since 0.4.0
 */

import { store, getContext, withSyncEvent } from '@wordpress/interactivity';

store( 'gatherpress/calendar', {
	state: {
		/**
		 * Tracks the currently selected date in the grid (YYYY-MM-DD).
		 */
		selectedDate: null,

		/**
		 * Derived getter: checks if this day cell is currently selected.
		 */
		get isSelectedDay() {
			const context = getContext();
			const { state } = store( 'gatherpress/calendar' );
			return Boolean(
				context?.dayDate && state.selectedDate === context.dayDate
			);
		},
	},

	actions: {
		/**
		 * Handle clicking or focusing a day cell.
		 */
		selectDay: withSyncEvent( ( event ) => {
			const context = getContext();
			const { state } = store( 'gatherpress/calendar' );

			if ( context?.isEmpty || ! context?.dayDate ) {
				return;
			}

			state.selectedDate =
				state.selectedDate === context.dayDate ? null : context.dayDate;
		} ),

		/**
		 * Arrow key navigation between day cells.
		 */
		handleDayKeydown: withSyncEvent( ( event ) => {
			const { actions } = store( 'gatherpress/calendar' );

			if ( event.key === 'Enter' || event.key === ' ' ) {
				event.preventDefault();
				actions.selectDay( event );
			}
		} ),
	},
} );