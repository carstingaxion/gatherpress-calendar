import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';

import { generateMonthOptions } from '../utils/calendar-utils';
import { useMonthOffsetHelp } from '../hooks/useMonthOffsetHelp';

/**
 * MonthControls Component
 *
 * Renders the month selection and offset controls.
 *
 * @since 0.1.0
 *
 * @param {Object}   props                  - Component props.
 * @param {string}   props.selectedMonth    - Currently selected month.
 * @param {number}   props.monthModifier    - Month offset value.
 * @param {Function} props.onMonthChange    - Callback when month changes.
 * @param {Function} props.onModifierChange - Callback when modifier changes.
 * @param {Function} props.onOpenPicker     - Callback to open picker.
 *
 * @return {Element} Month controls component.
 */
export function MonthControls( {
	selectedMonth,
	monthModifier,
	onMonthChange,
	onModifierChange,
	onOpenPicker,
} ) {
	const monthOptions = useMemo( () => generateMonthOptions(), [] );
	const monthOffsetHelp = useMonthOffsetHelp( monthModifier );

	return (
		<>
			<div
				style={ {
					marginBottom: '12px',
					padding: '8px',
					background: '#f0f0f1',
					borderRadius: '4px',
				} }
			>
				<strong>
					{ __( 'Current Selection:', 'gatherpress-calendar' ) }
				</strong>
				<br />
				{ selectedMonth
					? monthOptions.find( ( o ) => o.value === selectedMonth )
							?.label
					: __( 'Current Month', 'gatherpress-calendar' ) }
				{ ! selectedMonth && monthModifier !== 0 && (
					<>
						{ ' ' }
						{ monthModifier > 0
							? `+${ monthModifier }`
							: monthModifier }{ ' ' }
						{ monthModifier === 1
							? __( 'month', 'gatherpress-calendar' )
							: __( 'months', 'gatherpress-calendar' ) }
					</>
				) }
			</div>
			<Button
				isPrimary
				onClick={ onOpenPicker }
				style={ { width: '100%', marginBottom: '8px' } }
			>
				{ __( 'Change Month', 'gatherpress-calendar' ) }
			</Button>
			{ selectedMonth && (
				<Button
					isSecondary
					onClick={ () => onMonthChange( '' ) }
					style={ { width: '100%' } }
				>
					{ __( 'Reset to Current Month', 'gatherpress-calendar' ) }
				</Button>
			) }

			{ ! selectedMonth && (
				<>
					<hr
						style={ {
							margin: '16px 0',
							borderTop: '1px solid #ddd',
						} }
					/>
					<p
						style={ {
							marginTop: '16px',
							marginBottom: '8px',
							fontWeight: '500',
						} }
					>
						{ __( 'Month Offset', 'gatherpress-calendar' ) }
					</p>
					<p
						style={ {
							fontSize: '12px',
							color: '#757575',
							marginBottom: '12px',
						} }
					>
						{ __(
							'Display a month relative to the current month. For example, -1 shows last month, +1 shows next month. The calendar will automatically update as time passes.',
							'gatherpress-calendar'
						) }
					</p>
					<NumberControl
						label={ __(
							'Months from current',
							'gatherpress-calendar'
						) }
						value={ monthModifier }
						onChange={ onModifierChange }
						min={ -12 }
						max={ 12 }
						step={ 1 }
						help={ monthOffsetHelp }
					/>
					{ monthModifier !== 0 && (
						<Button
							isSecondary
							onClick={ () => onModifierChange( 0 ) }
							style={ { width: '100%', marginTop: '8px' } }
						>
							{ __(
								'Reset Month Offset',
								'gatherpress-calendar'
							) }
						</Button>
					) }
				</>
			) }
		</>
	);
}
