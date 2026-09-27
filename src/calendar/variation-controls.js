/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
// import { NAME } from './name';
// import EventQueryControls from './slots/query-controls';
// import EventInheritedQueryControls from './slots/inherited-query-controls';
// import {
// 	EventQueryControlsSlotFill,
// 	EventInheritedQueryControlsSlotFill,
// } from './components';
// import { usePostTypeSupports } from '../../../helpers/event';
// import { usePostTypeLabel } from '../../../helpers/editor';

import { MonthPicker } from './edit/components/MonthPicker';
import { MonthControls } from './edit/components/MonthControls';

const NAME = 'gatherpress-calendar-query';

/**
 * Determines if the current block instance is the GatherPress event query variation.
 *
 * @param {Object} props - Props passed to the block's edit component.
 * @return {boolean} True if the block's namespace matches NAME, otherwise false.
 */
const isCalendarQueryLoop = ( props ) => {
	const namespace = props?.attributes?.namespace;
	return Boolean( namespace && namespace === NAME );
};

/**
 * Renders the "Calendar Query Settings" panel for a GatherPress calendar query block.
 *
 * Extracted into its own component so the `usePostTypeSupports` hook can be
 * called unconditionally at the top of a render (Rules of Hooks) — the HOC
 * has early-return paths for non-query blocks where we don't want to read
 * supports at all.
 *
 * Hides itself when the queried post type doesn't support
 * `gatherpress-event-date`, so changing a loop's post type away from events
 * (without removing the variation) collapses the now-irrelevant panel
 * instead of leaving stale event-only controls visible.
 *
 * @param {Object} props - Block props passed through from the HOC.
 *
 * @return {Element|null} The InspectorControls panel, or null when not applicable.
 */
export const CalendarQueryControlsPanel = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	// const gatherpressEventQuery = props.attributes?.query?.gatherpress_event_query || 'upcoming';

	const query = attributes?.query || {};
	const {
		selectedMonth = '',
		monthModifier = 0,
		inherit = false,
		postType: queryPostType,
	} = query;

	// TODO: Use core helper when included in GatherPress.
	// const queryPostTypeSupportsEvents = usePostTypeSupports(
	// 	'gatherpress-event-date',
	// 	queryPostType,
	// );
	const queryPostTypeSupportsEvents = ( queryPostType === 'gatherpress_event' );

	// Read the plural label so the "Block List" label reflects what the currently
	// selected post type is actually called — a custom event-supporting post type with
	// `name => 'Productions'` shows "Upcoming (or Past) Productions".
	// TODO: Use core helper when included in GatherPress.
	// const pluralLabel = usePostTypeLabel(
	// 	'name',
	// 	queryPostType,
	// 	__( 'Events', 'gatherpress' ),
	// );
	const pluralLabel = __( 'Events', 'gatherpress' );

	// // Update block name with post type label and query mode
	// useEffect( () => {
	// 	const queryLabel = ( 'upcoming' === gatherpressEventQuery )
	// 		? __( 'Upcoming', 'gatherpress' )
	// 		: __( 'Past', 'gatherpress' );

	// 	let blockName = sprintf(
	// 		/* translators: %1$s: 'Upcoming' or 'Past', %2$s: Plural post type label, e.g. "Events". */
	// 		__( '%1$s %2$s', 'gatherpress' ),
	// 		queryLabel,
	// 		pluralLabel,
	// 	);

	// 	// Unset if not a supporting post type.
	// 	if ( ! queryPostTypeSupportsEvents ) {
	// 		blockName = '';
	// 	}

	// 	updateBlockAttributes( clientId, {
	// 		metadata: {
	// 			name: blockName,
	// 		},
	// 	} );
	// }, [
	// 	queryPostTypeSupportsEvents,
	// 	pluralLabel,
	// 	gatherpressEventQuery,
	// 	clientId,
	// 	updateBlockAttributes,
	// ] );

	// 1. Hooks must ALWAYS be called at the top, before any conditional returns
	const [ showMonthPicker, setShowMonthPicker ] = useState( false );


	// Strip the event-only query vars when the selected post type doesn't
	// support event dates. `orderBy: 'datetime'` (and 'rand') are added to the
	// REST orderby enum only for event-date post types, so leaving them on a
	// plain post/page/venue query makes the core endpoint reject the request
	// (rest_invalid_param) and the Query Loop spins forever (#1756). The
	// gatherpress_event_query / include_unfinished vars are harmless on those
	// endpoints but meaningless there, so drop them too. Guarded on the vars
	// still being present so this doesn't re-fire in a loop.
	useEffect( () => {
		if ( queryPostTypeSupportsEvents ) {
			return;
		}

		const hasEventOnlyOrderBy =
			'datetime' === query.orderBy || 'rand' === query.orderBy;
		const hasEventOnlyVars =
			undefined !== query.gatherpress_calendar_query ||
			hasEventOnlyOrderBy;

		if ( ! hasEventOnlyVars ) {
			return;
		}

		const {
			gatherpress_event_query: removedEventQuery,
			include_unfinished: removedIncludeUnfinished,
			...remainingQuery
		} = query;

		// Reset the GatherPress-only ordering to the core default the
		// posts/pages endpoint accepts; leave any other orderBy intact.
		if ( hasEventOnlyOrderBy ) {
			remainingQuery.orderBy = 'date';
			remainingQuery.order = 'desc';
		}

		updateBlockAttributes( clientId, { query: remainingQuery } );
	}, [
		queryPostTypeSupportsEvents,
		query,
		clientId,
		updateBlockAttributes,
	] );

	// Read the singular label so the label reflects what the currently
	// selected post type is actually called — a custom event-supporting post type with
	// `singular_name => 'Production'` shows "Production Query Settings".
	// TODO: Use core helper when included in GatherPress.
	// const singularLabel = usePostTypeLabel(
	// 	'singular_name',
	// 	queryPostType,
	// 	__( 'Event', 'gatherpress' ),
	// );
	const singularLabel = __( 'Event', 'gatherpress' );

	if ( ! queryPostTypeSupportsEvents ) {
		return null;
	}

	const handleMonthSelect = ( value ) => {
		setAttributes( {
			query: {
				...query,
				selectedMonth: value,
			},
		} );
		setShowMonthPicker( false );
	};

	const handleMonthChange = ( value ) => {
		setAttributes( {
			query: {
				...query,
				selectedMonth: value,
			},
		} );
	};

	const handleModifierChange = ( value ) => {
		const numValue = value === '' ? 0 : parseInt( value, 10 );
		setAttributes( {
			query: {
				...query,
				monthModifier: isNaN( numValue ) ? 0 : numValue,
			},
		} );
	};

	return (
		<InspectorControls>
			<PanelBody
				title={ sprintf(
					/* translators: %s: Singular post type label, e.g. "Event". */
					__( '%s Calendar Settings', 'gatherpress' ),
					singularLabel
				) }
			>
				{ ! inherit && (
					<>
						<p>
							{ __(
								'Select a specific month to display, or leave empty to show the current month.',
								'gatherpress-calendar'
							) }
						</p>
						{ showMonthPicker ? (
							<MonthPicker
								selectedMonth={ selectedMonth }
								onSelect={ handleMonthSelect }
								onCancel={ () => setShowMonthPicker( false ) }
							/>
						) : (
							<MonthControls
								selectedMonth={ selectedMonth }
								monthModifier={ monthModifier }
								onMonthChange={ handleMonthChange }
								onModifierChange={ handleModifierChange }
								onOpenPicker={ () => setShowMonthPicker( true ) }
							/>
						) }
					</>
				) }
			</PanelBody>
		</InspectorControls>
	);
};

