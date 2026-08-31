const fn = () => {
  const params = new URLSearchParams(window.location.search);
  const blockedUrl = params.get('blockedUrl') || 'Unknown URL';

  const mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.textContent = blockedUrl; // or innerHTML / setHTML if sanitized
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fn);
} else {
  fn();
}
