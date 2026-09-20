/**
 * Shared helpers for locating the "Day Number" block - a core/paragraph
 * bound to the gatherpress/calendar-day binding source - among a calendar
 * day's real inner blocks, and reading its own visual settings so both the
 * live day and the read-only day previews can stay in sync with it.
 *
 * @package GatherPressCalendar
 * @since 0.5.0
 */

const DAY_NUMBER_BINDING_SOURCE = 'gatherpress/calendar-day';

/**
 * Whether a block's `content` attribute is bound to the Day Number source.
 *
 * @param {Object} block Block object.
 *
 * @return {boolean} Whether the block is the Day Number bound block.
 */
export function isDayNumberBindingBlock( block ) {
	return (
		block?.attributes?.metadata?.bindings?.content?.source ===
		DAY_NUMBER_BINDING_SOURCE
	);
}

/**
 * Finds the Day Number bound block among a day's real inner blocks.
 *
 * @param {Array} blocks Inner blocks.
 *
 * @return {Object|undefined} The Day Number block, if present.
 */
export function findDayNumberBlock( blocks ) {
	return ( blocks ?? [] ).find( isDayNumberBindingBlock );
}

const JUSTIFY_CONTENT_BY_TEXT_ALIGN = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
};

/**
 * Translates the Day Number block's own text alignment into a
 * justify-content value for the flex "events" row it sits in. Text-align
 * alone has no visible effect on a shrink-wrapped flex item's position
 * within its row, so the row's main-axis alignment must follow it instead.
 *
 * @param {Array} blocks Day's real inner blocks.
 *
 * @return {string|undefined} A justify-content value, or undefined to keep the CSS default.
 */
export function getDayNumberJustifyContent( blocks ) {
	const textAlign = findDayNumberBlock( blocks )?.attributes?.style
		?.typography?.textAlign;

	return JUSTIFY_CONTENT_BY_TEXT_ALIGN[ textAlign ];
}
