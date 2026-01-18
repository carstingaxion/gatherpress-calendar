import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { Button } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

import { generateMonthOptions } from '../utils/calendar-utils';

/**
 * MonthPicker Component
 *
 * Renders a scrollable list of months for selection.
 *
 * @since 0.1.0
 *
 * @param {Object}   props               - Component props.
 * @param {string}   props.selectedMonth - Currently selected month.
 * @param {Function} props.onSelect      - Callback when month is selected.
 * @param {Function} props.onCancel      - Callback when cancelled.
 *
 * @return {Element} Month picker component.
 */
export function MonthPicker( { selectedMonth, onSelect, onCancel } ) {
	const monthOptions = useMemo( () => generateMonthOptions(), [] );

	return (
		<>
			<div
				style={ {
					marginBottom: '12px',
					maxHeight: '200px',
					overflowY: 'auto',
					border: '1px solid #ddd',
					borderRadius: '4px',
				} }
			>
				{ monthOptions.map( ( option ) => (
					<Button
						key={ option.value }
						isPressed={ selectedMonth === option.value }
						onClick={ () => onSelect( option.value ) }
						style={ {
							width: '100%',
							justifyContent: 'flex-start',
							padding: '8px 12px',
						} }
					>
						{ option.label }
					</Button>
				) ) }
			</div>
			<Button
				isSecondary
				onClick={ onCancel }
				style={ { width: '100%' } }
			>
				{ __( 'Cancel', 'gatherpress-calendar' ) }
			</Button>
		</>
	);
}