/**
 * Higher Order Component (HOC) to inject GatherPress-specific controls into core/query blocks.
 *
 * - If the block is not the designated event query or a query block, returns the block unchanged.
 * - For standard query blocks, watches for post type selection to convert into an event query when needed.
 * - For GatherPress event queries, provides the relevant controls in a PanelBody within InspectorControls.
 *
 * @param {Function} BlockEdit - The Query block's BlockEdit component.
 *
 * @return {Function} Enhanced BlockEdit component.
 */
const withEventQueryControls = ( BlockEdit ) => ( props ) => {
	// Early return if block is not a query or not a supported variation.
	if ( ! isCalendarQueryLoop( props ) && 'core/query' !== props.name ) {
		return <BlockEdit { ...props } />;
	}
	/// If it's a generic core/query, observe for transformation to GatherPress event query.
	if ( ! isCalendarQueryLoop( props ) ) {
		return (
			<>
				{/* <QueryPosttypeObserver { ...props } /> */}
				<BlockEdit { ...props } />
			</>
		);
	}
	// For a GatherPress event query, inject the controls panel (full or inherited controls).
	return (
		<>
			<BlockEdit { ...props } />
			<CalendarQueryControlsPanel { ...props } />
		</>
	);
};

/**
 * Registers the withEventQueryControls HOC as a filter to extend core/query blocks
 * with custom InspectorControls for GatherPress event queries.
 */
addFilter( 'editor.BlockEdit', 'core/query', withEventQueryControls );

/**
 * Registers the Query Controls SlotFills for the plugin interface, allowing
 * the relevant GatherPress query controls and inherited controls to be displayed.
 */
// registerPlugin( 'gatherpress-query-controls-slotfill', {
// 	render: EventQueryControlsSlotFill,
// } );
// registerPlugin( 'gatherpress-inherited-query-controls-slotfill', {
// 	render: EventInheritedQueryControlsSlotFill,
// } );
