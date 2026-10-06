/**
 * Hook to synchronize parent Query Loop block name, Heading block name,
 * and Previous/Next pagination button labels when view configuration changes.
 *
 * @package
 * @since 0.8.0
 */

import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo, useRef } from '@wordpress/element';

import {
	findHeadingBlock,
	findBlockByName,
	getCalendarBlockName,
	getPaginationLabel,
} from '../utils/block-sync-utils';

/**
 * Synchronizes parent Query and child helper blocks with calendar settings.
 *
 * @param {Object} props           Hook properties.
 * @param {string} props.clientId  Client ID of the calendar block.
 * @param {string} props.viewType  Current view type ('month', 'week', 'day').
 * @param {number} props.unitCount Number of calendar units to show.
 */
export function useCalendarSync( { clientId, viewType, unitCount } ) {
	const {
		parentQueryClientId,
		parentQueryMetadata,
		headingClientId,
		headingMetadata,
		paginationPrevClientId,
		paginationNextClientId,
	} = useSelect(
		( select ) => {
			const { getBlockParentsByBlockName, getBlock } =
				select( blockEditorStore );

			const parents = getBlockParentsByBlockName(
				clientId,
				'core/query'
			);
			const parentId = parents?.[ parents.length - 1 ];
			const parentBlock = parentId ? getBlock( parentId ) : null;

			const headingBlock = parentBlock?.innerBlocks
				? findHeadingBlock( parentBlock.innerBlocks )
				: null;

			const prevBlock = parentBlock?.innerBlocks
				? findBlockByName(
						parentBlock.innerBlocks,
						'core/query-pagination-previous'
					)
				: null;

			const nextBlock = parentBlock?.innerBlocks
				? findBlockByName(
						parentBlock.innerBlocks,
						'core/query-pagination-next'
					)
				: null;

			return {
				parentQueryClientId: parentId ?? null,
				parentQueryMetadata: parentBlock?.attributes?.metadata,
				headingClientId: headingBlock?.clientId ?? null,
				headingMetadata: headingBlock?.attributes?.metadata,
				paginationPrevClientId: prevBlock?.clientId ?? null,
				paginationNextClientId: nextBlock?.clientId ?? null,
			};
		},
		[ clientId ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const targetQueryName = useMemo(
		() => getCalendarBlockName( viewType, unitCount ),
		[ viewType, unitCount ]
	);

	const targetHeadingName = useMemo(
		() =>
			getCalendarBlockName(
				viewType,
				unitCount,
				__( 'Heading', 'gatherpress-calendar' )
			),
		[ viewType, unitCount ]
	);

	const targetPrevLabel = useMemo(
		() => getPaginationLabel( 'previous', viewType, unitCount ),
		[ viewType, unitCount ]
	);

	const targetNextLabel = useMemo(
		() => getPaginationLabel( 'next', viewType, unitCount ),
		[ viewType, unitCount ]
	);

	// Track previous view configuration so names and labels are only reset when config changes.
	const prevConfigRef = useRef( { viewType, unitCount } );

	useEffect( () => {
		// Hard overwrite the parent Query block's name,
		// so the Query block is always named after the calendar it contains.
		if (
			parentQueryClientId &&
			parentQueryMetadata?.name !== targetQueryName
		) {
			updateBlockAttributes( parentQueryClientId, {
				metadata: {
					...parentQueryMetadata,
					name: targetQueryName,
				},
			} );
		}

		// Only overwrite block names and pagination labels when unitCount or viewType changes.
		const hasConfigChanged =
			prevConfigRef.current.viewType !== viewType ||
			prevConfigRef.current.unitCount !== unitCount;

		if ( ! hasConfigChanged ) {
			return;
		}

		prevConfigRef.current = { viewType, unitCount };

		if ( headingClientId ) {
			updateBlockAttributes( headingClientId, {
				metadata: {
					...headingMetadata,
					name: targetHeadingName,
				},
			} );
		}

		if ( paginationPrevClientId ) {
			updateBlockAttributes( paginationPrevClientId, {
				label: targetPrevLabel,
			} );
		}

		if ( paginationNextClientId ) {
			updateBlockAttributes( paginationNextClientId, {
				label: targetNextLabel,
			} );
		}
	}, [
		parentQueryClientId,
		parentQueryMetadata,
		targetQueryName,
		headingClientId,
		headingMetadata,
		targetHeadingName,
		viewType,
		unitCount,
		targetPrevLabel,
		targetNextLabel,
		paginationPrevClientId,
		paginationNextClientId,
		updateBlockAttributes,
	] );
}
