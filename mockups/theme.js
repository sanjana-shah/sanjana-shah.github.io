(() => {
  const storageKey = 'sanjana-color-mode';
  const valid = mode => mode === 'day' || mode === 'night';
  const url = new URL(location.href);
  const requested = url.searchParams.get('mode');
  const legacy = url.searchParams.get('concept');
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch {}
  let mode = valid(requested) ? requested
    : legacy ? (legacy === 'night' ? 'night' : 'day')
    : valid(saved) ? saved : 'day';

  function apply(next, persist = true) {
    mode = next;
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode === 'night' ? 'dark' : 'light';
    if (persist) {
      try { localStorage.setItem(storageKey, mode); } catch {}
    }
    const current = new URL(location.href);
    current.searchParams.delete('concept');
    current.searchParams.set('mode', mode);
    history.replaceState(null, '', current);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-checked', String(mode === 'night'));
    });
    document.querySelectorAll('[data-mode-label]').forEach(label => {
      label.textContent = mode === 'night' ? 'Night' : 'Day';
    });
    document.querySelectorAll('[data-resume-link], [data-back-home], [data-mode-link]').forEach(link => {
      const target = new URL(link.getAttribute('href'), location.href);
      target.searchParams.delete('concept');
      target.searchParams.set('mode', mode);
      link.href = target.href;
    });
  }

  // Set colors before the page paints, then initialize controls once they exist.
  apply(mode);
  document.addEventListener('DOMContentLoaded', () => {
    apply(mode, false);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => apply(mode === 'day' ? 'night' : 'day'));
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey && valid(event.newValue)) apply(event.newValue, false);
  });
  window.addEventListener('pageshow', () => {
    try {
      const current = localStorage.getItem(storageKey);
      if (valid(current) && current !== mode) apply(current, false);
    } catch {}
  });
})();
