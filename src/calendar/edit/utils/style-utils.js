/**
 * Convert BoxControl value to CSS string.
 *
 * BoxControl can return values in different formats (string or object with
 * individual sides). This function normalizes them to a CSS-compatible string.
 *
 * @since 0.1.0
 *
 * @param {Object|string|undefined} value - The BoxControl value.
 *
 * @return {string} CSS value string (e.g., "10px 20px 10px 20px").
 *
 * @example
 * // String input
 * boxControlToCSS('1rem') // Returns '1rem'
 *
 * @example
 * // Object input
 * boxControlToCSS({ top: '10px', right: '20px', bottom: '10px', left: '20px' })
 * // Returns '10px 20px 10px 20px'
 */
export function boxControlToCSS( value ) {
	if ( ! value ) {
		return '';
	}

	if ( typeof value === 'string' ) {
		return value;
	}

	if ( typeof value === 'object' ) {
		const { top = '0', right = '0', bottom = '0', left = '0' } = value;
		return `${ top } ${ right } ${ bottom } ${ left }`;
	}

	return '';
}

/**
 * Convert BorderControl value to CSS strings.
 *
 * BorderControl returns an object with width, style, color, and radius properties.
 * This function converts them to individual CSS property strings that can be
 * applied as inline styles.
 *
 * @since 0.1.0
 *
 * @param {Object|undefined} value - The BorderControl value object.
 *
 * @return {Object} Object containing CSS property strings:
 *   - {string} borderWidth - CSS border-width value
 *   - {string} borderStyle - CSS border-style value
 *   - {string} borderColor - CSS border-color value
 *   - {string} borderRadius - CSS border-radius value
 *
 * @example
 * borderControlToCSS({
 *   width: '2px',
 *   style: 'solid',
 *   color: '#000',
 *   radius: '4px'
 * })
 * // Returns:
 * // {
 * //   borderWidth: '2px',
 * //   borderStyle: 'solid',
 * //   borderColor: '#000',
 * //   borderRadius: '4px'
 * // }
 */
export function borderControlToCSS( value ) {
	if ( ! value ) {
		return {};
	}

	const result = {};

	if ( value.width ) {
		result.borderWidth = value.width;
	}

	if ( value.style ) {
		result.borderStyle = value.style;
	}

	if ( value.color ) {
		result.borderColor = value.color;
	}

	if ( value.radius ) {
		if ( typeof value.radius === 'string' ) {
			result.borderRadius = value.radius;
		} else if ( typeof value.radius === 'object' ) {
			const {
				topLeft = '0',
				topRight = '0',
				bottomRight = '0',
				bottomLeft = '0',
			} = value.radius;
			result.borderRadius = `${ topLeft } ${ topRight } ${ bottomRight } ${ bottomLeft }`;
		}
	}

	return result;
}
