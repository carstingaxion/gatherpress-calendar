=== Query Map ===

Contributors:      WordPress Telex
Tags:              block, map, openstreetmap, geo, query-loop
Tested up to:      6.8
Stable tag:        0.1.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.0
Requires PHP:      7.4

A map block that displays Query Loop results with geographic data on an interactive OpenStreetMap. Works with any post type that has WordPress Geo Data Standard metadata, with specialized support for GatherPress events.

== Description ==

Query Map is a WordPress block that renders Query Loop results on an interactive OpenStreetMap. It integrates with the WordPress Query Loop block to display posts with geographic data as markers on a map, providing an intuitive way to visualize location-based content.

= Core Functionality =

**Query Loop Integration**
The block must be used as a child of the core Query Loop block. It reads the query context and displays matching posts as markers on an OpenStreetMap based on their geographic coordinates.

**Geographic Data Support**
- Uses WordPress Geo Data Standard for location information
- Reads geo_latitude and geo_longitude from post metadata
- For GatherPress events, uses venue coordinates from gatherpress_venue meta
- Falls back gracefully for posts without geographic data
- Supports any post type with proper geo metadata

**Interactive Map Display**
- OpenStreetMap tiles via Leaflet.js library
- Clustered markers for better performance with many posts
- Click markers to view post popover with content
- Zoom and pan controls for navigation
- Responsive design that works on all screen sizes

**Post Template System**
Uses WordPress InnerBlocks to define how each post appears in marker popovers:
- Configure once in the editor
- Supports any core post blocks (Post Title, Post Date, Post Excerpt, etc.)
- Template applies to all post markers on the map

**Progressive Enhancement**
- Without JavaScript: Displays a static list of posts with addresses
- With JavaScript: Shows interactive map with markers and popovers
- Keyboard accessible with full ARIA support
- Works on all modern browsers

= Display Features =

**Map Controls**
- Zoom in/out buttons
- Pan by dragging
- Double-click to zoom
- Scroll wheel zoom
- Touch gestures on mobile

**Marker Features**
- Color-coded by post type or category
- Custom icons available
- Cluster groups for many markers
- Popup on click showing post content
- Direct link to full post

**Customizable Styling**
Control the appearance of:
- Map height and width
- Marker colors and icons
- Popup background and borders
- Typography and spacing
- Border radius and shadows

= Technical Implementation =

**Dynamic Rendering**
The block uses server-side rendering (render.php) to:
- Access the full Query Loop context
- Generate map structure with proper post data
- Read WordPress Geo Data Standard metadata
- Apply WordPress formatting and translations

**External Dependencies**
- Leaflet.js: Industry-standard mapping library
- OpenStreetMap tiles: Free, open-source map data
- Loaded from CDN for optimal performance
- No API keys or usage limits required

**Localization**
- Map interface uses WordPress core translations
- Automatically adapts to site language
- RTL support for right-to-left languages
- Regional map tile preferences

**GatherPress Integration**
When used with GatherPress events:
- Reads venue coordinates from gatherpress_venue meta
- Automatically extracts latitude/longitude
- Falls back to WordPress Geo Data Standard if needed
- Works with GatherPress's past/upcoming event filters

= Usage Instructions =

**Basic Setup**
1. Add a Query Loop block to your page
2. Configure the Query Loop to fetch posts with geographic data
3. Inside the Query Loop, add the Query Map block
4. Add post blocks (Post Title, Post Excerpt, etc.) inside the map to define your popup template
5. The map will display all queried posts with valid coordinates

**Geographic Data Requirements**
Posts must have one of the following:
- `geo_latitude` and `geo_longitude` post meta (WordPress Geo Data Standard)
- For GatherPress events: venue with coordinates in `gatherpress_venue` meta

**Map Configuration**
- Adjust map height in the block settings
- Choose initial zoom level and center point
- Configure marker colors and clustering
- Customize popup appearance in the "Template Style" panel

**Post Types**
The block works with any post type that has geographic metadata:
- Posts: With geo coordinates in post meta
- Pages: With geo coordinates in post meta
- Custom Post Types: With geo coordinates in post meta
- GatherPress Events: Uses venue coordinates

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/query-map/`
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Add a Query Loop block to your content
4. Insert the Query Map block inside the Query Loop
5. Configure the map and post template to your needs

== Frequently Asked Questions ==

= Why must the block be inside a Query Loop? =

The block reads the Query Loop's context to determine which posts to display. This allows you to use WordPress's powerful query building interface to filter posts by taxonomy, author, geographic bounds, search terms, etc.

= How does it determine which coordinates to use? =

For GatherPress events, it uses the venue coordinates from the `gatherpress_venue` meta field. For other post types, it uses `geo_latitude` and `geo_longitude` from the WordPress Geo Data Standard.

= What if a post doesn't have coordinates? =

Posts without valid coordinates are simply not displayed on the map. The block gracefully handles missing data and only shows posts with complete geographic information.

= Does it work without JavaScript? =

Yes. Without JavaScript, the block displays a list of post titles with addresses as links. JavaScript adds the interactive map as progressive enhancement.

= How do I change what shows in the marker popup? =

Add or remove blocks inside the map block in the editor. Any blocks you add (Post Title, Post Excerpt, Post Featured Image, etc.) will appear in the popup when users click a marker.

= Can I use custom map tiles or styles? =

Currently the block uses OpenStreetMap tiles. Future versions may support custom tile providers and map styles.

= How does it handle many posts? =

The block uses marker clustering to group nearby markers together. As you zoom in, clusters break apart into individual markers. This keeps the map performant even with hundreds of posts.

= Is there a limit to how many posts can be shown? =

The map respects your Query Loop's "posts per page" setting. For best performance, we recommend limiting to 100-200 posts per map.

== Screenshots ==

1. Interactive map showing multiple post locations
2. Map configuration in the block editor
3. Marker popup showing post content
4. Marker clustering for many posts
5. Mobile responsive design
6. Template configuration interface
7. Map with custom styling
8. Query Loop integration example

== Changelog ==

= 0.1.0 =
* Initial release
* OpenStreetMap integration with Leaflet.js
* Support for WordPress Geo Data Standard
* Query Loop integration
* Marker clustering
* Interactive popovers
* Customizable popup styling
* GatherPress event support
* Responsive design
* Progressive enhancement
* Full accessibility support
* Print-friendly fallback

== Upgrade Notice ==

= 0.1.0 =
Initial release of Query Map block.

== External Services ==

This plugin relies on the following external services:

**Leaflet.js**
- Purpose: Interactive map rendering
- URL: https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
- Privacy Policy: https://github.com/Leaflet/Leaflet/blob/main/PRIVACY.md
- License: BSD-2-Clause
- Data sent: None (library loaded from CDN)

**OpenStreetMap Tiles**
- Purpose: Map imagery and geographic data
- URL: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
- Privacy Policy: https://wiki.osmfoundation.org/wiki/Privacy_Policy
- License: ODbL (Open Database License)
- Data sent: Map tile requests include coordinates of visible area

**Leaflet MarkerCluster**
- Purpose: Marker clustering for performance
- URL: https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js
- License: MIT
- Data sent: None (library loaded from CDN)

No personal data is collected or transmitted to these services. Map tile requests are made directly from the user's browser and are subject to OpenStreetMap's privacy policy.