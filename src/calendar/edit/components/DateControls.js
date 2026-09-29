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

const MAX_UNITS = {
	month: 12,
	week: 5,
	day: 7,
};

/**
 * DateControls Component.
 *
 * @param {Object}   props                   Component props.
 * @param {string}   props.viewType          View type ('month', 'week', 'day').
 * @param {Function} props.onViewTypeChange  Callback when viewType changes.
 * @param {number}   props.unitCount         Number of units to show.
 * @param {Function} props.onUnitCountChange Callback when unitCount changes.
 * @param {string}   props.selectedDate      Selected date/month.
 * @param {number}   props.dateModifier      Date offset value.
 * @param {Function} props.onDateChange      Callback when date changes.
 * @param {Function} props.onModifierChange  Callback when modifier changes.
 * @param {Function} props.onOpenPicker      Callback to open month picker.
 *
 * @return {Element} Date controls component.
 */
export function DateControls( {
	viewType,
	onViewTypeChange,
	unitCount,
	onUnitCountChange,
	selectedDate,
	dateModifier,
	onDateChange,
	onModifierChange,
	onOpenPicker,
} ) {
	const monthOptions = useMemo( () => generateMonthOptions(), [] );
	const offsetHelp = useDateOffsetHelp( dateModifier, viewType );

	const maxUnits = MAX_UNITS[ viewType ] || 12;

	const handleViewTypeChange = ( newViewType ) => {
		const newMax = MAX_UNITS[ newViewType ] || 12;
		if ( Number( unitCount ) > newMax ) {
			onUnitCountChange( newMax );
		}
		onViewTypeChange( newViewType );
	};

	const handleUnitCountChange = ( nextValue ) => {
		const num = Number( nextValue );
		if ( ! Number.isNaN( num ) && num > maxUnits ) {
			onUnitCountChange( maxUnits );
			return;
		}
		onUnitCountChange( nextValue );
	};

	const stepLabel = useMemo( () => {
		if ( 'day' === viewType ) {
			return __( 'Days from current', 'gatherpress-calendar' );
		}
		if ( 'week' === viewType ) {
			return __( 'Weeks from current', 'gatherpress-calendar' );
		}
		return __( 'Months from current', 'gatherpress-calendar' );
	}, [ viewType ] );

	const unitCountLabel = useMemo( () => {
		if ( 'day' === viewType ) {
			return __( 'Number of days to show', 'gatherpress-calendar' );
		}
		if ( 'week' === viewType ) {
			return __( 'Number of weeks to show', 'gatherpress-calendar' );
		}
		return __( 'Number of months to show', 'gatherpress-calendar' );
	}, [ viewType ] );

	const selectionLabel = useMemo( () => {
		if ( selectedDate ) {
			if ( 'month' === viewType ) {
				const match = monthOptions.find(
					( o ) => o.value === selectedDate
				);
				return match?.label || selectedDate;
			}
			return selectedDate;
		}

		if ( 'day' === viewType ) {
			return __( 'Current Day', 'gatherpress-calendar' );
		}
		if ( 'week' === viewType ) {
			return __( 'Current Week', 'gatherpress-calendar' );
		}
		return __( 'Current Month', 'gatherpress-calendar' );
	}, [ selectedDate, viewType, monthOptions ] );

	const unitLabel = useMemo( () => {
		if ( 'day' === viewType ) {
			return __( 'day(s)', 'gatherpress-calendar' );
		}
		if ( 'week' === viewType ) {
			return __( 'week(s)', 'gatherpress-calendar' );
		}
		return __( 'month(s)', 'gatherpress-calendar' );
	}, [ viewType ] );

	return (
		<>
			<SelectControl
				label={ __( 'Calendar View', 'gatherpress-calendar' ) }
				value={ viewType }
				options={ [
					{
						label: __( 'Month', 'gatherpress-calendar' ),
						value: 'month',
					},
					{
						label: __( 'Week', 'gatherpress-calendar' ),
						value: 'week',
					},
					{
						label: __( 'Day', 'gatherpress-calendar' ),
						value: 'day',
					},
				] }
				onChange={ handleViewTypeChange }
			/>

			<NumberControl
				label={ unitCountLabel }
				labelPosition="side"
				type="number"
				value={ unitCount }
				onChange={ handleUnitCountChange }
				min={ 1 }
				max={ maxUnits }
				step={ 1 }
				style={ { marginBottom: '16px' } }
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
				{ selectionLabel }
				{ ! selectedDate && 0 !== dateModifier && (
					<>
						{ ' ' }
						{ dateModifier > 0
							? `+${ dateModifier }`
							: dateModifier }{ ' ' }
						{ unitLabel }
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
					label={ __(
						'Specific Date (YYYY-MM-DD)',
						'gatherpress-calendar'
					) }
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
