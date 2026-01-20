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
			$template_config_style = self::get_template_config_style( $attributes );

			if ( empty( $template_config_style ) ) {
				return '';
			}

			$popover_styles = array_merge(
				self::get_simple_styles( $template_config_style ),
				self::get_complex_styles( $template_config_style )
			);

			return ! empty( $popover_styles ) ? implode( '; ', $popover_styles ) : '';
		}

		/**
		 * Normalize templateConfigStyle attribute.
		 *
		 * @param array<string, mixed|null> $attributes Block attributes.
		 * @return array<string, mixed>
		 */
		private static function get_template_config_style( array $attributes ): array {
			/**
			 * Type safety.
			 *
			 * @var array<string, mixed> $style
			 */
			$style = isset( $attributes['templateConfigStyle'] ) && is_array( $attributes['templateConfigStyle'] )
				? $attributes['templateConfigStyle']
				: array();

			return $style;
		}

		/**
		 * Handle simple string-based CSS properties.
		 *
		 * @param array<string, mixed> $style Extracted custom template styling from the block attributes.
		 * @return string[]
		 */
		private static function get_simple_styles( array $style ): array {
			$map = array(
				'backgroundColor' => 'background-color',
				'borderWidth'     => 'border-width',
				'borderStyle'     => 'border-style',
				'borderColor'     => 'border-color',
				'boxShadow'       => 'box-shadow',
			);

			$styles = array();

			foreach ( $map as $key => $css_property ) {
				if ( isset( $style[ $key ] ) && is_string( $style[ $key ] ) && ! empty( $style[ $key ] ) ) {
					$styles[] = $css_property . ': ' . esc_attr( $style[ $key ] );
				}
			}

			return $styles;
		}

		/**
		 * Handle styles requiring processing.
		 *
		 * @param array<string, mixed> $style Extracted custom template styling from the block attributes.
		 * @return string[]
		 */
		private static function get_complex_styles( array $style ): array {
			$styles = array();

			if ( isset( $style['padding'] ) ) {
				$padding = self::process_padding( $style['padding'] );
				if ( ! empty( $padding ) ) {
					$styles[] = 'padding: ' . $padding;
				}
			}

			if ( isset( $style['borderRadius'] ) ) {
				$radius = self::process_border_radius( $style['borderRadius'] );
				if ( ! empty( $radius ) ) {
					$styles[] = 'border-radius: ' . $radius;
				}
			}

			return $styles;
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
