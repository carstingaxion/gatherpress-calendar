import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	Button,
	SelectControl,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';

import { generateMonthOptions } from '../utils/calendar-utils';
import { useDateOffsetHelp } from '../hooks/useDateOffsetHelp';

/**
 * DateControls Component.
 *
 * @param {Object}   props                  Component props.
 * @param {string}   props.viewType         View type ('month', 'week', 'day').
 * @param {Function} props.onViewTypeChange Callback when viewType changes.
 * @param {string}   props.selectedDate     Selected date/month.
 * @param {number}   props.dateModifier     Date offset value.
 * @param {Function} props.onDateChange     Callback when date changes.
 * @param {Function} props.onModifierChange Callback when modifier changes.
 * @param {Function} props.onOpenPicker     Callback to open month picker.
 *
 * @return {Element} Date controls component.
 */
export function DateControls( {
	viewType,
	onViewTypeChange,
	selectedDate,
	dateModifier,
	onDateChange,
	onModifierChange,
	onOpenPicker,
} ) {
	const monthOptions = useMemo( () => generateMonthOptions(), [] );
	const offsetHelp = useDateOffsetHelp( dateModifier, viewType );

	const stepLabel = useMemo( () => {
		if ( 'day' === viewType ) {
			return __( 'Days from current', 'gatherpress-calendar' );
		}
		if ( 'week' === viewType ) {
			return __( 'Weeks from current', 'gatherpress-calendar' );
		}
		return __( 'Months from current', 'gatherpress-calendar' );
	}, [ viewType ] );

	return (
		<>
			<SelectControl
				label={ __( 'Calendar View', 'gatherpress-calendar' ) }
				value={ viewType }
				options={ [
					{ label: __( 'Month', 'gatherpress-calendar' ), value: 'month' },
					{ label: __( 'Week', 'gatherpress-calendar' ), value: 'week' },
					{ label: __( 'Day', 'gatherpress-calendar' ), value: 'day' },
				] }
				onChange={ onViewTypeChange }
			/>

			<div
				style={ {
					marginBottom: '8px',
					padding: '8px',
					background: '#f0f0f1',
					borderRadius: '4px',
				} }
			>
				<strong>
					{ __( 'Current Selection:', 'gatherpress-calendar' ) }
				</strong>
				<br />
				{ selectedDate
					? ( 'month' === viewType
						? monthOptions.find( ( o ) => o.value === selectedDate )?.label || selectedDate
						: selectedDate )
					: ( 'day' === viewType
						? __( 'Current Day', 'gatherpress-calendar' )
						: 'week' === viewType
							? __( 'Current Week', 'gatherpress-calendar' )
							: __( 'Current Month', 'gatherpress-calendar' ) ) }
				{ ! selectedDate && 0 !== dateModifier && (
					<>
						{ ' ' }
						{ dateModifier > 0 ? `+${ dateModifier }` : dateModifier }{ ' ' }
						{ 'day' === viewType
							? __( 'day(s)', 'gatherpress-calendar' )
							: 'week' === viewType
								? __( 'week(s)', 'gatherpress-calendar' )
								: __( 'month(s)', 'gatherpress-calendar' ) }
					</>
				) }
			</div>

			{ 'month' === viewType ? (
				<Button
					variant="primary"
					onClick={ onOpenPicker }
					__next40pxDefaultSize
					style={ { width: '100%', marginBottom: '8px' } }
				>
					{ __( 'Change Month', 'gatherpress-calendar' ) }
				</Button>
			) : (
				<TextControl
					label={ __( 'Specific Date (YYYY-MM-DD)', 'gatherpress-calendar' ) }
					type="date"
					value={ selectedDate }
					onChange={ onDateChange }
					style={ { marginBottom: '8px' } }
				/>
			) }

			{ selectedDate && (
				<Button
					onClick={ () => onDateChange( '' ) }
					variant="secondary"
					__next40pxDefaultSize
					style={ { width: '100%', marginBottom: '8px' } }
				>
					{ __( 'Reset to Current', 'gatherpress-calendar' ) }
				</Button>
			) }

			{ ! selectedDate && (
				<>
					<p
						style={ {
							marginTop: '16px',
							marginBottom: '8px',
							fontWeight: '500',
						} }
					>
						{ __( 'Date Offset', 'gatherpress-calendar' ) }
					</p>
					<NumberControl
						label={ stepLabel }
						labelPosition="side"
						type="number"
						value={ dateModifier }
						onChange={ onModifierChange }
						min={ -52 }
						max={ 52 }
						step={ 1 }
						help={ offsetHelp }
					/>
					{ 0 !== dateModifier && (
						<Button
							onClick={ () => onModifierChange( 0 ) }
							variant="secondary"
							__next40pxDefaultSize
							style={ { width: '100%', marginBottom: '8px' } }
						>
							{ __( 'Reset Offset', 'gatherpress-calendar' ) }
						</Button>
					) }
				</>
			) }
		</>
	);
}