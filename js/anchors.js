/*
  anchors.js
  - Smooth scrolling for in-page anchors
  - Skip-link enhancement: moves keyboard focus to main content
*/

(function(){
  function onAnchorClick(e) {
    const href = this.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });

    // For skip links and main anchors, move focus
    if (this.classList.contains('skip-link') || href === '#main-content' || target.tagName.toLowerCase() === 'main') {
      const prevTabIndex = target.getAttribute('tabindex');
      if (!prevTabIndex) target.setAttribute('tabindex', '-1');
      setTimeout(() => {
        try { target.focus({ preventScroll: true }); } catch (err) { target.focus(); }
        if (!prevTabIndex) target.removeAttribute('tabindex');
      }, 150);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', onAnchorClick));
  });
})();
