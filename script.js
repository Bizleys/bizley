async function loadHeader() {
  try {
    const resp = await fetch('includes/header.html');
    if (!resp.ok) throw new Error('Header include not found: ' + resp.status);
    const html = await resp.text();
    const container = document.getElementById('site-header');
    if (container) container.innerHTML = html;
  } catch (err) {
    // If running over file:// the fetch may fail; log and continue.
    console.error('Failed to load header include:', err);
  }
}

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

function initSiteBehavior() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.querySelector("nav ul");
  let trap = null; // focus-trap instance if created

  // Start loading focus-trap in background. It's okay if it fails — we keep a fallback.
  loadScript('https://unpkg.com/focus-trap@6/dist/focus-trap.umd.js').catch(() => {
    // ignore - fallback will be used
    console.warn('focus-trap library failed to load; using fallback focus handling');
  });

  // Helper to create the focus-trap when available
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

  // Fallback simple trap (keeps tabbing inside nav)
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

  if (toggle && nav) {
    toggle.addEventListener("click", async () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen) {
        // Try to create a library trap if not already created and library loaded
        if (!trap && window.focusTrap && typeof window.focusTrap.createFocusTrap === 'function') {
          trap = createLibraryTrap(nav);
        }

        // Activate library trap if present
        if (trap) {
          try { trap.activate(); } catch (err) { console.warn('trap.activate() failed', err); }
        } else {
          // Fallback: enable small tab-loop trap
          enableFallbackTrap(nav);
          // focus first link
          const first = nav.querySelector('a');
          if (first) first.focus();
        }
      } else {
        // close: deactivate trap / remove fallback
        if (trap) {
          try { trap.deactivate(); } catch (err) { /* ignore */ }
        }
        disableFallbackTrap(nav);
        toggle.focus();
      }
    });

    // Keep Escape behavior to close menu and return focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          if (trap) try { trap.deactivate(); } catch (err) {}
          disableFallbackTrap(nav);
          toggle.focus();
        }
      }
    });
  }

  // Highlight active nav link based on current page
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const name = href.split('/').pop();
    if (name === current || (current === '' && name === 'index.html')) {
      a.classList.add('active');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('site-header');
  // Only fetch the include if the placeholder exists and is empty
  if (container && container.innerHTML.trim().length === 0) {
    await loadHeader();
  }
  const footerContainer = document.getElementById('site-footer');
  if (footerContainer && footerContainer.innerHTML.trim().length === 0) {
    try {
      const resp = await fetch('includes/footer.html');
      if (resp.ok) {
        footerContainer.innerHTML = await resp.text();
      }
    } catch (err) {
      console.error('Failed to load footer include:', err);
    }
  }
  initSiteBehavior();
});