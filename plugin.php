<?php
/**
 * Plugin Name:       GatherPress Calendar
 * Plugin URI:        https://github.com/carstingaxion/gatherpress-calendar
 * Description:       A calendar block that displays Query Loop results in a monthly calendar format. Works with any post type, with specialized support for GatherPress events.
 * Version:           0.4.1
 * Requires at least: 7.0
 * Requires PHP:      7.4
 * Requires Plugins:  gatherpress
 * Author:            carstenbach & WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gatherpress-calendar
 *
 * @package GatherPressCalendar
 */

declare(strict_types=1);

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

// Constants.
define( 'GATHERPRESS_CALENDAR_VERSION', current( get_file_data( __FILE__, array( 'Version' ), 'plugin' ) ) );
define( 'GATHERPRESS_CALENDAR_CORE_PATH', __DIR__ );

/**
 * Adds the GatherPress_Calendar namespace to the autoloader.
 *
 * This function hooks into the 'gatherpress_autoloader' filter and adds the
 * GatherPress_Calendar namespace to the list of namespaces with its core path.
 *
 * @param string[] $namespaces An associative array of namespaces and their paths.
 * @return string[] Modified array of namespaces and their paths.
 */
function gatherpress_calendar_autoloader( array $namespaces ): array {
	$namespaces['GatherPress_Calendar'] = GATHERPRESS_CALENDAR_CORE_PATH;

	return $namespaces;
}
add_filter( 'gatherpress_autoloader', 'gatherpress_calendar_autoloader' );

/**
 * Boots the GatherPress Calendar runtime.
 *
 * Hooked on `gatherpress_loaded`, which GatherPress fires only after its own
 * requirements check passes.
 *
 * @return void
 */
function gatherpress_calendar_setup(): void {
	GatherPress_Calendar\Setup::get_instance();
	GatherPress_Calendar\Calendar::get_instance();
	GatherPress_Calendar\Calendar_Week::get_instance();
	GatherPress_Calendar\Calendar_Day::get_instance();
	GatherPress_Calendar\Calendar_Entries::get_instance();
}
add_action( 'gatherpress_loaded', 'gatherpress_calendar_setup' );
