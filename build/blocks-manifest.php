<?php
// This file is generated. Do not modify it manually.
return array(
	'calendar' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'gatherpress/calendar',
		'version' => '0.4.0',
		'title' => 'GatherPress Calendar',
		'category' => 'gatherpress',
		'icon' => 'calendar-alt',
		'description' => 'Display query loop posts in a monthly calendar format.',
		'ancestor' => array(
			'core/query'
		),
		'allowedBlocks' => array(
			'gatherpress/calendar-week'
		),
		'usesContext' => array(
			'queryId',
			'query',
			'queryContext',
			'displayLayout',
			'templateSlug',
			'previewPostType'
		),
		'attributes' => array(
			'selectedMonth' => array(
				'type' => 'string',
				'default' => ''
			),
			'monthModifier' => array(
				'type' => 'number',
				'default' => 0
			),
			'templateConfigStyle' => array(
				'type' => 'object',
				'default' => array(
					
				)
			),
			'showMonthHeading' => array(
				'type' => 'boolean',
				'default' => true
			),
			'monthHeadingLevel' => array(
				'type' => 'number',
				'default' => 2
			),
			'showWeekdays' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'supports' => array(
			'interactivity' => true,
			'reusable' => false,
			'html' => false,
			'align' => true,
			'alignWide' => true,
			'customClassName' => true,
			'color' => array(
				'gradients' => false,
				'link' => false,
				'text' => false,
				'__experimentalDefaultControls' => array(
					'background' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'layout' => array(
				'allowEditing' => false
			)
		),
		'textdomain' => 'gatherpress-calendar',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScriptModule' => 'file:./view.js'
	),
	'calendar-day' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'gatherpress/calendar-day',
		'version' => '0.4.0',
		'title' => 'Calendar Day',
		'category' => 'gatherpress',
		'icon' => 'calendar',
		'description' => 'An individual day cell inside the GatherPress Calendar grid.',
		'parent' => array(
			'gatherpress/calendar-week',
			'gatherpress/calendar'
		),
		'usesContext' => array(
			'queryId',
			'gatherpress/year',
			'gatherpress/month',
			'gatherpress/dayDate',
			'gatherpress/dayNumber',
			'gatherpress/dayPosts',
			'gatherpress/isEmpty',
			'gatherpress/isToday',
			'gatherpress/popoverStyles'
		),
		'providesContext' => array(
			'gatherpress/dayDate' => 'date',
			'gatherpress/dayNumber' => 'day',
			'gatherpress/dayPosts' => 'posts',
			'gatherpress/isEmpty' => 'isEmpty',
			'gatherpress/isToday' => 'isToday'
		),
		'attributes' => array(
			'date' => array(
				'type' => 'string',
				'default' => ''
			),
			'day' => array(
				'type' => 'number',
				'default' => 0
			),
			'isEmpty' => array(
				'type' => 'boolean',
				'default' => false
			),
			'isToday' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'supports' => array(
			'interactivity' => true,
			'html' => false,
			'reusable' => false,
			'customClassName' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'shadow' => true,
			'listView' => true,
			'contentRole' => true,
			'spacing' => array(
				'padding' => true,
				'margin' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'width' => true
				)
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontWeight' => true
			)
		),
		'textdomain' => 'gatherpress-calendar',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'calendar-entries' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'gatherpress/calendar-entries',
		'version' => '0.1.0',
		'title' => 'Calendar Entries',
		'category' => 'gatherpress',
		'icon' => 'list-view',
		'description' => 'Lists a calendar day\'s events, one per event. Works like the Post Template block: its inner blocks are the template used to render each event - for now, that template is only used for the event\'s popover content.',
		'parent' => array(
			'gatherpress/calendar-day'
		),
		'usesContext' => array(
			'gatherpress/dayDate',
			'gatherpress/dayPosts',
			'gatherpress/isEmpty',
			'gatherpress/popoverStyles'
		),
		'attributes' => array(
			'layout' => array(
				'type' => 'object',
				'default' => array(
					'type' => 'default'
				)
			)
		),
		'supports' => array(
			'interactivity' => true,
			'html' => false,
			'reusable' => false,
			'layout' => array(
				'allowSwitching' => true,
				'allowInheriting' => false,
				'allowSizingOnChildren' => false,
				'default' => array(
					'type' => 'default'
				)
			),
			'color' => array(
				'background' => true,
				'text' => true,
				'gradients' => true
			),
			'contentRole' => true
		),
		'textdomain' => 'gatherpress-calendar',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'calendar-week' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'gatherpress/calendar-week',
		'version' => '0.4.0',
		'title' => 'Calendar Week',
		'category' => 'gatherpress',
		'icon' => 'table-row-after',
		'description' => 'A week row container in the GatherPress Calendar grid.',
		'parent' => array(
			'gatherpress/calendar'
		),
		'allowedBlocks' => array(
			'gatherpress/calendar-day'
		),
		'usesContext' => array(
			'queryId',
			'gatherpress/year',
			'gatherpress/month',
			'gatherpress/weekIndex',
			'gatherpress/weekDays',
			'gatherpress/popoverStyles',
			'gatherpress/activeDate',
			'gatherpress/setActiveDate'
		),
		'providesContext' => array(
			'gatherpress/weekIndex' => 'weekIndex'
		),
		'attributes' => array(
			'weekIndex' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'supports' => array(
			'interactivity' => true,
			'html' => false,
			'reusable' => false,
			'customClassName' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'gradients' => true
			),
			'spacing' => array(
				'padding' => true,
				'margin' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			)
		),
		'textdomain' => 'gatherpress-calendar',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	)
);
