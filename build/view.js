/******/ (() => { // webpackBootstrap
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/**
 * Query Map Block Frontend Script
 *
 * Initializes OpenStreetMap via Leaflet and displays posts with geo data as clustered markers.
 * Depends on Leaflet and Leaflet MarkerCluster being loaded first via wp_enqueue_script.
 *
 * @package QueryMap
 * @since 0.1.0
 */

(function () {
  'use strict';

  // Wait for DOM and Leaflet to be ready
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded');
    return;
  }
  if (typeof L.markerClusterGroup === 'undefined') {
    console.error('Leaflet MarkerCluster library not loaded');
    return;
  }
  function initializeMaps() {
    const mapContainers = document.querySelectorAll('.gatherpress-query-map__map');
    mapContainers.forEach(function (container) {
      const postsData = container.getAttribute('data-posts');
      const defaultZoom = parseInt(container.getAttribute('data-zoom') || '10', 10);
      if (!postsData) {
        return;
      }
      let posts;
      try {
        posts = JSON.parse(postsData);
      } catch (e) {
        console.error('Failed to parse posts data:', e);
        return;
      }
      if (!posts || posts.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: #666;">No posts with geographic data found.</p>';
        return;
      }

      // Initialize map centered on first post
      const firstPost = posts[0];
      const map = L.map(container).setView([firstPost.lat, firstPost.lng], defaultZoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Create marker cluster group
      const markersCluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 18
      });

      // Add markers for each post
      const bounds = [];
      posts.forEach(function (post) {
        const marker = L.marker([post.lat, post.lng]);

        // Bind popup with post content
        if (post.content) {
          marker.bindPopup(post.content, {
            maxWidth: 300,
            className: 'query-map-popup'
          });
        }
        markersCluster.addLayer(marker);
        bounds.push([post.lat, post.lng]);
      });

      // Add cluster group to map
      map.addLayer(markersCluster);

      // Fit map to show all markers if there are multiple
      if (bounds.length > 1) {
        map.fitBounds(bounds, {
          padding: [50, 50]
        });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], defaultZoom);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMaps);
  } else {
    initializeMaps();
  }
})();
/******/ })()
;
//# sourceMappingURL=view.js.map