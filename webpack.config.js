const defaultConfig = require('@wordpress/scripts/config/webpack.config');
module.exports = {
	...defaultConfig[0],
	entry: {
		'calendar/index': './src/calendar/index.js',
		'calendar/view': './src/calendar/view.js',
		'calendar-week/index': './src/calendar-week/index.js',
		// 'calendar-week/view': './src/calendar-week/view.js',
		'calendar/view': './src/calendar/view.js',
		'calendar-day/index': './src/calendar-day/index.js',
		'calendar-day/view': './src/calendar-day/view.js',
	},
};
