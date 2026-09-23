<?php
/**
 * GatherPress Calendar Style Processor
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

/**
 * Style_Processor Class
 *
 * Processes block attributes into CSS style strings.
 *
 * @since 0.1.0
 */
class Style_Processor {

	/**
	 * Extract and resolve blockGap attribute to a valid CSS gap string.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return string CSS gap value (e.g., 'var(--wp--preset--spacing--50)' or '10px 20px') or empty string.
	 */
	public static function get_block_gap_value( array $attributes ): string {
		$block_gap = $attributes['style']['spacing']['blockGap'] ?? null;

		if ( empty( $block_gap ) ) {
			return '';
		}

		if ( is_string( $block_gap ) ) {
			return self::resolve_preset_value( $block_gap );
		}

		// Handle axial/split (vertical and horizontal) gap objects.
		if ( is_array( $block_gap ) ) {
			$top  = isset( $block_gap['top'] ) ? self::resolve_preset_value( (string) $block_gap['top'] ) : '1px';
			$left = isset( $block_gap['left'] ) ? self::resolve_preset_value( (string) $block_gap['left'] ) : '1px';

			return "{$top} {$left}";
		}

		return '';
	}

	/**
	 * Resolve Gutenberg 'var:preset|spacing|50' shorthand to standard CSS 'var(...)'.
	 *
	 * @param string $value Raw attribute value.
	 *
	 * @return string Resolved CSS string.
	 */
	public static function resolve_preset_value( string $value ): string {
		if ( strpos( $value, 'var:preset|' ) === 0 ) {
			$parts = explode( '|', $value );
			if ( count( $parts ) === 3 ) {
				return sprintf( 'var(--wp--preset--%s--%s)', $parts[1], $parts[2] );
			}
		}

		return esc_attr( $value );
	}
}
