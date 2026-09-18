const init = () => {
  const params = new URLSearchParams(window.location.search);
  const matchedPattern = params.get('matchedPattern');
  const reason = params.get('reason');
  const siteName = document.querySelector('h1#site-name')!;
  const reasonBadge = document.querySelector('span#reason')!;
  siteName.textContent = matchedPattern ?? "";
  reasonBadge.textContent = reason ?? "Access Restricted";
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
