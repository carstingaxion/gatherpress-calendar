/******/ (() => { // webpackBootstrap
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/**
 * GatherPress Calendar Block Frontend Script
 *
 * Progressive enhancement for the GatherPress Calendar block.
 * This script adds interactive popover functionality to event dots,
 * but the calendar remains fully functional without JavaScript.
 *
 * Progressive Enhancement Strategy:
 * - Without JS: Event dots are clickable <a> links that navigate to posts
 * - With JS: preventDefault on click, show popover overlay with post content
 * - Keyboard accessible: Enter/Space to open, Escape to close
 * - Focus management: Popover receives focus when opened
 * - Backdrop click: Clicking outside closes popover
 *
 * Why minimal JavaScript:
 * - Core functionality works without JS (links)
 * - Better performance on slow connections
 * - Improved accessibility baseline
 * - Graceful degradation for JS-disabled browsers
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

(function () {
  'use strict';

  /**
   * Active popover element reference.
   * Used to track which popover is currently open and close it when needed.
   *
   * @type {HTMLElement|null}
   */
  let activePopover = null;

  /**
   * Active backdrop element reference.
   * The semi-transparent overlay behind the popover.
   *
   * @type {HTMLElement|null}
   */
  let activeBackdrop = null;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * Initialize popover functionality for all calendars on the page.
   *
   * Sets up event handlers for:
   * - Click/tap on event dots
   * - Keyboard interaction (Enter, Space, Escape)
   * - Backdrop clicks
   *
   * @since 0.1.0
   *
   * @return {void}
   */
  function init() {
    const calendars = document.querySelectorAll('.gatherpress-calendar');
    if (!calendars.length) return;
    calendars.forEach(setupCalendar);

    // Global escape key handler to close any open popover
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activePopover) {
        closePopover();
      }
    });
  }

  /**
   * Setup event handlers for a single calendar.
   *
   * Iterates through all event dots in the calendar and attaches:
   * - Click handler (prevents default navigation)
   * - Keyboard handler (Enter/Space keys)
   * - ARIA attributes for accessibility
   *
   * @since 0.1.0
   *
   * @param {HTMLElement} calendar - The calendar container element.
   *
   * @return {void}
   */
  function setupCalendar(calendar) {
    const events = calendar.querySelectorAll('.gatherpress-calendar__event');
    events.forEach(function (eventLink) {
      // Add ARIA attributes for screen readers
      eventLink.setAttribute('role', 'button');
      eventLink.setAttribute('tabindex', '0');

      // Click handler - prevent navigation, show popover
      // This is the progressive enhancement: without JS, the link works normally
      eventLink.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showPopover(eventLink);
      });

      // Keyboard support for accessibility
      // Enter and Space keys should trigger the same action as click
      eventLink.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showPopover(eventLink);
        }
      });
    });
  }

  /**
   * Show popover with event content.
   *
   * Creates and displays a popover overlay containing the event's inner blocks content.
   * The popover is positioned near the clicked event dot and includes:
   * - Post content from inner blocks (title, date, excerpt, etc.)
   * - Close button (×)
   * - Custom styling from templateConfigStyle attribute
   *
   * Position calculation:
   * - Default: Below the event dot with 10px gap
   * - If no space below: Above the event dot
   * - Horizontally centered on the dot
   * - Constrained to viewport with 10px margins
   *
   * @since 0.1.0
   *
   * @param {HTMLAnchorElement} eventLink - The event dot link element that was clicked.
   *
   * @return {void}
   *
   * @example
   * // Event link structure:
   * // <a class="gatherpress-calendar__event" data-popover-style="...">
   * //   <div>Post Title</div>
   * //   <div>Post Date</div>
   * // </a>
   */
  function showPopover(eventLink) {
    // Close any existing popover first
    if (activePopover) closePopover();

    // Extract content and custom styling
    const content = eventLink.innerHTML;
    const customStyle = eventLink.getAttribute('data-popover-style') || '';

    // Create backdrop (semi-transparent overlay)
    const backdrop = document.createElement('div');
    backdrop.className = 'gatherpress-calendar__backdrop';
    backdrop.addEventListener('click', closePopover);
    document.body.appendChild(backdrop);

    // Create popover container
    const popover = document.createElement('div');
    popover.className = 'gatherpress-calendar__popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-modal', 'true');
    if (customStyle) {
      popover.setAttribute('style', customStyle);
    }

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'gatherpress-calendar__popover-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('click', closePopover);

    // Add content and close button to popover
    popover.innerHTML = content;
    popover.appendChild(closeBtn);
    document.body.appendChild(popover);

    // Position popover near the event dot
    positionPopover(popover, eventLink);

    // Animate in (fade transition)
    // Small delay allows browser to calculate dimensions before transitioning
    setTimeout(function () {
      backdrop.classList.add('is-active');
      popover.classList.add('is-active');
    }, 10);

    // Store references for cleanup
    activePopover = popover;
    activeBackdrop = backdrop;

    // Move focus to popover for keyboard navigation
    popover.focus();

    // Setup position updates on scroll/resize
    // This keeps popover aligned with the dot even if page scrolls
    const updatePos = function () {
      if (activePopover) positionPopover(popover, eventLink);
    };
    window.addEventListener('scroll', updatePos);
    window.addEventListener('resize', updatePos);

    // Store cleanup function for later
    popover._cleanup = function () {
      window.removeEventListener('scroll', updatePos);
      window.removeEventListener('resize', updatePos);
    };
  }

  /**
   * Position popover near the event dot.
   *
   * Calculates optimal position for the popover based on:
   * - Event dot location
   * - Viewport dimensions
   * - Popover dimensions
   *
   * Positioning logic:
   * 1. Center horizontally on the dot
   * 2. Place below dot with 10px gap (default)
   * 3. If no space below, place above dot
   * 4. Constrain to viewport with 10px margins
   *
   * @since 0.1.0
   *
   * @param {HTMLElement} popover - The popover element to position.
   * @param {HTMLElement} eventLink - The event dot link element.
   *
   * @return {void}
   */
  function positionPopover(popover, eventLink) {
    const linkRect = eventLink.getBoundingClientRect();
    const popRect = popover.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 10;

    // Start with popover below the dot
    let top = linkRect.bottom + gap;
    // Center horizontally on the dot
    let left = linkRect.left + linkRect.width / 2 - popRect.width / 2;

    // Keep in viewport horizontally
    if (left < gap) left = gap;
    if (left + popRect.width > vw - gap) left = vw - popRect.width - gap;

    // Keep in viewport vertically
    // If popover would extend below viewport, show it above the dot instead
    if (top + popRect.height > vh - gap) {
      top = linkRect.top - popRect.height - gap;
    }
    // If still not enough space, clamp to viewport top
    if (top < gap) top = gap;

    // Apply calculated position
    popover.style.top = top + 'px';
    popover.style.left = left + 'px';
  }

  /**
   * Close the active popover.
   *
   * Removes the popover and backdrop from the DOM with fade-out animation.
   * Cleans up event listeners to prevent memory leaks.
   *
   * Animation sequence:
   * 1. Remove 'is-active' class (triggers CSS fade-out)
   * 2. Wait 200ms for animation to complete
   * 3. Remove elements from DOM
   * 4. Clean up references
   *
   * @since 0.1.0
   *
   * @return {void}
   */
  function closePopover() {
    if (!activePopover) return;

    // Clean up event listeners
    if (activePopover._cleanup) activePopover._cleanup();

    // Start fade-out animation
    activePopover.classList.remove('is-active');
    if (activeBackdrop) activeBackdrop.classList.remove('is-active');

    // Remove from DOM after animation completes
    setTimeout(function () {
      if (activePopover && activePopover.parentNode) {
        activePopover.parentNode.removeChild(activePopover);
      }
      if (activeBackdrop && activeBackdrop.parentNode) {
        activeBackdrop.parentNode.removeChild(activeBackdrop);
      }
      activePopover = null;
      activeBackdrop = null;
    }, 200);
  }
})();
/******/ })()
;
//# sourceMappingURL=view.js.map