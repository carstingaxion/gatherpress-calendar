/**
 * Shared helpers for locating the "Day Number" block - a core/paragraph
 * bound to the gatherpress/calendar-day binding source - among a calendar
 * day's real inner blocks, and reading its own visual settings so both the
 * live day and the read-only day previews can stay in sync with it.
 *
 * @package
 * @since 0.4.0
 */

import { dateI18n } from '@wordpress/date';
import { _x, sprintf } from '@wordpress/i18n';

import {
	DAY_MODAL_HEADING_FORMAT,
	DAY_MODAL_TRIGGER_FORMAT,
} from '../calendar/edit/constants';

const DAY_NUMBER_BINDING_SOURCE = 'gatherpress/calendar-day';

/**
 * Named formats of the day binding. They are not day number formats.
 */
export const NAMED_DAY_FORMATS = [
	DAY_MODAL_HEADING_FORMAT,
	DAY_MODAL_TRIGGER_FORMAT,
];

/**
 * Formats the value of the day binding, like Setup::format_day_date() in PHP.
 *
 * @since 0.8.0
 *
 * @param {string} dayDate   Date of the day, YYYY-MM-DD.
 * @param {number} dayNumber Day of the month.
 * @param {string} format    PHP date format or a named format. Empty for the day number.
 *
 * @return {string} Value of the binding.
 */
export function formatDayValue( dayDate, dayNumber, format = '' ) {
	if ( ! dayDate || ! format ) {
		return null !== dayNumber && undefined !== dayNumber
			? String( dayNumber )
			: '';
	}

	const dateObj = new Date( `${ dayDate }T12:00:00Z` );

	if ( ! NAMED_DAY_FORMATS.includes( format ) ) {
		return dateI18n( format, dateObj, 'UTC' );
	}

	const date = dateI18n(
		/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
		_x( 'l, F j, Y', 'Day modal: date', 'gatherpress-calendar' ),
		dateObj,
		'UTC'
	);

	if ( DAY_MODAL_HEADING_FORMAT === format ) {
		return date;
	}

	return sprintf(
		/* translators: %s: Date of the day, for example "Monday, October 5, 2026". */
		_x(
			'Events on %s',
			'Day modal: name of the button',
			'gatherpress-calendar'
		),
		date
	);
}

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
	const textAlign =
		findDayNumberBlock( blocks )?.attributes?.style?.typography?.textAlign;

	return JUSTIFY_CONTENT_BY_TEXT_ALIGN[ textAlign ];
}

/**
 * Resolves Gutenberg layout attributes (flex, grid, orientation, justification, alignment)
 * into standard Core classes and inline styles for virtual previews.
 *
 * @param {Object} layout - Block's layout attribute object.
 * @return {Object} { className: string, style: Object }
 */
export function getLayoutProps( layout = {} ) {
	const classes = [];
	const style = {};

	const type = layout?.type || 'default';

	if ( type === 'flex' ) {
		classes.push( 'is-layout-flex' );
		style.display = 'flex';

		const isVertical = layout.orientation === 'vertical';

		// Orientation (Row vs Column)
		if ( isVertical ) {
			classes.push( 'is-vertical' );
			style.flexDirection = 'column';
		} else {
			classes.push( 'is-horizontal' );
			style.flexDirection = 'row';
		}

		// Flex Wrap
		if ( layout.flexWrap === 'nowrap' ) {
			classes.push( 'is-nowrap' );
			style.flexWrap = 'nowrap';
		} else {
			style.flexWrap = 'wrap';
		}

		// Horizontal alignment (Justification)
		const justifyMap = {
			left: {
				className: 'is-content-justification-left',
				css: 'flex-start',
			},
			center: {
				className: 'is-content-justification-center',
				css: 'center',
			},
			right: {
				className: 'is-content-justification-right',
				css: 'flex-end',
			},
			'space-between': {
				className: 'is-content-justification-space-between',
				css: 'space-between',
			},
		};

		if ( layout.justifyContent && justifyMap[ layout.justifyContent ] ) {
			classes.push( justifyMap[ layout.justifyContent ].className );
			const cssVal = justifyMap[ layout.justifyContent ].css;

			// In vertical flex, horizontal alignment belongs to the cross axis (alignItems)
			if ( isVertical ) {
				style.alignItems =
					cssVal === 'space-between' ? 'stretch' : cssVal;
			} else {
				style.justifyContent = cssVal;
			}
		}

		// Vertical alignment
		const alignMap = {
			top: {
				className: 'is-vertically-aligned-top',
				css: 'flex-start',
			},
			center: {
				className: 'is-vertically-aligned-center',
				css: 'center',
			},
			bottom: {
				className: 'is-vertically-aligned-bottom',
				css: 'flex-end',
			},
			stretch: {
				className: 'is-vertically-aligned-stretch',
				css: 'stretch',
			},
		};

		if (
			layout.verticalAlignment &&
			alignMap[ layout.verticalAlignment ]
		) {
			classes.push( alignMap[ layout.verticalAlignment ].className );
			const cssVal = alignMap[ layout.verticalAlignment ].css;

			// In vertical flex, vertical alignment belongs to the main axis (justifyContent)
			if ( isVertical ) {
				style.justifyContent =
					cssVal === 'stretch' ? 'flex-start' : cssVal;
			} else {
				style.alignItems = cssVal;
			}
		}
	} else if ( type === 'grid' ) {
		classes.push( 'is-layout-grid' );
		style.display = 'grid';
		const columns = layout.columnFields || layout.columns;
		if ( columns ) {
			style.gridTemplateColumns = `repeat(${ columns }, minmax(0, 1fr))`;
		}
	} else if ( type === 'constrained' ) {
		classes.push( 'is-layout-constrained' );
	} else {
		classes.push( 'is-layout-flow' );
	}

	return {
		className: classes.join( ' ' ),
		style,
	};
}
