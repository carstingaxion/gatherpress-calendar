/******/ (() => { // webpackBootstrap
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/**
 * GatherPress Calendar Block Frontend Script
 *
 * This file contains JavaScript code that runs on the frontend of the site
 * for posts/pages containing the GatherPress Calendar block. It progressively
 * enhances the calendar by:
 * 1. Intercepting link clicks to show popovers instead of navigating
 * 2. Adding minimal class toggle for day card zoom on narrow screens
 * 3. Applying custom styles from attributes to popovers
 *
 * Progressive Enhancement:
 * 1. Without JS: Dots are links that navigate to posts
 * 2. With JS: 
 *    - Dots show popovers with event details on larger screens
 *    - Days use CSS-only zoom triggered by .is-zoomed class on smaller screens
 *    - Popovers use custom styling from block attributes
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

/**
 * Initialize the GatherPress Calendar block frontend functionality
 *
 * Sets up event listeners and interactive features for the calendar,
 * including popover creation and click/touch handling for event dots.
 * This is progressive enhancement - without JS, the dots work as regular links.
 *
 * @since 0.1.0
 *
 * @return {void}
 */
(function initGatherPressCalendar() {
  'use strict';

  /**
   * Currently active popover element
   *
   * @type {HTMLElement|null}
   */
  let activePopover = null;

  /**
   * Currently active backdrop element
   *
   * @type {HTMLElement|null}
   */
  let activeBackdrop = null;

  /**
   * Wait for DOM to be ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * Initialize calendar functionality
   *
   * @since 0.1.0
   *
   * @return {void}
   */
  function init() {
    const calendars = document.querySelectorAll('.gatherpress-calendar');
    if (!calendars.length) {
      return;
    }
    calendars.forEach(function (calendar) {
      setupEventDotHandlers(calendar);
      setupDayCardHandlers(calendar);
    });

    // Close popover on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activePopover) {
        closePopover();
      }
    });

    // Log initialization
    if (window.console && window.console.log) {
      // eslint-disable-next-line no-console
      console.log('GatherPress Calendar: Initialized ' + calendars.length + ' calendar(s) with progressive enhancement');
    }
  }

  /**
   * Setup click handlers for day cards on narrow screens
   *
   * Adds click handlers to the entire table cell that toggle the 'is-zoomed' class.
   * CSS handles the actual zoom transform based on this class.
   *
   * @since 0.1.0
   *
   * @param {HTMLElement} calendar - The calendar element.
   *
   * @return {void}
   */
  function setupDayCardHandlers(calendar) {
    const dayCells = calendar.querySelectorAll('.gatherpress-calendar__table td.has-posts');
    dayCells.forEach(function (dayCell) {
      // Click handler to toggle the zoom class - applies to entire td
      dayCell.addEventListener('click', function (e) {
        // If click is on an event dot, let that handler take over
        if (e.target.closest('.gatherpress-calendar__event')) {
          return;
        }
        e.stopPropagation();

        // Toggle zoomed state on the table cell
        dayCell.classList.toggle('is-zoomed');
      });
    });

    // Close expanded day when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.gatherpress-calendar__table td')) {
        // Remove zoom class from all cells
        const zoomedCells = calendar.querySelectorAll('.gatherpress-calendar__table td.is-zoomed');
        zoomedCells.forEach(function (cell) {
          cell.classList.remove('is-zoomed');
        });
      }
    });
  }

  /**
   * Setup click/touch handlers for event dots in the calendar
   *
   * Progressively enhances the event dots (which are links) to show
   * popovers instead of navigating. If JS fails, links work normally.
   *
   * @since 0.1.0
   *
   * @param {HTMLElement} calendar - The calendar element.
   *
   * @return {void}
   */
  function setupEventDotHandlers(calendar) {
    const events = calendar.querySelectorAll('.gatherpress-calendar__event');
    events.forEach(function (eventLink) {
      // Add accessibility attributes
      eventLink.setAttribute('role', 'button');

      // Handle click/touch - prevent default navigation and show popover
      eventLink.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showPopover(eventLink);
      });

      // Handle keyboard accessibility
      eventLink.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showPopover(eventLink);
        }
      });
    });
  }

  /**
   * Show popover with event details
   *
   * Creates and positions a popover element containing the event's
   * inner block content. Applies custom styles from block attributes.
   *
   * @since 0.1.0
   *
   * @param {HTMLElement} eventLink - The event link element that was clicked.
   *
   * @return {void}
   */
  function showPopover(eventLink) {
    // Close any existing popover
    if (activePopover) {
      closePopover();
    }

    // Get the event content
    const eventContent = eventLink.innerHTML;

    // Get custom styles from data attribute
    const customStyles = eventLink.getAttribute('data-popover-style') || '';

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'gatherpress-calendar__event-backdrop';
    backdrop.addEventListener('click', closePopover);
    document.body.appendChild(backdrop);

    // Create popover
    const popover = document.createElement('div');
    popover.className = 'gatherpress-calendar__event-popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-modal', 'true');

    // Apply custom styles if provided
    if (customStyles) {
      popover.setAttribute('style', customStyles);
    }

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'gatherpress-calendar__event-popover-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', closePopover);

    // Add content and close button to popover
    popover.innerHTML = eventContent;
    popover.appendChild(closeButton);

    // Add popover to body
    document.body.appendChild(popover);

    // Position popover
    positionPopover(popover, eventLink);

    // Show with animation
    setTimeout(function () {
      backdrop.classList.add('is-active');
      popover.classList.add('is-active');
    }, 10);

    // Store references
    activePopover = popover;
    activeBackdrop = backdrop;

    // Focus the popover for accessibility
    popover.focus();

    // Update position on scroll/resize
    const updatePosition = function () {
      if (activePopover) {
        positionPopover(popover, eventLink);
      }
    };
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    // Store cleanup function
    popover._cleanup = function () {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }

  /**
   * Position popover relative to the event dot
   *
   * @since 0.1.0
   *
   * @param {HTMLElement} popover - The popover element.
   * @param {HTMLElement} eventLink - The event link element.
   *
   * @return {void}
   */
  function positionPopover(popover, eventLink) {
    const linkRect = eventLink.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const spacing = 10;
    let top = linkRect.bottom + spacing;
    let left = linkRect.left + linkRect.width / 2 - popoverRect.width / 2;

    // Adjust horizontal position if popover goes off screen
    if (left < spacing) {
      left = spacing;
    } else if (left + popoverRect.width > viewportWidth - spacing) {
      left = viewportWidth - popoverRect.width - spacing;
    }

    // Adjust vertical position if popover goes below viewport
    if (top + popoverRect.height > viewportHeight - spacing) {
      top = linkRect.top - popoverRect.height - spacing;
    }

    // Ensure popover doesn't go above viewport
    if (top < spacing) {
      top = spacing;
    }
    popover.style.top = top + 'px';
    popover.style.left = left + 'px';
  }

  /**
   * Close the active popover
   *
   * @since 0.1.0
   *
   * @return {void}
   */
  function closePopover() {
    if (!activePopover) {
      return;
    }

    // Run cleanup
    if (activePopover._cleanup) {
      activePopover._cleanup();
    }

    // Hide with animation
    activePopover.classList.remove('is-active');
    if (activeBackdrop) {
      activeBackdrop.classList.remove('is-active');
    }

    // Remove elements after animation
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