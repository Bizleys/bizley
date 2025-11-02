/*
  header.js
  - Loads shared header and footer HTML includes
  - Keeps DOM manipulation minimal and resilient to file:// contexts
*/

async function loadInclude(targetId, url) {
  const container = document.getElementById(targetId);
  if (!container) return;
  if (container.innerHTML.trim().length > 0) return; // already populated
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Include not found: ${url} (${resp.status})`);
    container.innerHTML = await resp.text();
  } catch (err) {
    // When opening from file://, fetch may fail — fail silently in UI, log in console.
    console.warn(`Failed to load include ${url}:`, err);
  }
}

// Initialize on DOM ready
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    loadInclude('site-header', 'includes/header.html');
    loadInclude('site-footer', 'includes/footer.html');
  });
})();
