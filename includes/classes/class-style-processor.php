<?php
/**
 * GatherPress Calendar Style Processor
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress\Calendar;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.


if ( ! class_exists( '\GatherPress\Calendar\Style_Processor' ) ) {
	/**
	 * Style_Processor Class
	 *
	 * Processes block attributes into CSS style strings.
	 *
	 * @since 0.1.0
	 */
	class Style_Processor {

		/**
		 * Prepare popover inline styles.
		 *
		 * @since 0.1.0
		 *
		 * @param array<string, mixed> $attributes Block attributes.
		 *
		 * @return string Inline style attribute value.
		 */
		public static function prepare_popover_styles( array $attributes ): string {
			/** @var array<string, mixed> $template_config_style */
			$template_config_style = isset( $attributes['templateConfigStyle'] ) && is_array( $attributes['templateConfigStyle'] ) ? $attributes['templateConfigStyle'] : array();
			$popover_styles        = array();

			if ( isset( $template_config_style['backgroundColor'] ) && is_string( $template_config_style['backgroundColor'] ) && '' !== $template_config_style['backgroundColor'] ) {
				$popover_styles[] = 'background-color: ' . esc_attr( $template_config_style['backgroundColor'] );
			}

			if ( isset( $template_config_style['padding'] ) ) {
				$padding_str = self::process_padding( $template_config_style['padding'] );
				if ( ! empty( $padding_str ) ) {
					$popover_styles[] = 'padding: ' . $padding_str;
				}
			}

			if ( isset( $template_config_style['borderWidth'] ) && is_string( $template_config_style['borderWidth'] ) && '' !== $template_config_style['borderWidth'] ) {
				$popover_styles[] = 'border-width: ' . esc_attr( $template_config_style['borderWidth'] );
			}

			if ( isset( $template_config_style['borderStyle'] ) && is_string( $template_config_style['borderStyle'] ) && '' !== $template_config_style['borderStyle'] ) {
				$popover_styles[] = 'border-style: ' . esc_attr( $template_config_style['borderStyle'] );
			}

			if ( isset( $template_config_style['borderColor'] ) && is_string( $template_config_style['borderColor'] ) && '' !== $template_config_style['borderColor'] ) {
				$popover_styles[] = 'border-color: ' . esc_attr( $template_config_style['borderColor'] );
			}

			if ( isset( $template_config_style['borderRadius'] ) ) {
				$radius_str = self::process_border_radius( $template_config_style['borderRadius'] );
				if ( ! empty( $radius_str ) ) {
					$popover_styles[] = 'border-radius: ' . $radius_str;
				}
			}

			if ( isset( $template_config_style['boxShadow'] ) && is_string( $template_config_style['boxShadow'] ) && '' !== $template_config_style['boxShadow'] ) {
				$popover_styles[] = 'box-shadow: ' . esc_attr( $template_config_style['boxShadow'] );
			}

			return ! empty( $popover_styles ) ? implode( '; ', $popover_styles ) : '';
		}

		/**
		 * Process padding value.
		 *
		 * @since 0.1.0
		 *
		 * @param mixed $padding Padding value.
		 *
		 * @return string Processed padding string.
		 */
		private static function process_padding( $padding ): string {
			if ( is_array( $padding ) ) {
				$padding_str  = '';
				$padding_str .= isset( $padding['top'] ) && is_string( $padding['top'] ) ? esc_attr( $padding['top'] ) . ' ' : '0 ';
				$padding_str .= isset( $padding['right'] ) && is_string( $padding['right'] ) ? esc_attr( $padding['right'] ) . ' ' : '0 ';
				$padding_str .= isset( $padding['bottom'] ) && is_string( $padding['bottom'] ) ? esc_attr( $padding['bottom'] ) . ' ' : '0 ';
				$padding_str .= isset( $padding['left'] ) && is_string( $padding['left'] ) ? esc_attr( $padding['left'] ) : '0';
				return trim( $padding_str );
			} elseif ( is_string( $padding ) && '' !== $padding ) {
				return esc_attr( $padding );
			}
			return '';
		}

		/**
		 * Process border radius value.
		 *
		 * @since 0.1.0
		 *
		 * @param mixed $border_radius Border radius value.
		 *
		 * @return string Processed border radius string.
		 */
		private static function process_border_radius( $border_radius ): string {
			if ( is_array( $border_radius ) ) {
				$radius_str  = '';
				$radius_str .= isset( $border_radius['topLeft'] ) && is_string( $border_radius['topLeft'] ) ? esc_attr( $border_radius['topLeft'] ) . ' ' : '0 ';
				$radius_str .= isset( $border_radius['topRight'] ) && is_string( $border_radius['topRight'] ) ? esc_attr( $border_radius['topRight'] ) . ' ' : '0 ';
				$radius_str .= isset( $border_radius['bottomRight'] ) && is_string( $border_radius['bottomRight'] ) ? esc_attr( $border_radius['bottomRight'] ) . ' ' : '0 ';
				$radius_str .= isset( $border_radius['bottomLeft'] ) && is_string( $border_radius['bottomLeft'] ) ? esc_attr( $border_radius['bottomLeft'] ) : '0';
				return trim( $radius_str );
			} elseif ( is_string( $border_radius ) && '' !== $border_radius ) {
				return esc_attr( $border_radius );
			}
			return '';
		}
	}
}
