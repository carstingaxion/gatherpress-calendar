/**
 * GatherPress Calendar Entries Block Registration
 *
 * @package GatherPressCalendar
 * @since 0.5.0
 */

import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import './style.scss';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
