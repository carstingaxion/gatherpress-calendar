/**
 * Calculate popover position near trigger element
 * 
 * Replaces: positionPopover() function from current view.js.
 * 
 * @param {HTMLElement} triggerEl - The event dot element
 * @param {HTMLElement} popoverEl - The popover element
 * @return {Object} Position object with top and left
 */
export function calculatePosition(triggerEl, popoverEl) {
  const triggerRect = triggerEl.getBoundingClientRect();
  const popoverRect = popoverEl?.getBoundingClientRect() || { width: 350, height: 200 };
  
  const gap = 10;
  const margin = 10;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  
  // Default: below and centered
  let top = triggerRect.bottom + gap;
  let left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
  
  // Keep in viewport horizontally
  if (left < margin) left = margin;
  if (left + popoverRect.width > vw - margin) {
    left = vw - popoverRect.width - margin;
  }
  
  // Keep in viewport vertically
  if (top + popoverRect.height > vh - margin) {
    // Show above if no space below
    top = triggerRect.top - popoverRect.height - gap;
  }
  if (top < margin) top = margin;
  
  return { top, left };
}

/**
 * Parse inline style string to object
 * 
 * Converts "background: #fff; padding: 1rem" to object.
 * 
 * @param {string} styleString - CSS style string
 * @return {Object} Styles object
 */
export function parseStyleString(styleString) {
  const styles = {};
  
  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[camelProperty] = value;
    }
  });
  
  return styles;
}