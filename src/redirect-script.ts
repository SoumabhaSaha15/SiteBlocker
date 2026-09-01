const init = () => {
  const params = new URLSearchParams(window.location.search);
  const blockedUrlString = params.get('blockedUrl');
  const siteName = document.querySelector('h1#site-name')!;
  const blockedUrl = new URL(blockedUrlString!);
  siteName.textContent = blockedUrl.hostname;
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
