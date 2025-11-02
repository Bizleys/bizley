/*
  nav.js
  - Mobile navigation toggle with ARIA state management
  - Optional focus-trap support with graceful fallback
  - Active link highlighting via aria-current
*/

(function(){
  // Utility: dynamically load a script and resolve when ready
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + url));
      document.head.appendChild(s);
    });
  }

  function createLibraryTrap(container) {
    try {
      if (window.focusTrap && typeof window.focusTrap.createFocusTrap === 'function') {
        return window.focusTrap.createFocusTrap(container, {
          escapeDeactivates: false,
          clickOutsideDeactivates: true,
          allowOutsideClick: true,
          fallbackFocus: container
        });
      }
    } catch (err) {
      console.error('Error creating focus-trap:', err);
    }
    return null;
  }

  function enableFallbackTrap(navEl) {
    const navLinks = Array.from(navEl.querySelectorAll('a'));
    function keyHandler(e) {
      if (e.key !== 'Tab') return;
      if (navLinks.length === 0) return;
      const first = navLinks[0];
      const last = navLinks[navLinks.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    navEl.__fallbackKeyHandler = keyHandler;
    navEl.addEventListener('keydown', keyHandler);
  }

  function disableFallbackTrap(navEl) {
    if (navEl && navEl.__fallbackKeyHandler) {
      navEl.removeEventListener('keydown', navEl.__fallbackKeyHandler);
      delete navEl.__fallbackKeyHandler;
    }
  }

  function initNav() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav') || document.querySelector('nav ul');
    if (!nav || !toggle) return;

    // Start loading focus-trap in background
    loadScript('https://unpkg.com/focus-trap@6/dist/focus-trap.umd.js').catch(() => {
      console.warn('focus-trap library failed to load; using fallback focus handling');
    });

    let trap = null;

    // Ensure ARIA relationships
    if (!toggle.getAttribute('aria-controls') && nav.id) {
      toggle.setAttribute('aria-controls', nav.id);
    }
    nav.setAttribute('aria-hidden', nav.classList.contains('open') ? 'false' : 'true');

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      nav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

      if (isOpen) {
        if (!trap && window.focusTrap && typeof window.focusTrap.createFocusTrap === 'function') {
          trap = createLibraryTrap(nav);
        }
        if (trap) {
          try { trap.activate(); } catch (err) { console.warn('trap.activate() failed', err); }
        } else {
          enableFallbackTrap(nav);
          const first = nav.querySelector('a');
          if (first) first.focus();
        }
      } else {
        if (trap) { try { trap.deactivate(); } catch (err) {} }
        disableFallbackTrap(nav);
        toggle.focus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          nav.setAttribute('aria-hidden', 'true');
          if (trap) try { trap.deactivate(); } catch (err) {}
          disableFallbackTrap(nav);
          toggle.focus();
        }
      }
    });

    // Highlight active nav link
    const current = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const name = href.split('/').pop();
      if (name === current || (current === '' && name === 'index.html')) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initNav);
})();
