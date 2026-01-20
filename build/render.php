<?php
/**
 * GatherPress Calendar Block Render Template
 *
 * This file handles the server-side rendering of the GatherPress Calendar block
 * using separate classes for better organization and maintainability.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content (inner blocks).
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

declare(strict_types=1);

namespace GatherPress\Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

require_once GATHERPRESS_CALENDAR_CORE_PATH . '/includes/classes/class-date-calculator.php';
require_once GATHERPRESS_CALENDAR_CORE_PATH . '/includes/classes/class-query-builder.php';
require_once GATHERPRESS_CALENDAR_CORE_PATH . '/includes/classes/class-post-organizer.php';
require_once GATHERPRESS_CALENDAR_CORE_PATH . '/includes/classes/class-calendar-structure-builder.php';
require_once GATHERPRESS_CALENDAR_CORE_PATH . '/includes/classes/class-style-processor.php';
require_once GATHERPRESS_CALENDAR_CORE_PATH . '/includes/classes/class-html-renderer.php';
require_once GATHERPRESS_CALENDAR_CORE_PATH . '/includes/classes/class-block-renderer.php';

/**
 * Extract and sanitize block attributes and render the block.
 *
 * @var array{
 *   selectedMonth: string,
 *   monthModifier: int,
 *   templateConfigStyle: array<string, mixed>,
 *   showMonthHeading: bool,
 *   monthHeadingLevel: int,
 * } $attributes
 * @var string $content
 * @var \WP_Block $block
 */
echo Block_Renderer::get_instance()->render( $attributes, $content, $block ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
