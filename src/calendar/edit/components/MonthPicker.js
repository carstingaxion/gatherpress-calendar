import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	Flex,
	FlexBlock,
	SelectControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { useMemo } from '@wordpress/element';

import { generateMonthOptions } from '../utils/calendar-utils';
import { calculateTargetDate } from '../utils/date-utils';

/**
 * MonthPicker Component
 *
 * Renders a month select and a year input. Both controls stay in place
 * when the value changes, so keyboard focus is not lost.
 *
 * @since 0.1.0
 *
 * @param {Object}   props               - Component props.
 * @param {string}   props.selectedMonth - Currently selected month ("YYYY-MM"), or '' for the current month.
 * @param {number}   props.dateModifier  - Month offset, applied to the shown month.
 * @param {Function} props.onChange      - Callback with the new month ("YYYY-MM").
 *
 * @return {Element} Month picker component.
 */
export function MonthPicker( { selectedMonth, dateModifier = 0, onChange } ) {
	const monthOptions = useMemo( () => generateMonthOptions(), [] );

	// The month the calendar shows, also when it follows the current month.
	const shownDate = calculateTargetDate( {
		viewType: 'month',
		selectedDate: selectedMonth,
		dateModifier,
	} );
	const year = shownDate.getFullYear();
	const month = String( shownDate.getMonth() + 1 ).padStart( 2, '0' );

	const handleYearChange = ( value ) => {
		// Wait for a complete year while the user types.
		if ( ! /^\d{4}$/.test( String( value ) ) ) {
			return;
		}
		onChange( `${ value }-${ month }` );
	};

	return (
		<Flex align="flex-start" style={ { marginBottom: '8px' } }>
			<FlexBlock>
				<SelectControl
					label={ __( 'Month', 'gatherpress-calendar' ) }
					value={ month }
					options={ monthOptions }
					onChange={ ( value ) => onChange( `${ year }-${ value }` ) }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</FlexBlock>
			<FlexBlock>
				<NumberControl
					label={ __( 'Year', 'gatherpress-calendar' ) }
					value={ year }
					onChange={ handleYearChange }
					step={ 1 }
					__next40pxDefaultSize
				/>
			</FlexBlock>
		</Flex>
	);
}
